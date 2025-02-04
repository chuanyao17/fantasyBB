"""Token 驗證中間件"""
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.models.token import Token
from app.services.auth_service import YahooOAuth
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
            token_str = request.cookies.get("token")
            if not token_str:
                print("No token found")
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
                    samesite="none",
                    max_age=2592000  # 30 天
                )
                print("Refresh token")
                return response
            
            return await call_next(request)
            
        except Exception:
            # 返回 401，讓前端處理重定向
            print("exception")
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
            "/auth/yahoo/logout",
            "/auth/yahoo/callback",
            "/auth/yahoo/test-refresh",
            "/docs",
            "/openapi.json",
            "/"
        }
        return path in public_paths