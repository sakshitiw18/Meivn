"""
REST endpoints backing the Settings page: Account, Appearance,
Privacy & Data, and Security.

Every one of these is scoped to the signed-in user (see routers/auth.py
for how `current_user` is resolved from the bearer token) — the `User` row
itself IS the settings record, since it was pre-filled at signup/login.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, SessionLog, Task
from app.routers.auth import get_current_user_or_guest as get_current_user
from app.security import hash_password, verify_password
from app.schemas import (
    AccountSettingsOut, AccountSettingsUpdate, ChangePasswordRequest,
    AppearanceSettingsOut, AppearanceSettingsUpdate,
    PrivacySettingsOut, PrivacySettingsUpdate,
    SecuritySettingsOut, SecuritySettingsUpdate,
    AllSettingsOut, SessionOut,
)

router = APIRouter(prefix="/api/settings", tags=["settings"])


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def apply_partial_update(obj, payload):
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)


# ---------------------------------------------------------------------------
# Full settings (used on page load)
# ---------------------------------------------------------------------------

@router.get("", response_model=AllSettingsOut)
def get_all_settings(current_user: User = Depends(get_current_user)):
    return {
        "account": current_user,
        "appearance": current_user,
        "privacy": current_user,
        "security": current_user,
    }


# ---------------------------------------------------------------------------
# Account
# ---------------------------------------------------------------------------

@router.get("/account", response_model=AccountSettingsOut)
def get_account_settings(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/account", response_model=AccountSettingsOut)
def update_account_settings(
    payload: AccountSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.username and payload.username != current_user.username:
        if db.query(User).filter(User.username == payload.username, User.id != current_user.id).first():
            raise HTTPException(status_code=400, detail="That username is taken")

    if payload.email and payload.email != current_user.email:
        if db.query(User).filter(User.email == payload.email, User.id != current_user.id).first():
            raise HTTPException(status_code=400, detail="That email is already in use")

    apply_partial_update(current_user, payload)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/account/change-password")
def change_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.auth_provider != "local":
        raise HTTPException(
            status_code=400,
            detail="This account signs in with Google — there's no local password to change.",
        )

    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    salt, hashed = hash_password(payload.new_password)
    current_user.password_salt = salt
    current_user.password_hash = hashed
    db.commit()

    return {"status": "ok"}


@router.delete("/account")
def delete_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Permanently deletes THIS account and its sessions.
    Projects (Tasks) are a shared workspace in this app, not per-user, so
    they are intentionally left untouched.
    """
    db.query(SessionLog).filter(SessionLog.user_id == current_user.id).delete()
    db.delete(current_user)
    db.commit()

    return {"status": "deleted"}


# ---------------------------------------------------------------------------
# Appearance
# ---------------------------------------------------------------------------

@router.get("/appearance", response_model=AppearanceSettingsOut)
def get_appearance_settings(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/appearance", response_model=AppearanceSettingsOut)
def update_appearance_settings(
    payload: AppearanceSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    apply_partial_update(current_user, payload)
    db.commit()
    db.refresh(current_user)
    return current_user


# ---------------------------------------------------------------------------
# Privacy & Data
# ---------------------------------------------------------------------------

@router.get("/privacy", response_model=PrivacySettingsOut)
def get_privacy_settings(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/privacy", response_model=PrivacySettingsOut)
def update_privacy_settings(
    payload: PrivacySettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    apply_partial_update(current_user, payload)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/privacy/export")
def export_data(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns everything the app has stored for this user, for the 'Export my data' button."""
    tasks = db.query(Task).all()

    return {
        "account": {
            "name": current_user.name,
            "username": current_user.username,
            "email": current_user.email,
            "account_type": current_user.account_type,
        },
        "settings": {
            "appearance": {
                "theme": current_user.theme,
                "accent_color": current_user.accent_color,
                "font_size": current_user.font_size,
                "animations_enabled": current_user.animations_enabled,
            },
            "privacy": {
                "save_chat_history": current_user.save_chat_history,
                "improve_ai_with_conversations": current_user.improve_ai_with_conversations,
            },
        },
        "projects": [
            {
                "id": task.id,
                "user_request": task.user_request,
                "status": task.status,
                "final_report": task.final_report,
                "created_at": task.created_at.isoformat(),
                "steps": [
                    {
                        "agent_name": step.agent_name,
                        "status": step.status,
                        "output_data": step.output_data,
                    }
                    for step in task.steps
                ],
            }
            for task in tasks
        ],
    }


@router.delete("/privacy/conversations")
def clear_all_conversations(db: Session = Depends(get_db)):
    """
    Backs both 'Delete chat history' and 'Clear all conversations' — this app's
    equivalent of conversation history is the list of generated projects (Tasks),
    which are a shared workspace across everyone signed in.
    """
    db.query(Task).delete()
    db.commit()
    return {"status": "cleared"}


# ---------------------------------------------------------------------------
# Security
# ---------------------------------------------------------------------------

@router.get("/security", response_model=SecuritySettingsOut)
def get_security_settings(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/security", response_model=SecuritySettingsOut)
def update_security_settings(
    payload: SecuritySettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    apply_partial_update(current_user, payload)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/security/sessions", response_model=list[SessionOut])
def list_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Every session created by signing in (this device or any other), not yet revoked."""
    return (
        db.query(SessionLog)
        .filter(SessionLog.user_id == current_user.id, SessionLog.revoked == False)  # noqa: E712
        .order_by(SessionLog.last_active_at.desc())
        .all()
    )


@router.get("/security/login-history", response_model=list[SessionOut])
def login_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(SessionLog)
        .filter(SessionLog.user_id == current_user.id)
        .order_by(SessionLog.created_at.desc())
        .limit(20)
        .all()
    )


@router.delete("/security/sessions/{session_id}")
def revoke_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = (
        db.query(SessionLog)
        .filter(SessionLog.id == session_id, SessionLog.user_id == current_user.id)
        .first()
    )

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.revoked = True
    db.commit()

    return {"status": "revoked"}


@router.delete("/security/sessions")
def revoke_all_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(SessionLog).filter(SessionLog.user_id == current_user.id).update({SessionLog.revoked: True})
    db.commit()
    return {"status": "revoked_all"}