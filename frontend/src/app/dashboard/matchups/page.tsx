import { cookies } from "next/headers";
import { Matchup } from '@/types/matchups';

async function getMatchupsData(): Promise<Matchup[] | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fantasy/matchups`, {
      headers: {
        Cookie: `token=${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error('Failed to fetch matchups');
    return res.json();
  } catch (error) {
    console.error("Error fetching matchups:", error);
    return null;
  }
}

export default async function MatchupsPage() {
  const matchupsData = await getMatchupsData();

  if (!matchupsData) {
    return (
      <div className="min-h-screen pixel-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="font-pixel-zh text-white text-center">
            Failed to load matchups data
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pixel-bg">
      <div className="font-[family-name:var(--font-press-start)] container mx-auto max-w-lg pt-20">
        <h1 className="text-xl mb-12 text-yellow-300 pixel-text text-center">
          Matchups
        </h1>
        <div className="space-y-6">
          {matchupsData.map((match: Matchup, index: number) => (
            <div key={index} className="pixel-box p-6 bg-slate-900">
              <div className="text-white text-sm pixel-text text-center mb-4 font-pixel-zh">
                {match.name}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(match.stats).map(([stat, value]) => (
                  <div key={stat} className="flex justify-between items-center text-sm">
                    <span className="text-yellow-300 pixel-text">
                      {stat}
                    </span>
                    <span className="text-white pixel-text ml-2">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 