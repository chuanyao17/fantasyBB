"use client";

import { Matchup } from "@/types/matchups";

interface MatchupsPowerRankProps {
  allWeeksData: Matchup[][]; // 每週的 matchups 陣列
  columns: string[];
}

export default function MatchupsPowerRank({ allWeeksData, columns }: MatchupsPowerRankProps) {
  // 累加每週 summary
  const summaryMap = new Map<string, { wins: number; losses: number; ties: number }>();

  allWeeksData.forEach((weekData) => {
    weekData.forEach((team) => {
      if (!summaryMap.has(team.name)) {
        summaryMap.set(team.name, { wins: 0, losses: 0, ties: 0 });
      }
    });

    weekData.forEach((team) => {
      weekData.forEach((opponent) => {
        if (team.name === opponent.name) return;

        let wins = 0, losses = 0, ties = 0;

        columns.forEach((col) => {
          const teamStat = parseFloat(team.stats[col] || "0");
          const oppStat = parseFloat(opponent.stats[col] || "0");

          if (col === "TO") {
            if (teamStat < oppStat) wins++;
            else if (teamStat > oppStat) losses++;
            else ties++;
          } else {
            if (teamStat > oppStat) wins++;
            else if (teamStat < oppStat) losses++;
            else ties++;
          }
        });

        const record = summaryMap.get(team.name)!;
        record.wins += wins;
        record.losses += losses;
        record.ties += ties;
      });
    });
  });

  const summaryArray = Array.from(summaryMap.entries()).map(([name, record]) => ({
    name,
    ...record,
  }));

  summaryArray.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.losses - b.losses;
  });

  return (
    <div className="overflow-x-auto mx-auto mt-12">
      <table className="table-auto border-collapse border border-gray-700 min-w-[600px] mx-auto">
        <thead className="bg-slate-900">
          <tr>
            <th className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh">Team</th>
            <th className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh">W</th>
            <th className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh">L</th>
            <th className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh">T</th>
          </tr>
        </thead>
        <tbody>
          {summaryArray.map((team) => (
            <tr key={team.name} className="text-center hover:bg-slate-800/50">
              <td className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh">
                {team.name}
              </td>
              <td className="border border-gray-700 px-4 py-2 text-green-500 text-sm pixel-text font-pixel-zh">
                {team.wins}
              </td>
              <td className="border border-gray-700 px-4 py-2 text-red-500 text-sm pixel-text font-pixel-zh">
                {team.losses}
              </td>
              <td className="border border-gray-700 px-4 py-2 text-yellow-300 text-sm pixel-text font-pixel-zh">
                {team.ties}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
