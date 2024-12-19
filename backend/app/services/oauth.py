"""Yahoo OAuth 服務"""
import secrets
import base64
from rauth import OAuth2Service  # type: ignore
from fastapi import HTTPException
import time
from typing import Tuple

from app.config import settings
from app.models.token import Token


class YahooOAuth:
    """Yahoo OAuth 處理類"""
    AUTHORIZATION_URL = "https://api.login.yahoo.com/oauth2/request_auth"
    ACCESS_TOKEN_URL = "https://api.login.yahoo.com/oauth2/get_token"
    
    def __init__(self) -> None:
        """初始化 OAuth 服務"""
        self.service = OAuth2Service(
            client_id=settings.YAHOO_CLIENT_ID,
            client_secret=settings.YAHOO_CLIENT_SECRET,
            name="yahoo",
            authorize_url=self.AUTHORIZATION_URL,
            access_token_url=self.ACCESS_TOKEN_URL,
            base_url=None
        )
        self.session = None

    async def get_authorization_url(self) -> Tuple[str, str]:
        """生成授權 URL 和 state"""
        state = secrets.token_urlsafe()
        
        auth_url = self.service.get_authorize_url(
            response_type="code",
            redirect_uri=settings.YAHOO_CALLBACK_URL,
            state=state
        )
        return auth_url, state
    
    async def get_token(self, code: str) -> Token:
        """用授權碼換取 token"""
        headers = {
            'Authorization': f'Basic {self._get_basic_auth_str()}'
        }
        
        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': settings.YAHOO_CALLBACK_URL
        }
        
        try:
            raw_token = self.service.get_raw_access_token(
                data=data,
                headers=headers
            )
            
            token_data = raw_token.json()
            token_data['token_time'] = time.time()
            return Token(**token_data)
            
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to get token: {str(e)}"
            )

    def _get_basic_auth_str(self) -> str:
        """生成 Basic Auth 字符串"""
        auth_str = f"{settings.YAHOO_CLIENT_ID}:{settings.YAHOO_CLIENT_SECRET}"
        return base64.b64encode(auth_str.encode()).decode()