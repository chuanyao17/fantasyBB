"""Token 驗證中間件"""
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.models.token import Token
from app.services.oauth import YahooOAuth
from fastapi.responses import JSONResponse


class TokenValidatorMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.oauth = YahooOAuth()

    async def dispatch(self, request: Request, call_next):
        # 檢查是否是公開路徑
        if self._is_public_path(request.url.path):
            return await call_next(request)

        try:
            # 從 cookie 獲取 token
            token_str = request.cookies.get("token")
            if not token_str:
                return Response(status_code=401)

            token = Token.model_validate_json(token_str)
            
            # 檢查 token 是否過期
            if token.is_expired():
                # 嘗試刷新 token
                new_token = await self.oauth.refresh_token(token.refresh_token)
                
                # 獲取響應
                response = await call_next(request)
                
                # 在響應中設置新的 token
                response.set_cookie(
                    key="token",
                    value=new_token.model_dump_json(),
                    httponly=True,
                    secure=True,
                    samesite="lax",
                    max_age=new_token.expires_in
                )
                
                return response
            
            return await call_next(request)
            
        except Exception:
            # 返回 401，讓前端處理重定向
            return JSONResponse(
                status_code=401,
                content={
                    "detail": "Authentication required",
                    "type": "authentication_required"
                }
            )

    def _is_public_path(self, path: str) -> bool:
        """檢查是否是公開路徑"""
        public_paths = {
            "/auth/yahoo/login",
            "/auth/yahoo/callback",
            "/docs",
            "/openapi.json"
        }
        return path in public_paths