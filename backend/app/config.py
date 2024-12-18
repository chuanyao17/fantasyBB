"""應用程式配置"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """應用程式設置"""
    # Yahoo OAuth 設置
    YAHOO_CLIENT_ID: str
    YAHOO_CLIENT_SECRET: str
    YAHOO_CALLBACK_URL: str
    
    # 安全設置
    SECRET_KEY: str
    
    class Config:
        """配置設置"""
        env_file = ".env"


settings = Settings() 