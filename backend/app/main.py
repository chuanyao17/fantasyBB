"""FastAPI 應用程式"""
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.middleware.token_validator import TokenValidatorMiddleware
from app.routers import yahoo_oauth

app = FastAPI()

# CORS 設置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 添加認證中間件
app.add_middleware(TokenValidatorMiddleware)

# 註冊路由
app.include_router(yahoo_oauth.router)

@app.get("/")
async def root():
    """健康檢查"""
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        ssl_keyfile="key.pem",
        ssl_certfile="cert.pem"
    ) 