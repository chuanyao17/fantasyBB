"""Yahoo OAuth 認證路由"""
from fastapi import APIRouter, Depends, HTTPException, Response, Cookie, Request
from fastapi.responses import RedirectResponse
from app.services.oauth import YahooOAuth
from app.models.token import Token
import json

import yahoo_fantasy_api as yfa  # type: ignore
from requests_oauthlib import OAuth2Session  # type: ignore


class handler_v1:
    def __init__(self, token_data):
        if isinstance(token_data, dict):
            access_token = token_data["access_token"]
        else:
            access_token = token_data.access_token
            
        self.session = OAuth2Session(token={"access_token": access_token})


router = APIRouter(prefix="/auth/yahoo", tags=["auth"])


@router.get("/login")
async def login(
    oauth: YahooOAuth = Depends()
):
    """開始 OAuth 流程"""
    auth_url, state = await oauth.get_authorization_url()
    
    redirect_response = RedirectResponse(
        url=auth_url,
        status_code=303
    )
    
    redirect_response.set_cookie(
        key="oauth_state",
        value=state,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=300
    )
    
    return redirect_response


@router.get("/callback")
async def callback(
    code: str,
    state: str,
    response: Response,
    oauth: YahooOAuth = Depends(),
    oauth_state: str | None = Cookie(None)
) -> Token:
    """處理 Yahoo OAuth 回調"""
    try:
        if not oauth_state or oauth_state != state:
            raise HTTPException(status_code=400, detail="Invalid state")
            
        token = await oauth.get_token(code)
        
        # 清除 state cookie
        response.delete_cookie(key="oauth_state", secure=True, httponly=True)
        
        # 設置 token cookie
        response.set_cookie(
            key="token",
            value=token.model_dump_json(),
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=token.expires_in
        )
        
        return token
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/show")
async def show(
    request: Request
):
    """測試端點"""
    try:
        # 從 cookie 獲取 token（已經由中間件驗證過）
        token_str = request.cookies.get("token")
        token = Token.model_validate_json(token_str)
        
        # 使用 token 創建 session
        sc = handler_v1(token)
        
        # 獲取 Yahoo Fantasy API 數據
        gm = yfa.Game(sc, 'nba')
        leagues = gm.league_ids()
        lg = gm.to_league('428.l.117327')
        teamkey = lg.team_key()
        my_team = lg.to_team(teamkey)
        roster = my_team.roster()
        
        return {
            "leagues": leagues,
            "team_key": teamkey,
            "roster": roster
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get("/test-refresh")
async def test_refresh(
    request: Request,
    response: Response
):
    """測試 token 刷新機制"""
    try:
        # 從 cookie 獲取當前 token
        token_str = request.cookies.get("token")
        if not token_str:
            raise HTTPException(status_code=401, detail="No token found")
            
        # 解析當前 token
        token = Token.model_validate_json(token_str)
        
        # 修改 token 時間使其過期
        token.token_time = 0
        
        # 更新 cookie 中的 token
        response.set_cookie(
            key="token",
            value=token.model_dump_json(),
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=3600
        )
        
        return {
            "message": "Token has been modified to appear expired"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        ) 