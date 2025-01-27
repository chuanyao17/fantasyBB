"use client";

import { useEffect } from "react";
import { isTokenExpired } from "@/utils/isTokenExpired";
import { usePathname } from "next/navigation";

interface RefreshTokenProps {
  token: string; // 接收 token 作为 props
}

export default function RefreshToken({ token }: RefreshTokenProps) {
  const pathname = usePathname(); // 获取当前页面路径
  useEffect(() => {
    async function checkAndRefreshToken() {
      try {
        if (isTokenExpired(token)) {
          console.log("Token expired, refreshing the token");

          const verifyUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/yahoo/verify?redirect=${encodeURIComponent(
            pathname
          )}`;
          window.location.href = verifyUrl; // 后端完成验证并更新 Cookie
        } else {
          console.log("Token is valid.");
        }
      } catch (error) {
        console.error("Error during token validation or logout:", error);
      }
    }

    checkAndRefreshToken();
  }, [pathname, token]);

  return null; // 此组件无需渲染任何内容
}
