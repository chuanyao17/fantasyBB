from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from app.services.oauth import YahooOAuth
from app.models.token import Token

import yahoo_fantasy_api as yfa
from requests_oauthlib import OAuth2Session

class handler_v1:
    def __init__(self, token_data):
        if isinstance(token_data, dict):
            access_token = token_data["access_token"]
        else:
            access_token = token_data.access_token
            
        self.session = OAuth2Session(token={"access_token": access_token})

router = APIRouter(prefix="/auth/yahoo", tags=["auth"])

    
@router.get("/login")
async def login(oauth: YahooOAuth = Depends()):
    """開始 OAuth 流程"""
    auth_url, state = await oauth.get_authorization_url()
    return RedirectResponse(url=auth_url)

@router.get("/callback")
async def callback(
    code: str,
    state: str,
    oauth: YahooOAuth = Depends()
) -> Token:
    """處理 Yahoo OAuth 回調"""

    try:
        if not await oauth.verify_state(state):
            raise HTTPException(
                status_code=400,
                detail="Invalid state parameter"
            )
        token = await oauth.get_token(code)
        return token
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        ) 
        

@router.get("/show")
async def show():
    
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