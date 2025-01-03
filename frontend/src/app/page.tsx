// app/page.tsx (Server Component)
import { cookies } from "next/headers";
import LoginButton from "@/components/LoginButton"; // 修正引入路徑

export default async function Home() {
  // 1. 在服務器端讀取 Cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let isAuthenticated = false;

  // 2. 在服務器端驗證 token
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/yahoo/verify`, {
      ... (token && {
        headers: {
          Cookie: `token=${token}`,  // 將 token 傳給後端驗證
        },
      }),
      cache: "no-store",
    });
    isAuthenticated = res.ok;
  } catch (error) {
    console.error("Error verifying authentication:", error);
  }

  return (
    <main className="min-h-screen pixel-bg">
      <div className="font-[family-name:var(--font-press-start)] container mx-auto max-w-lg pt-20">
        <div className="pixel-box p-8 bg-slate-900/90">
          <h1 className="text-xl mb-12 text-yellow-300 pixel-text text-center">
            Fantasy Basketball Assistant
          </h1>

          <div className="menu-container">
            {!isAuthenticated ? (
              <LoginButton />
            ) : (
              <div className="text-white text-center text-sm pixel-text">
                Welcome back!
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
