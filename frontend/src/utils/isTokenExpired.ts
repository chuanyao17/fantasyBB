export function isTokenExpired(tokenString?: string): boolean {
  // 若 tokenString 沒有值，直接視為過期 (或回傳 false, 依需求決定)
  if (!tokenString) {
    return true;
  }

  try {
    const cleanedTokenStr = tokenString
      .replace(/^"|"$/g, "") 
      .replace(/\\054/g, ",") 
      .replace(/\\"/g, '"'); 

    const parsedToken = JSON.parse(cleanedTokenStr);
    const expiresIn = parsedToken.expires_in;
    const tokenTime = parsedToken.token_time;
    console.log("expiresIn", expiresIn);
    console.log("tokenTime", tokenTime);

    const currentTime = Math.floor(Date.now() / 1000);
    const expireTime = tokenTime + expiresIn - 60;
    return currentTime > expireTime;
   
  } catch (error) {
    console.error("Failed to parse token:", error);
    return true;
  }
}