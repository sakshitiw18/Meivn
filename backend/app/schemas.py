"""
Pydantic schemas for API request/response bodies.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    username: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class GoogleAuthRequest(BaseModel):
    credential: str  # the ID token JWT returned by Google Identity Services


class UserOut(BaseModel):
    id: str
    name: str
    username: Optional[str] = None
    email: str
    account_type: str
    auth_provider: str

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    token: str
    user: UserOut


class TaskCreate(BaseModel):
    user_request: str


class AgentStepOut(BaseModel):
    agent_name: str
    status: str
    input_data: Optional[str] = None
    output_data: Optional[str] = None
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TaskOut(BaseModel):
    id: str
    user_request: str
    status: str
    final_report: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    steps: List[AgentStepOut] = []

    class Config:
        from_attributes = True


class TaskListItem(BaseModel):
    id: str
    user_request: str
    status: str
    created_at: datetime
    completed_steps: int = 0
    total_steps: int = 0

    class Config:
        from_attributes = True


class MemoryOut(BaseModel):
    id: int
    key: str
    value: str
    created_at: datetime

    class Config:
        from_attributes = True


class MemoryCreate(BaseModel):
    key: str = "user_note"
    value: str


# ---------------------------------------------------------------------------
# Settings
# ---------------------------------------------------------------------------

class AccountSettingsOut(BaseModel):
    name: str
    username: str
    email: str
    account_type: str
    email_product_updates: bool
    email_security_alerts: bool
    email_marketing: bool

    class Config:
        from_attributes = True


class AccountSettingsUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    email_product_updates: Optional[bool] = None
    email_security_alerts: Optional[bool] = None
    email_marketing: Optional[bool] = None


class ChangePasswordRequest(BaseModel):
    new_password: str


class AppearanceSettingsOut(BaseModel):
    theme: str
    accent_color: str
    font_size: str
    animations_enabled: bool

    class Config:
        from_attributes = True


class AppearanceSettingsUpdate(BaseModel):
    theme: Optional[str] = None
    accent_color: Optional[str] = None
    font_size: Optional[str] = None
    animations_enabled: Optional[bool] = None


class PrivacySettingsOut(BaseModel):
    save_chat_history: bool
    improve_ai_with_conversations: bool

    class Config:
        from_attributes = True


class PrivacySettingsUpdate(BaseModel):
    save_chat_history: Optional[bool] = None
    improve_ai_with_conversations: Optional[bool] = None


class SecuritySettingsOut(BaseModel):
    twofa_enabled: bool
    passkeys_enabled: bool
    security_alerts_enabled: bool

    class Config:
        from_attributes = True


class SecuritySettingsUpdate(BaseModel):
    twofa_enabled: Optional[bool] = None
    passkeys_enabled: Optional[bool] = None
    security_alerts_enabled: Optional[bool] = None


class AllSettingsOut(BaseModel):
    account: AccountSettingsOut
    appearance: AppearanceSettingsOut
    privacy: PrivacySettingsOut
    security: SecuritySettingsOut


class SessionOut(BaseModel):
    id: int
    device: str
    is_current: bool
    created_at: datetime
    last_active_at: datetime

    class Config:
        from_attributes = True