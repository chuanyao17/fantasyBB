from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from fastapi.responses import RedirectResponse
from app.services.oauth import YahooOAuth
from app.models.token import Token

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
async def show():
    """測試端點"""
    global lg
    try:
        
        token = {
            "access_token": "",
            "token_type": "bearer",
            "refresh_token": "",
            "expires_in": 3600,
            "guid": None,
            "token_time": 1734533009.783745
        }
        sc = handler_v1(token)
        
        gm = yfa.Game(sc, 'nba')
        leagues = gm.league_ids()
        print(leagues)
        lg = gm.to_league('428.l.117327')
        print("lg", lg)
        teamkey = lg.team_key()
        print("teamkey", teamkey)
        
        my_team = lg.to_team(teamkey)
        my_team.roster()
        print(my_team)
        return token
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        ) 