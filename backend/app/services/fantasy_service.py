"""Yahoo Fantasy API 服務"""
import yahoo_fantasy_api as yfa  # type: ignore
from fastapi import HTTPException
from typing import List, Dict, Any, Union, Set

from app.models.token import Token
from app.services.auth_service import YahooOAuthSession
from app.config import settings


class FantasyService:
    """處理 Yahoo Fantasy API 相關操作"""
   
    SKIP_STAT_IDS: Set[str] = {'9004003', '9007006'}
    
    def __init__(self, token: Token):
        self.session = YahooOAuthSession(token)
        try:
            self.game = yfa.Game(self.session, 'nba')
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to initialize Fantasy API: {str(e)}"
            )
        
    async def get_leagues(
        self
    ) -> List[str]:
        """獲取用戶的聯盟資訊"""
        try:
            return self.game.league_ids()
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get leagues: {str(e)}"
            )
    
    async def get_teams_keys(
        self,
        league_id: Union[str, None] = None
    ) -> List[str]:
        """獲取用戶的聯盟所有隊伍的key"""
        try:
            league_id = league_id or settings.DEFAULT_LEAGUE_ID
            league = self.game.to_league(league_id)
            all_teams = league.teams()
            all_keys = list(all_teams.keys())
            return all_keys
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get teams'keys: {str(e)}"
            )
        
    async def get_team_info(
        self,
        league_id: Union[str, None] = None
    ) -> Dict[str, str]:
        """獲取自己隊伍資訊"""
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

    async def get_matchup_team_info(
        self,
        team_key: Union[str, None] = None,
        week: Union[int, None] = None,
        league_id: Union[str, None] = None
    ) -> Dict[str, Any]:
        """獲取指定隊伍在某週的對手隊伍資訊"""
        try:
            league_id = league_id or settings.DEFAULT_LEAGUE_ID
            league = self.game.to_league(league_id)
            
            # 如果 week 沒有提供，則使用當前週數
            if week is None:
                week = await self.get_current_week(league_id)
            
            # 如果 team_key 沒提供，預設為當前使用者的隊伍
            team_key = team_key or league.team_key()
            
            # 取得指定隊伍的比賽對手
            team = league.to_team(team_key)
            matchup_opponent_key = team.matchup(week)
            
            # 獲取對手的完整資訊
            opponent_team = league.to_team(matchup_opponent_key)
            opponent_team_info = opponent_team.details()
            
            return opponent_team_info

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get matchup team info: {str(e)}"
            )
            
    async def get_matchup_team_name(
        self,
        team_key: Union[str, None] = None,
        week: Union[int, None] = None,
        league_id: Union[str, None] = None
    ) -> str:
        """獲取指定隊伍在某週的對手隊伍名稱"""
        try:
            opponent_info = await self.get_matchup_team_info(team_key, week, league_id)
            return opponent_info.get("name", "Unknown Opponent")
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get matchup's name: {str(e)}"
            )
            
    async def get_all_matchups_team_name(
        self, 
        league_id: Union[str, None] = None, 
        week: Union[int, None] = None
    ) -> Dict[str, str]:
        """獲取聯盟內所有隊伍的對手隊伍名稱（以隊伍名稱作為 key）"""
        try:
            league_id = league_id or settings.DEFAULT_LEAGUE_ID
            all_keys = await self.get_teams_keys(league_id)  # 獲取所有隊伍 keys
            print(all_keys)
            matchups_dict = {}

            for team_key in all_keys:
                # 取得該隊伍的名稱
                team_info = self.game.to_league(league_id).to_team(team_key).details()
                team_name = team_info.get("name", "Unknown Team")

                # 取得該隊伍的對手名稱
                opponent_name = await self.get_matchup_team_name(team_key, week, league_id)

                # 以隊伍名稱作為 key，對手名稱作為 value
                matchups_dict[team_name] = opponent_name
            return matchups_dict

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get all matchups: {str(e)}"
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
    
    async def get_matchups_scores(
        self,
        week: Union[int, None] = None,
        league_id: Union[str, None] = None
    ) -> List[Dict[str, Any]]:
        """獲取每週比賽數據"""
        try:
            league_id = league_id or settings.DEFAULT_LEAGUE_ID
            league = self.game.to_league(league_id)
            
            if not week:
                week = await self.get_current_week(league_id) - 1
                
            matchups = league.matchups(week)
            matchups_data = []
            
            # 處理比賽數據
            contents = (
                matchups["fantasy_content"]["league"][1]
                ["scoreboard"]["0"]["matchups"]
            )
            
            for matchup in contents.values():
                if isinstance(matchup, dict) and "matchup" in matchup:
                    teams_data = matchup["matchup"]["0"]["teams"]
                    
                    for team in teams_data.values():
                        if isinstance(team, dict) and "team" in team:
                            team_data = team["team"]
                            stats = {}
                            
                            # 處理每個統計數據
                            for stat in team_data[1]["team_stats"]["stats"]:
                                stat_id = stat["stat"]["stat_id"]
                                if stat_id not in self.SKIP_STAT_IDS:
                                    value = stat["stat"]["value"]
                                    name = self._get_stat_name(
                                        stat_id
                                    )
                                    stats[name] = value
                            
                            matchups_data.append({
                                "week": week,
                                "name": team_data[0][2]["name"],
                                "stats": stats
                            })
            
            return matchups_data
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get matchups data: {str(e)}"
            )
    
    def _get_stat_name(self, stat_id: str) -> str:
        """轉換統計 ID 為名稱"""
        stat_map = {
            "5": "FG%",
            "8": "FT%",
            "10": "3PTM",
            "12": "PTS",
            "15": "REB",
            "16": "AST",
            "17": "ST",
            "18": "BLK",
            "19": "TO"
        }
        return stat_map.get(stat_id, stat_id) 
    
    async def get_current_week(
        self,
        league_id: Union[str, None] = None
    ) -> int:
        """獲取當前週次"""
        try:
            league_id = league_id or settings.DEFAULT_LEAGUE_ID
            league = self.game.to_league(league_id)
            return league.current_week()
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get current week: {str(e)}"
            ) 