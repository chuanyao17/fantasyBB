"""Yahoo OAuth 服務模組，處理認證相關操作"""
import secrets
import base64
from rauth import OAuth2Service  # type: ignore
from requests_oauthlib import OAuth2Session  # type: ignore
from fastapi import HTTPException
import time
from typing import Tuple, Dict

from app.config import settings
from app.models.token import Token


class YahooOAuthSession:
    """Yahoo OAuth Session 處理類"""
    def __init__(self, token: Token):
        self.session = OAuth2Session(
            token={"access_token": token.access_token}
        )


class YahooOAuth:
    """處理 Yahoo OAuth 2.0 認證流程"""
    
    AUTHORIZATION_URL = "https://api.login.yahoo.com/oauth2/request_auth"
    ACCESS_TOKEN_URL = "https://api.login.yahoo.com/oauth2/get_token"
    
    def __init__(self) -> None:
        self.service = OAuth2Service(
            client_id=settings.YAHOO_CLIENT_ID,
            client_secret=settings.YAHOO_CLIENT_SECRET,
            name="yahoo",
            authorize_url=self.AUTHORIZATION_URL,
            access_token_url=self.ACCESS_TOKEN_URL,
            base_url=None
        )

    async def get_authorization_url(self) -> Tuple[str, str]:
        """生成授權 URL 和 state 參數"""
        state = secrets.token_urlsafe()
        
        auth_url = self.service.get_authorize_url(
            response_type="code",
            redirect_uri=settings.YAHOO_CALLBACK_URL,
            state=state
        )
        return auth_url, state
    
    async def get_token(self, code: str) -> Token:
        """使用授權碼獲取 token"""
        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': settings.YAHOO_CALLBACK_URL
        }
        return await self._request_token(data)
            
    async def refresh_token(self, refresh_token: str) -> Token:
        """使用 refresh token 獲取新的 token"""
        data = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }
        return await self._request_token(data)
    
    async def _request_token(self, data: Dict[str, str]) -> Token:
        """處理 token 請求的共用邏輯"""
        headers = {
            'Authorization': f'Basic {self._get_basic_auth_str()}'
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
                detail=f"Failed to handle token request: {str(e)}"
            )
            
    def _get_basic_auth_str(self) -> str:
        """生成 Basic Auth 字符串"""
        auth_str = f"{settings.YAHOO_CLIENT_ID}:{settings.YAHOO_CLIENT_SECRET}"
        return base64.b64encode(auth_str.encode()).decode()