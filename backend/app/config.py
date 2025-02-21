"""應用程式配置"""
from pydantic_settings import BaseSettings  # type: ignore


class Settings(BaseSettings):
    """應用程式設置"""
    # Yahoo OAuth 設置
    YAHOO_CLIENT_ID: str
    YAHOO_CLIENT_SECRET: str
    YAHOO_CALLBACK_URL: str
    
    # 安全設置
    SECRET_KEY: str
    
    # Fantasy API 設置
    DEFAULT_LEAGUE_ID: str
    
    # 前端 URL 設置
    FRONTEND_URL: str
    COOKIE_DOMAIN: str | None = None
    
    class Config:
        """配置設置"""
        env_file = ".env"


settings = Settings()
