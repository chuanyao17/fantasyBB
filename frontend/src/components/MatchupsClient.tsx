"use client";

import { useState, useEffect, useCallback } from "react";
import { Matchup } from "@/types/matchups";
import MatchupComparison from "@/components/MatchupComparison";
import MatchupsTable from "@/components/MatchupsTable";
import MatchupsSummaryTable from "@/components/MatchupsSummaryTable";
import MatchupsPowerRank from "@/components/MatchupsPowerRank";
import MatchupsPowerRankButton from "@/components/MatchupsPowerRankButton";

const columns = ["FG%", "FT%", "3PTM", "PTS", "REB", "AST", "ST", "BLK", "TO"];

async function fetchWithRetry<T>(url: string, options: RequestInit = {}, retries = 3, delay = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`Fetch failed (attempt ${i + 1}):`, err);
      if (i < retries - 1) await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

export default function MatchupsClient() {
  const [week, setWeek] = useState<number | null>(null);
  const [maxWeek, setMaxWeek] = useState<number>(1);
  const [matchupsData, setMatchupsData] = useState<Matchup[] | null>(null);
  const [allWeeksData, setAllWeeksData] = useState<Matchup[][]>([]);
  const [showPowerRank, setShowPowerRank] = useState(false);

  const fetchMatchups = useCallback(async (weekNum: number) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/fantasy/matchups?week=${weekNum}`;
    try {
      const data = await fetchWithRetry<Matchup[]>(url, {
        cache: "no-store",
        credentials: "include",
      });
      setMatchupsData(data);
    } catch (error) {
      console.error("Error fetching matchups:", error);
      setMatchupsData(null);
    }
  }, []);

  const fetchAllWeeksData = useCallback(async (maxWeek: number) => {
    const weekPromises = Array.from({ length: maxWeek }, (_, i) => {
      const weekNum = i + 1;
      const url = `${process.env.NEXT_PUBLIC_API_URL}/fantasy/matchups?week=${weekNum}`;
      return fetchWithRetry<Matchup[]>(url, {
        cache: "no-store",
        credentials: "include",
      }).catch(err => {
        console.error(`❌ Week ${weekNum} failed after retry:`, err);
        return [];
      });
    });

    const allData = await Promise.all(weekPromises);
    setAllWeeksData(allData);
  }, []);

  const handleWeekChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWeek = Number(e.target.value);
    setWeek(selectedWeek);
    fetchMatchups(selectedWeek);
    setShowPowerRank(false);
  }, [fetchMatchups]);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fantasy/current-week`, {
          cache: "no-store",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch current week");
        const currentWeek = await res.json();
        setWeek(currentWeek);
        setMaxWeek(currentWeek);
        fetchMatchups(currentWeek);
        fetchAllWeeksData(currentWeek);
      } catch (error) {
        console.error("Error fetching current week:", error);
        setWeek(1);
        setMaxWeek(1);
        fetchMatchups(1);
        fetchAllWeeksData(1);
      }
    }
    fetchInitialData();
  }, [fetchMatchups, fetchAllWeeksData]);

  return (
    <div className="font-[family-name:var(--font-press-start)] container mx-auto pt-20 pb-32 px-4">
      <h1 className="text-xl mb-12 text-yellow-300 pixel-text text-center">Matchups</h1>

      {week !== null && (
        <div className="mb-6 flex justify-center">
          <label htmlFor="week-select" className="text-white mr-4">Select Week:</label>
          <select
            id="week-select"
            value={week}
            onChange={handleWeekChange}
            className="bg-slate-800 text-white text-sm pixel-text min-w-[150px] px-2 py-1 border border-gray-700 cursor-pointer hover:border-yellow-300"
          >
            {Array.from({ length: maxWeek }, (_, i) => i + 1).map((w) => (
              <option key={w} value={w}>Week {w}</option>
            ))}
          </select>
        </div>
      )}

      {matchupsData === null ? (
        <div className="text-white text-center">Loading matchups...</div>
      ) : (
        <>
          <MatchupsTable data={matchupsData} columns={columns} />
          <div className="mt-12">
            <MatchupComparison matchupsData={matchupsData} columns={columns} />
          </div>

          <div className="mt-12">
            <div className="mb-6 flex justify-center">
              <MatchupsPowerRankButton onClick={() => setShowPowerRank((prev) => !prev)}>
                {showPowerRank ? "Back to Weekly Summary" : "Show Power Rank"}
              </MatchupsPowerRankButton>
            </div>

            {showPowerRank ? (
              allWeeksData.length === 0 ? (
                <div className="text-white text-center">Loading power rank...</div>
              ) : (
                <MatchupsPowerRank allWeeksData={allWeeksData} columns={columns} />
              )
            ) : (
              <MatchupsSummaryTable matchupsData={matchupsData} columns={columns} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
