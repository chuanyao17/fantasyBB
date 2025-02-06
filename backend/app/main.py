"""FastAPI 應用程式"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.middleware.token_validator import TokenValidatorMiddleware
from app.routers import auth_routes, fantasy_routes

app = FastAPI()

# CORS 設置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:3000", "https://fantasy-bb.vercel.app", "https://fantasy-bb.com", "https://api.fantasy-bb.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 添加認證中間件
app.add_middleware(TokenValidatorMiddleware)

# 註冊路由
app.include_router(auth_routes.router)
app.include_router(fantasy_routes.router)


@app.get("/")
async def root():
    """健康檢查"""
    return {"status": "ok"}

