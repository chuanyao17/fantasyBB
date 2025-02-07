sequenceDiagram
    participant User
    participant Frontend as Frontend (Next.js - SSR)
    participant Backend as Backend (FastAPI)
    participant YahooOAuth as Yahoo OAuth
    participant FantasyAPI as Yahoo Fantasy API

    %% OAuth 登入流程
    User->>Frontend: Click "Login with Yahoo"
    Frontend->>Backend: Redirect to /auth/yahoo/login
    Backend->>Backend: Generate state (random string)
    Backend->>Backend: Store state in HTTP cookie
    Backend->>YahooOAuth: Generate OAuth URL with state
    YahooOAuth-->>Backend: Return OAuth URL
    Backend->>User: Redirect to Yahoo OAuth login page
    User->>YahooOAuth: Visit Yahoo OAuth login page

    %% OAuth 回調流程
    User->>YahooOAuth: Enter credentials & grant permission
    YahooOAuth->>Backend: Redirect to /auth/yahoo/callback with code & state
    Backend->>Backend: Extract state from cookie
    Backend->>Backend: Compare state (Validation)
    alt State Mismatch
        Backend-->>User: 400 Invalid state
    else State Valid
        Backend->>YahooOAuth: Exchange code for access token
        YahooOAuth-->>Backend: Return access token
        Backend->>Backend: Store token in HTTP cookie
        Backend->>Frontend: Redirect to frontend
    end

    %% 取得 Matchups 資料 (SSR)
    User->>Frontend: Visit /matchups page
    Frontend->>Frontend: Read token from server-side cookie
    Frontend->>Backend: Request /fantasy/matchups with token in headers
    Backend->>Backend: Extract token from request headers
    alt Token Not Found
        Backend-->>Frontend: 401 Unauthorized
    else Token Found
        Backend->>YahooOAuth: Validate token or refresh if expired
        Backend->>FantasyAPI: Fetch matchups data
        FantasyAPI-->>Backend: Return matchups data
        Backend-->>Frontend: Return matchups data
    end

    %% OAuth 登出流程
    User->>Frontend: Click "Logout"
    Frontend->>Backend: Request /auth/yahoo/logout
    Backend->>Backend: Delete token cookie
    Backend-->>Frontend: Return {"status": "logged out"}
