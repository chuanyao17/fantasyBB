"""Yahoo OAuth 認證路由"""
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    Cookie,
    Request
)
from fastapi.responses import RedirectResponse
from app.services.auth_service import YahooOAuth
from app.models.token import Token
from app.config import settings


router = APIRouter(prefix="/auth/yahoo", tags=["auth"])


@router.get("/login")
async def login(oauth: YahooOAuth = Depends()):
    """開始 OAuth 流程"""
    auth_url, state = await oauth.get_authorization_url()
    
    redirect_response = RedirectResponse(url=auth_url, status_code=303)
    redirect_response.set_cookie(
        key="oauth_state",
        value=state,
        httponly=True,
        secure=True,
        samesite="none",
        domain=".fantasy-bb.com",
        max_age=300
    )
    return redirect_response


@router.get("/callback")
async def callback(
    code: str,
    state: str,
    oauth: YahooOAuth = Depends(),
    oauth_state: str | None = Cookie(None)
):
    """處理 Yahoo OAuth 回調"""
    if not oauth_state or oauth_state != state:
        
        raise HTTPException(status_code=400, detail="Invalid state")
        
    try:
        token = await oauth.get_token(code)
        
        # 創建重定向響應
        redirect_response = RedirectResponse(
            url=settings.FRONTEND_URL,
            status_code=303
        )
        
        # 設置 cookies
        redirect_response.delete_cookie(key="oauth_state", secure=True, httponly=True, samesite="none", domain=".fantasy-bb.com")
        redirect_response.set_cookie(
            key="token",
            value=token.model_dump_json(),
            httponly=True,
            secure=True,
            samesite="none",
            domain=".fantasy-bb.com",
            max_age=2592000  # 30 天
        )
        
        return redirect_response
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/test-refresh")
async def test_refresh(request: Request, response: Response):
    """測試 token 刷新機制"""
    try:
        token_str = request.cookies.get("token")
        if not token_str:
            raise HTTPException(status_code=401, detail="No token found")
            
        token = Token.model_validate_json(token_str)
        token.token_time = 0
        
        response.set_cookie(
            key="token",
            value=token.model_dump_json(),
            httponly=True,
            secure=True,
            samesite="none",
            domain=".fantasy-bb.com",
            max_age=2592000  # 30 天
        )
        
        return {"message": "Token has been modified to appear expired"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/verify")
async def verify_token(request: Request, response: Response, redirect: str = "/"):
    """檢查是否有 token cookie 目前是直接透過middleware檢查 未來可能需要調整"""
    print("verify_token")
    
    # token_str = request.cookies.get("token")
    # if not token_str:
    #     raise HTTPException(status_code=401)
    # return {"status": "valid"} 
    frontend_redirect_url = f"{settings.FRONTEND_URL}{redirect}"
    return RedirectResponse(url=frontend_redirect_url)


@router.get("/logout")
async def logout(response: Response):
    """登出並清除 token"""
    response.delete_cookie(key="token", secure=True, httponly=True, samesite="none", domain=".fantasy-bb.com")
    return {"status": "logged out"}
