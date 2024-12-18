"""Token 模型定義"""
from pydantic import BaseModel


class Token(BaseModel):
    """OAuth Token 模型"""
    access_token: str
    token_type: str
    refresh_token: str
    expires_in: int
    guid: str | None = None
    token_time: float 