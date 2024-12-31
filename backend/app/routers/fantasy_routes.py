"""Yahoo Fantasy API 路由"""
from fastapi import APIRouter, HTTPException, Request
from typing import List, Dict, Any, Union

from app.services.fantasy_service import FantasyService
from app.models.token import Token


router = APIRouter(prefix="/fantasy", tags=["fantasy"])


@router.get("/leagues")
async def get_leagues(request: Request):
    """獲取用戶的聯盟資訊"""
    try:
        token_str = request.cookies.get("token")
        if not token_str:
            raise HTTPException(status_code=401, detail="No token found")
        token = Token.model_validate_json(token_str)
        fantasy = FantasyService(token)
        return await fantasy.get_leagues()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/team")
async def get_team(request: Request):
    """獲取用戶的隊伍資訊"""
    try:
        token_str = request.cookies.get("token")
        if not token_str:
            raise HTTPException(status_code=401, detail="No token found")
        token = Token.model_validate_json(token_str)
        fantasy = FantasyService(token)
        return await fantasy.get_team_info()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/roster")
async def get_roster(request: Request):
    """獲取球員名單"""
    try:
        token_str = request.cookies.get("token")
        if not token_str:
            raise HTTPException(status_code=401, detail="No token found")
        token = Token.model_validate_json(token_str)
        fantasy = FantasyService(token)
        return await fantasy.get_roster()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/matchups")
async def get_matchups(
    request: Request,
    week: Union[int, None] = None
) -> List[Dict[str, Any]]:
    """獲取比賽數據"""
    try:
        token_str = request.cookies.get("token")
        if not token_str:
            raise HTTPException(status_code=401, detail="No token found")
        token = Token.model_validate_json(token_str)
        fantasy = FantasyService(token)
        return await fantasy.get_matchups_scores(week)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/current-week")
async def get_current_week(request: Request) -> int:
    """獲取當前週次"""
    try:
        token_str = request.cookies.get("token")
        if not token_str:
            raise HTTPException(status_code=401, detail="No token found")
        token = Token.model_validate_json(token_str)
        fantasy = FantasyService(token)
        return await fantasy.get_current_week()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 