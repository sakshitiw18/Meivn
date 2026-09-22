"""
Authentication: email/password signup+login, Google Sign-In, and the
get_current_user dependency used to protect the Settings endpoints.

Sessions: every successful signup/login creates a SessionLog row (device =
browser User-Agent), and the returned token is tied to that session's id.
Settings -> Security's "Active sessions" / "Login history" / "Revoke" /
"Log out of all devices" all operate on these same rows.
"""
import json
import base64

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import User, SessionLog
from app.schemas import SignupRequest, LoginRequest, GoogleAuthRequest, AuthResponse, UserOut
from app.security import hash_password, verify_password, create_token, verify_token

router = APIRouter(prefix="/api/auth", tags=["auth"])
settings = get_settings()

bearer_scheme = HTTPBearer(auto_error=False)

GUEST_EMAIL = "guest@local"


def _get_or_create_guest_user(db: Session) -> User:
    """
    Single shared account used for anyone browsing the platform without
    signing in — this is what makes Dashboard/Settings/etc. work exactly
    like they did before sign-in existed, for visitors who never sign up.
    """
    guest = db.query(User).filter(User.email == GUEST_EMAIL).first()

    if not guest:
        guest = User(
            name="Guest",
            email=GUEST_EMAIL,
            username="guest",
            auth_provider="guest",
        )
        db.add(guest)
        db.commit()
        db.refresh(guest)

    return guest


# ---------------------------------------------------------------------------
# get_current_user — used by this router and by routers/settings.py
# ---------------------------------------------------------------------------

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if not credentials:
        raise HTTPException(status_code=401, detail="Not signed in")

    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Your session has expired — please sign in again")

    session = db.query(SessionLog).filter(SessionLog.id == payload["session_id"]).first()
    if not session or session.revoked:
        raise HTTPException(status_code=401, detail="This session has been signed out")

    user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not user:
        raise HTTPException(status_code=401, detail="Account not found")

    return user


def get_current_user_or_guest(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Used by routers/settings.py instead of get_current_user, so the whole
    platform (Dashboard, Projects, Settings, etc.) stays open to everyone —
    no sign-in required. If a valid session token IS present, that user's
    own settings/data are used; otherwise everyone shares one "Guest"
    account, matching how the app behaved before sign-in existed. Signing
    in remains available for anyone who wants their own separate account —
    it's just never required.
    """
    if credentials:
        payload = verify_token(credentials.credentials)
        if payload:
            session = db.query(SessionLog).filter(SessionLog.id == payload["session_id"]).first()
            if session and not session.revoked:
                user = db.query(User).filter(User.id == payload["user_id"]).first()
                if user:
                    return user

    return _get_or_create_guest_user(db)


def _create_session_and_token(db: Session, user: User, request: Request) -> str:
    device = request.headers.get("user-agent", "Unknown device")[:255]

    db.query(SessionLog).filter(SessionLog.user_id == user.id).update({SessionLog.is_current: False})
    session = SessionLog(user_id=user.id, device=device, is_current=True)
    db.add(session)
    db.commit()
    db.refresh(session)

    return create_token(user.id, session.id)


# ---------------------------------------------------------------------------
# Signup / Login
# ---------------------------------------------------------------------------

@router.post("/signup", response_model=AuthResponse)
def signup(payload: SignupRequest, request: Request, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        if existing.auth_provider == "google":
            raise HTTPException(
                status_code=400,
                detail="This email is already signed up via Google — use \"Continue with Google\" instead.",
            )
        raise HTTPException(status_code=400, detail="An account with this email already exists — try signing in instead.")

    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    username = payload.username or email.split("@")[0]
    if db.query(User).filter(User.username == username).first():
        username = f"{username}{__import__('random').randint(100, 999)}"

    salt, hashed = hash_password(payload.password)

    user = User(
        name=payload.name.strip(),
        email=email,
        username=username,
        password_salt=salt,
        password_hash=hashed,
        auth_provider="local",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = _create_session_and_token(db, user, request)
    return {"token": token, "user": user}


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()

    if not user or user.auth_provider != "local" or not verify_password(payload.password, user.password_salt, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = _create_session_and_token(db, user, request)
    return {"token": token, "user": user}


# ---------------------------------------------------------------------------
# Google Sign-In
#
# NOTE ON SECURITY: this decodes the Google ID token's payload to read the
# email/name/sub claims, but does NOT cryptographically verify Google's
# signature (that requires the `google-auth` package + network access to
# fetch Google's public certs). For production use, verify the credential
# server-side with google.oauth2.id_token.verify_oauth2_token before
# trusting its contents. This is fine for local/demo use.
# ---------------------------------------------------------------------------

def _decode_google_credential(credential: str) -> dict:
    try:
        payload_b64 = credential.split(".")[1]
        padding = "=" * (-len(payload_b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(payload_b64 + padding))
        return payload
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Google credential")


@router.post("/google", response_model=AuthResponse)
def google_auth(payload: GoogleAuthRequest, request: Request, db: Session = Depends(get_db)):
    if not settings.google_client_id:
        raise HTTPException(
            status_code=503,
            detail="Google Sign-In isn't configured on this server yet (missing GOOGLE_CLIENT_ID).",
        )

    claims = _decode_google_credential(payload.credential)

    if claims.get("aud") != settings.google_client_id:
        raise HTTPException(status_code=401, detail="Google credential was issued for a different app")

    email = (claims.get("email") or "").strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email")

    google_id = claims.get("sub")
    name = claims.get("name", email.split("@")[0])

    user = db.query(User).filter(User.email == email).first()

    if not user:
        username = email.split("@")[0]
        if db.query(User).filter(User.username == username).first():
            username = f"{username}{__import__('random').randint(100, 999)}"

        user = User(
            name=name,
            email=email,
            username=username,
            auth_provider="google",
            google_id=google_id,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not user.google_id:
        user.google_id = google_id
        db.commit()

    token = _create_session_and_token(db, user, request)
    return {"token": token, "user": user}


# ---------------------------------------------------------------------------
# Current user / Logout
# ---------------------------------------------------------------------------

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    """
    Signs out of THIS device only — revokes this session's token. Nothing
    about the account (projects, settings, memories) is touched or deleted;
    signing back in with the same email/password (or Google account)
    restores everything exactly as it was.
    """
    if credentials:
        payload = verify_token(credentials.credentials)
        if payload:
            session = db.query(SessionLog).filter(SessionLog.id == payload["session_id"]).first()
            if session:
                session.revoked = True
                db.commit()

    return {"status": "logged_out"}