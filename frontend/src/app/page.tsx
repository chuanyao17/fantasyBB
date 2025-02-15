import { cookies } from "next/headers";
import LoginButton from "@/components/LoginButton";
import RefreshToken from "@/components/RefreshToken";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isAuthenticated = Boolean(token); // ✅ 只檢查 token 是否存在

  return (
    <>
      {token && <RefreshToken token={token} />} {/* ✅ 確保 RefreshToken 獨立執行 */}
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
    </>
  );
}
