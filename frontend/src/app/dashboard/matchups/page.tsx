import { cookies } from "next/headers";
import { Matchup } from "@/types/matchups";
import MatchupComparison from "@/components/MatchupComparison";
import MatchupsTable from "@/components/MatchupsTable";
import RefreshToken from "@/components/RefreshToken";

/**
 * 從後端取得資料
 */
async function getMatchupsData(): Promise<{ matchupsData: Matchup[] | null; token: string | null }>  {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    if (!token) return { matchupsData: null, token: null };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fantasy/matchups`, {
      headers: {
        Cookie: `token=${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch matchups");
    const matchupsData = await res.json();
    return { matchupsData, token };
  } catch (error) {
    console.error("Error fetching matchups:", error);
    return { matchupsData: null, token: null };
  }
}

export default async function MatchupsPage() {
  const { matchupsData, token } = await getMatchupsData();
  const columns = ["FG%", "FT%", "3PTM", "PTS", "REB", "AST", "ST", "BLK", "TO"];

  return (
    <main className="min-h-screen pixel-bg">
      {token && <RefreshToken token={token} />} {/* ✅ 確保 RefreshToken 在這裡 */}
      {matchupsData ? (
        <div className="font-[family-name:var(--font-press-start)] container mx-auto pt-20 pb-32 px-4">
          <h1 className="text-xl mb-12 text-yellow-300 pixel-text text-center">
            Matchups
          </h1>
          <MatchupsTable data={matchupsData} columns={columns} />
          <div className="mt-12">
            <MatchupComparison matchupsData={matchupsData} columns={columns} />
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="font-pixel-zh text-white text-center">
            Failed to load matchups data
          </div>
        </div>
      )}
    </main>
  );
}
