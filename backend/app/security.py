"""
Password hashing and session-token helpers.

Deliberately dependency-free (stdlib only): passwords are hashed with
PBKDF2-HMAC-SHA256, and session tokens are a simple HMAC-signed payload
(user_id + expiry) rather than a full JWT library. This is fine for a
single-instance app like this one; if you later need refresh tokens,
token revocation lists, or multiple signing keys, swap this out for a
proper library (e.g. PyJWT) without changing the call sites below.
"""
import base64
import hashlib
import hmac
import json
import os
import time

from app.config import get_settings

settings = get_settings()


# ---------------------------------------------------------------------------
# Passwords
# ---------------------------------------------------------------------------

def hash_password(password: str) -> tuple[str, str]:
    """Returns (salt_hex, hash_hex)."""
    salt = os.urandom(16).hex()
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), 100_000).hex()
    return salt, hashed


def verify_password(password: str, salt: str, expected_hash: str) -> bool:
    if not salt or not expected_hash:
        return False
    candidate = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), 100_000).hex()
    return hmac.compare_digest(candidate, expected_hash)


# ---------------------------------------------------------------------------
# Session tokens
# ---------------------------------------------------------------------------

def _b64encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode().rstrip("=")


def _b64decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def create_token(user_id: str, session_id: int) -> str:
    payload = {
        "user_id": user_id,
        "session_id": session_id,
        "exp": int(time.time()) + settings.token_ttl_days * 86400,
    }
    payload_b64 = _b64encode(json.dumps(payload).encode())
    signature = hmac.new(settings.secret_key.encode(), payload_b64.encode(), hashlib.sha256).hexdigest()
    return f"{payload_b64}.{signature}"


def verify_token(token: str) -> dict | None:
    """Returns the decoded payload, or None if the token is invalid/expired."""
    try:
        payload_b64, signature = token.split(".", 1)
    except ValueError:
        return None

    expected_signature = hmac.new(settings.secret_key.encode(), payload_b64.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected_signature):
        return None

    try:
        payload = json.loads(_b64decode(payload_b64))
    except (ValueError, UnicodeDecodeError):
        return None

    if payload.get("exp", 0) < time.time():
        return None

    return payload