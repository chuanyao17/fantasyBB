# Fantasy Basketball Assistant

## 專案結構
```
frontend/                # Next.js 前端專案 (已初始化)
  ├── src/
  │   ├── app/         # App Router
  │   └── components/  # React 組件
  └── public/          # 靜態資源

backend/               # FastAPI 後端專案
  ├── app/
  │   ├── main.py     # FastAPI 入口點
  │   ├── config.py   # 環境變數配置
  │   ├── models/
  │   │   └── token.py    # Token 模型
  │   ├── routers/
  │   │   ├── auth_routes.py     # Yahoo OAuth 路由
  │   │   └── fantasy_routes.py  # Fantasy API 路由
  │   ├── middleware/
  │   │   └── token_validator.py  # Token 驗證中間件
  │   └── services/
  │       ├── auth_service.py    # OAuth 服務實作
  │       └── fantasy_service.py # Fantasy API 服務
  ├── .env            # 環境變數
  ├── cert.pem        # SSL 憑證
  └── key.pem         # SSL 私鑰
```
## 目前實作功能

### 後端 (FastAPI)
1. Yahoo OAuth 認證流程
   - [x] `/auth/yahoo/login`: 開始 OAuth 流程
   - [x] `/auth/yahoo/callback`: 處理 OAuth 回調
   - [x] State 參數驗證 (使用 httpOnly cookie)
   - [x] Token 模型定義與處理
   - [x] Token 安全存儲 (httpOnly cookie)
   - [x] Token 刷新機制
   - [x] Token 驗證中間件

2. 安全性機制
   - [x] HTTPS/SSL 支援
   - [x] CORS 設定
   - [x] HttpOnly Cookie
   - [x] Secure Cookie
   - [x] SameSite 保護
   - [x] State 參數防護
   - [x] Token 自動刷新
   - [ ] CSRF 防護

3. Yahoo Fantasy API 整合
   - [x] 基本的 API 呼叫功能
   - [x] 獲取用戶的 NBA 聯盟資訊 `/fantasy/leagues`
   - [x] 獲取隊伍資料 `/fantasy/team`
   - [x] 獲取球員名單 `/fantasy/roster`
   - [ ] 獲取球員統計數據
   - [ ] 獲取比賽資訊
   - [ ] 數據分析功能

4. 基礎設施
   - [x] HTTPS/SSL 支援
   - [x] CORS 設定
   - [x] 環境變數管理
   - [x] 錯誤處理機制
   - [x] 中間件系統
   - [ ] 日誌系統
   - [ ] 快取機制

### 前端 (Next.js)
- [x] 專案初始化
- [x] App Router 設置
- [x] TypeScript 整合
- [ ] OAuth 流程 UI
- [ ] 主頁面設計
- [ ] API 整合
- [ ] 數據展示元件
- [ ] 響應式設計

## API 端點

GET  /                         - 健康檢查
GET  /auth/yahoo/login        - 開始 OAuth 流程
GET  /auth/yahoo/callback     - OAuth 回調處理
GET  /auth/yahoo/test-refresh - 測試 token 刷新
GET  /fantasy/leagues         - 獲取聯盟資訊
GET  /fantasy/team           - 獲取隊伍資訊
GET  /fantasy/roster         - 獲取球員名單

## 環境變數

YAHOO_CLIENT_ID=     # Yahoo API Client ID
YAHOO_CLIENT_SECRET= # Yahoo API Client Secret
YAHOO_CALLBACK_URL=  # OAuth 回調 URL
SECRET_KEY=          # 應用程式密鑰

## 下一步計畫
1. 後端 (優先順序)
   - [x] 實作 Token 刷新機制
   - [x] 實作 Token 驗證中間件
   - [ ] 加強錯誤處理
   - [ ] 新增更多 Fantasy API 功能
   - [ ] 實作數據快取
   - [ ] 加入日誌系統
   - [ ] 實作 CSRF 防護

2. 前端 (優先順序)
   - [ ] 實作 OAuth 流程 UI
   - [ ] 設計主要介面
   - [ ] 整合後端 API
   - [ ] 實作數據視覺化
   - [ ] 優化使用者體驗

3. 部署準備
   - [ ] 前端: Vercel 部署設定
   - [ ] 後端: GCP 環境配置
   - [ ] CI/CD 流程設置
   - [ ] 監控系統建置