# 使用 Python 3.9 基礎映像
FROM python:3.10-slim

# 設定工作目錄
WORKDIR /app

# 複製 requirements.txt 並安裝依賴
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 複製所有專案檔案
COPY . .

# 環境變數設定
ENV CERT_PATH=/app/cert.pem
ENV KEY_PATH=/app/key.pem

# 開放應用的端口
EXPOSE 8000

# 使用 uvicorn 啟動 FastAPI，支援 HTTPS
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--ssl-keyfile", "/app/key.pem", "--ssl-certfile", "/app/cert.pem"]
