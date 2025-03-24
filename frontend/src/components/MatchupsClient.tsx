"use client";

import { useState, useEffect } from "react";
import { Matchup } from "@/types/matchups";
import MatchupComparison from "@/components/MatchupComparison";
import MatchupsTable from "@/components/MatchupsTable";
import MatchupsSummaryTable from "@/components/MatchupsSummaryTable";
import MatchupsPowerRank from "@/components/MatchupsPowerRank";

const columns = ["FG%", "FT%", "3PTM", "PTS", "REB", "AST", "ST", "BLK", "TO"];

export default function MatchupsClient() {
  const [week, setWeek] = useState<number | null>(null);
  const [maxWeek, setMaxWeek] = useState<number>(1);
  const [matchupsData, setMatchupsData] = useState<Matchup[] | null>(null);
  const [allWeeksData, setAllWeeksData] = useState<Matchup[][]>([]);
  const [showPowerRank, setShowPowerRank] = useState(false);

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
  }, []);

  async function fetchMatchups(weekNum: number) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fantasy/matchups?week=${weekNum}`, {
        cache: "no-store",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch matchups");
      setMatchupsData(await res.json());
    } catch (error) {
      console.error("Error fetching matchups:", error);
      setMatchupsData(null);
    }
  }

  async function fetchAllWeeksData(maxWeek: number) {
    const allData: Matchup[][] = [];

    for (let w = 1; w <= maxWeek; w++) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fantasy/matchups?week=${w}`, {
          cache: "no-store",
          credentials: "include",
        });
        const data = await res.json();
        allData.push(data);
      } catch (err) {
        console.error(`Error fetching week ${w}:`, err);
        allData.push([]);
      }
    }

    setAllWeeksData(allData);
  }

  return (
    <div className="font-[family-name:var(--font-press-start)] container mx-auto pt-20 pb-32 px-4">
      <h1 className="text-xl mb-12 text-yellow-300 pixel-text text-center">Matchups</h1>

      {week !== null && (
        <div className="mb-6 flex justify-center">
          <label htmlFor="week-select" className="text-white mr-4">Select Week:</label>
          <select
            id="week-select"
            value={week}
            onChange={(e) => {
              const selectedWeek = Number(e.target.value);
              setWeek(selectedWeek);
              fetchMatchups(selectedWeek);
              setShowPowerRank(false); // 切換週數時回到 Summary
            }}
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

          {/* Summary / Power Rank 切換區塊 */}
          <div className="mt-12">
            <div className="mb-6 flex justify-center">
              <button
                onClick={() => setShowPowerRank((prev) => !prev)}
                className="pixel-text font-pixel-zh text-sm text-yellow-300 border border-gray-700 px-4 py-2 rounded-sm 
                          hover:translate-y-[1px] hover:shadow-inner hover:border-yellow-300 active:translate-y-[2px] transition duration-150"                
              >
                {showPowerRank ? "Back to Weekly Summary" : "Show Power Rank"}
              </button>
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
