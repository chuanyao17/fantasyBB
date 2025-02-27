"use client";

import { useState, useEffect } from "react";
import { Matchup } from "@/types/matchups";
import MatchupComparison from "@/components/MatchupComparison";
import MatchupsTable from "@/components/MatchupsTable";
import MatchupsSummaryTable from "@/components/MatchupsSummaryTable";

export default function MatchupsClient() {
  const [week, setWeek] = useState<number | null>(null);
  const [maxWeek, setMaxWeek] = useState<number>(1); // 週數上限
  const [matchupsData, setMatchupsData] = useState<Matchup[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const columns = ["FG%", "FT%", "3PTM", "PTS", "REB", "AST", "ST", "BLK", "TO"];

  // 🚀 1. 取得當前週數，並設為最大週數
  useEffect(() => {
    async function fetchCurrentWeek() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fantasy/current-week`, {
          cache: "no-store",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch current week");
        const currentWeek = await res.json();
        setWeek(currentWeek); // 設定當前週數
        setMaxWeek(currentWeek); // 設定最大週數
      } catch (error) {
        console.error("Error fetching current week:", error);
        setWeek(1); // 預設為第一週，避免錯誤
        setMaxWeek(1);
      }
    }

    fetchCurrentWeek();
  }, []);

  // 🚀 2. 當週數變更時，獲取比賽數據
  useEffect(() => {
    async function fetchMatchups() {
      if (week === null) return; // 等待 week 初始化
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fantasy/matchups?week=${week}`, {
          cache: "no-store",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch matchups");
        const data = await res.json();
        setMatchupsData(data);
      } catch (error) {
        console.error("Error fetching matchups:", error);
        setMatchupsData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMatchups();
  }, [week]);

  return (
    <div className="font-[family-name:var(--font-press-start)] container mx-auto pt-20 pb-32 px-4">
      <h1 className="text-xl mb-12 text-yellow-300 pixel-text text-center">Matchups</h1>

      {/* 週數選擇器 (確保 week !== null 才顯示) */}
      {week !== null && (
        <div className="mb-6 flex justify-center">
          <label htmlFor="week-select" className="text-white mr-4">
            Select Week:
          </label>
          <select
            id="week-select"
            value={week}
            onChange={(e) => setWeek(Number(e.target.value))}
            className="bg-slate-800 text-white text-sm pixel-text min-w-[150px] px-2 py-1 border border-gray-700 cursor-pointer hover:border-yellow-300"
          >
            {Array.from({ length: maxWeek }, (_, i) => i + 1).map((w) => (
              <option key={w} value={w}>
                Week {w}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="text-yellow-300 text-center">Loading data...</div>
      ) : matchupsData ? (
        <>
          <MatchupsTable data={matchupsData} columns={columns} />
          <div className="mt-12">
            <MatchupComparison matchupsData={matchupsData} columns={columns} />
          </div>
          <div className="mt-12">
            <MatchupsSummaryTable matchupsData={matchupsData} columns={columns} />
          </div>
        </>
      ) : (
        <div className="text-white text-center">Failed to load matchups data</div>
      )}
    </div>
  );
}
