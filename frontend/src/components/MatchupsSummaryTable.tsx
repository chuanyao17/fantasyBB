import { Matchup } from "@/types/matchups";

interface MatchupsSummaryTableProps {
  matchupsData: Matchup[];
  columns: string[];
}

export default function MatchupsSummaryTable({ matchupsData, columns }: MatchupsSummaryTableProps) {
  // 計算每支隊伍的 W/L/T 總和
  const summaryData = matchupsData.map((team) => {
    let totalWins = 0, totalLosses = 0, totalTies = 0;

    matchupsData.forEach((opponent) => {
      if (team.name === opponent.name) return; // 跳過自己

      let wins = 0, losses = 0, ties = 0;

      columns.forEach((col) => {
        const teamStat = parseFloat(team.stats[col] || "0");
        const opponentStat = parseFloat(opponent.stats[col] || "0");

        if (col === "TO") {
          if (teamStat < opponentStat) wins++; // TO 越低越好
          else if (teamStat > opponentStat) losses++;
          else ties++;
        } else {
          if (teamStat > opponentStat) wins++; // 其他數據越高越好
          else if (teamStat < opponentStat) losses++;
          else ties++;
        }
      });

      // 加總該隊伍與這個對手的 W/L/T
      totalWins += wins;
      totalLosses += losses;
      totalTies += ties;
    });

    return { name: team.name, wins: totalWins, losses: totalLosses, ties: totalTies };
  });

  // 根據 W (勝場數) 進行降序排序

  summaryData.sort((a, b) => {
    if (b.wins !== a.wins) {
      return b.wins - a.wins; // W 降序
    }
    return a.losses - b.losses; // W 相同時，L 升序（較少的排前面）
  });


  return (
    <div className="overflow-x-auto mx-auto mt-12">
      <table className="table-auto border-collapse border border-gray-700 mx-auto min-w-[600px]">
        <thead className="bg-slate-900">
          <tr>
            <th className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh">Team</th>
            <th className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh">W</th>
            <th className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh">L</th>
            <th className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh">T</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map((team) => (
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
