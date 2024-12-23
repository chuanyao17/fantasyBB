"""Token 模型定義"""
from pydantic import BaseModel
import time


class Token(BaseModel):
    """OAuth Token 模型"""
    access_token: str
    token_type: str
    refresh_token: str
    expires_in: int
    guid: str | None = None
    token_time: float

    def is_expired(self) -> bool:
        """檢查 token 是否過期"""
        current_time = time.time()
        return current_time > (self.token_time + self.expires_in)
  