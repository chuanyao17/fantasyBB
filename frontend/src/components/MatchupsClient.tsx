"use client";

import { useState, useEffect } from "react";
import { Matchup } from "@/types/matchups";
import MatchupComparison from "@/components/MatchupComparison";
import MatchupsTable from "@/components/MatchupsTable";
import MatchupsSummaryTable from "@/components/MatchupsSummaryTable";

const columns = ["FG%", "FT%", "3PTM", "PTS", "REB", "AST", "ST", "BLK", "TO"];

export default function MatchupsClient() {
  const [week, setWeek] = useState<number | null>(null);
  const [maxWeek, setMaxWeek] = useState<number>(1);
  const [matchupsData, setMatchupsData] = useState<Matchup[] | null>(null);

  // 🚀 取得當前週數，並初始化比賽數據
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
      } catch (error) {
        console.error("Error fetching current week:", error);
        setWeek(1);
        setMaxWeek(1);
        fetchMatchups(1);
      }
    }
    fetchInitialData();
  }, []);

  // 🚀 取得比賽數據
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

  return (
    <div className="font-[family-name:var(--font-press-start)] container mx-auto pt-20 pb-32 px-4">
      <h1 className="text-xl mb-12 text-yellow-300 pixel-text text-center">Matchups</h1>

      {/* 週數選擇器 */}
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
            }}
            className="bg-slate-800 text-white text-sm pixel-text min-w-[150px] px-2 py-1 border border-gray-700 cursor-pointer hover:border-yellow-300"
          >
            {Array.from({ length: maxWeek }, (_, i) => i + 1).map((w) => (
              <option key={w} value={w}>Week {w}</option>
            ))}
          </select>
        </div>
      )}

      {/* 加載狀態 & 顯示內容 */}
      {matchupsData === null ? (
        <div className="text-white text-center">Loading matchups...</div>
      ) : (
        <>
          <MatchupsTable data={matchupsData} columns={columns} />
          <div className="mt-12">
            <MatchupComparison matchupsData={matchupsData} columns={columns} />
          </div>
          <div className="mt-12">
            <MatchupsSummaryTable matchupsData={matchupsData} columns={columns} />
          </div>
        </>
      )}
    </div>
  );
}
