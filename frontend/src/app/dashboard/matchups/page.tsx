import { cookies } from "next/headers";
import { Matchup } from "@/types/matchups";
import MatchupsClient from "@/components/MatchupsClient";
import RefreshToken from "@/components/RefreshToken";

async function fetchMatchupsData(): Promise<{ matchupsData: Matchup[] | null; token: string | null }> {
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
  const { matchupsData, token } = await fetchMatchupsData();

  return (
    <main className="min-h-screen pixel-bg">
      {token && <RefreshToken token={token} />}
      <MatchupsClient initialMatchups={matchupsData} />
    </main>
  );
}
