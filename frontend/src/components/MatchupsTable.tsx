import { Matchup } from "@/types/matchups";
import { colorScale, getMinMaxMap } from "@/utils/matchups";

interface MatchupsTableProps {
  data: Matchup[];
  columns: string[];
}

export default function MatchupsTable({ data, columns }: MatchupsTableProps) {
  const minMaxMap = getMinMaxMap(data, columns);

  return (
    <div className="overflow-x-auto mx-auto">
      <table className="table-auto border-collapse min-w-[900px] border border-gray-700 mx-auto">
        <thead className="bg-slate-900">
          <tr>
            <th className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh">
              Name
            </th>
            {columns.map((col) => (
              <th key={col} className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((match, index) => (
            <tr key={index} className="text-center">
              <td className="border border-gray-700 px-4 py-2 text-white text-sm pixel-text font-pixel-zh">
                {match.name}
              </td>
              {columns.map((col) => {
                const numericVal = parseFloat(match.stats[col] || "0");
                const bgColor = colorScale(numericVal, minMaxMap[col], col === "TO");

                return (
                  <td
                    key={col}
                    className="border border-gray-700 px-4 py-2 text-sm pixel-text font-pixel-zh text-white"
                    style={{ backgroundColor: bgColor }}
                  >
                    {match.stats[col]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 