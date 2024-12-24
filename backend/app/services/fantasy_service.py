"""Yahoo Fantasy API 服務"""
import yahoo_fantasy_api as yfa  # type: ignore
from fastapi import HTTPException
from typing import List, Dict, Any, Union

from app.models.token import Token
from app.services.auth_service import YahooOAuthSession
from app.config import settings


class FantasyService:
    """處理 Yahoo Fantasy API 相關操作"""
    
    def __init__(self, token: Token):
        self.session = YahooOAuthSession(token)
        try:
            self.game = yfa.Game(self.session, 'nba')
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to initialize Fantasy API: {str(e)}"
            )
        
    async def get_leagues(self) -> List[str]:
        """獲取用戶的聯盟資訊"""
        try:
            return self.game.league_ids()
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get leagues: {str(e)}"
            )
        
    async def get_team_info(
        self, 
        league_id: Union[str, None] = None
    ) -> Dict[str, str]:
        """獲取隊伍資訊"""
        try:
            league_id = league_id or settings.DEFAULT_LEAGUE_ID
            league = self.game.to_league(league_id)
            team_key = league.team_key()
            return {
                "team_key": team_key,
                "league_id": league.league_id
            }
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get team info: {str(e)}"
            )
        
    async def get_roster(
        self, 
        league_id: Union[str, None] = None
    ) -> List[Dict[str, Any]]:
        """獲取球員名單"""
        try:
            league_id = league_id or settings.DEFAULT_LEAGUE_ID
            league = self.game.to_league(league_id)
            team = league.to_team(league.team_key())
            return team.roster()
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get roster: {str(e)}"
            ) 