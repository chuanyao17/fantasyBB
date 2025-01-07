"use client";

import { useState } from "react";
import { Matchup } from "@/types/matchups";

interface MatchupComparisonProps {
  matchupsData: Matchup[];
  columns: string[];
}

interface Differences {
  [key: string]: number;
}

export default function MatchupComparison({ matchupsData, columns }: MatchupComparisonProps) {
  const [selectedTeam, setSelectedTeam] = useState(matchupsData[0]?.name || '');

  return (
    <>
      {/* 比較表格說明 */}
      <div className="mb-4 text-center">
        <p className="text-slate-300 text-sm pixel-text space-y-2">
          <div>
            <span className="text-yellow-300">Compare Mode: </span>
            <span className="text-slate-200">Select a team.</span>
          </div>
          <div className="mt-2">
            <span className="text-green-500">W</span>
            <span className="mx-1 text-slate-400">/</span>
            <span className="text-red-500">L</span>
            <span className="mx-1 text-slate-400">/</span>
            <span className="text-yellow-300">T</span>
            <span className="ml-2 text-slate-200">
              indicates how many categories the selected team wins, loses, or ties against each opponent.
            </span>
          </div>
        </p>
      </div>

      {/* 比較表格 */}
      <div className="overflow-x-auto mx-auto">
        <table className="table-auto border-collapse border border-gray-700 mx-auto" style={{ width: 'calc(100% - 64px)' }}>
          <thead className="bg-slate-900">
            <tr>
              <th className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh text-left">
                <div className="flex items-center">
                  <span className="text-yellow-300">Compare:</span>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="ml-4 bg-slate-800 text-white text-sm pixel-text font-pixel-zh w-[300px] px-2 py-1 border border-gray-700 cursor-pointer hover:border-yellow-300"
                  >
                    {matchupsData.map((match) => (
                      <option key={match.name} value={match.name}>
                        {match.name}
                      </option>
                    ))}
                  </select>
                </div>
              </th>
              {columns.map((col) => (
                <th key={col} className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh">
                  {col}
                </th>
              ))}
              <th className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {matchupsData
              .filter((match) => match.name !== selectedTeam)
              .map((match) => {
                const selectedTeamData = matchupsData.find((m) => m.name === selectedTeam);
                const differences: Differences = {};
                let wins = 0, losses = 0, ties = 0;

                columns.forEach((col) => {
                  const diff = parseFloat(selectedTeamData?.stats[col] || "0") - parseFloat(match.stats[col] || "0");
                  differences[col] = diff;
                  
                  if (col === 'TO') {
                    if (diff < 0) wins++;
                    else if (diff > 0) losses++;
                    else ties++;
                  } else {
                    if (diff > 0) wins++;
                    else if (diff < 0) losses++;
                    else ties++;
                  }
                });

                return (
                  <tr key={match.name} className="text-center hover:bg-slate-800/50">
                    <td className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh">
                      {match.name}
                    </td>
                    {columns.map((col) => {
                      const diff = differences[col];
                      let textColor = "text-white";
                      
                      if (col === 'TO') {
                        if (diff < 0) textColor = "text-green-500";
                        else if (diff > 0) textColor = "text-red-500";
                      } else {
                        if (diff > 0) textColor = "text-green-500";
                        else if (diff < 0) textColor = "text-red-500";
                      }
                      
                      return (
                        <td
                          key={col}
                          className={`
                            border border-gray-700 
                            px-4 py-2 
                            text-sm pixel-text font-pixel-zh 
                            ${textColor}
                          `}
                        >
                          {diff > 0 ? '+' : ''}{diff.toFixed(3)}
                        </td>
                      );
                    })}
                    <td className="border border-gray-700 px-4 py-2 text-sm pixel-text font-pixel-zh">
                      <span className="text-green-500">{wins}W</span>
                      <span className="text-red-500 ml-2">{losses}L</span>
                      <span className="text-yellow-300 ml-2">{ties}T</span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
} 