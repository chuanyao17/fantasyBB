import { cookies } from "next/headers";
import { Matchup } from "@/types/matchups";
import MatchupComparison from "@/components/MatchupComparison";

/**
 * 從後端取得資料
 */
async function getMatchupsData(): Promise<Matchup[] | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fantasy/matchups`, {
      ...(token && {
        headers: {
          Cookie: `token=${token}`,
        },
      }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch matchups");
    return res.json();
  } catch (error) {
    console.error("Error fetching matchups:", error);
    return null;
  }
}

/**
 * 計算各欄位 (columns) 的最小值與最大值
 */
function getMinMaxMap(data: Matchup[], columns: string[]) {
  const minMax: Record<string, { min: number; max: number }> = {};

  columns.forEach((col) => {
    const values = data.map((item) => parseFloat(item.stats[col] || "0"));
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    minMax[col] = { min: minVal, max: maxVal };
  });

  return minMax;
}

/**
 * 多段漸層的重點在 colorScale 函式。
 * 這裡示範「3 段」：紅 (#dc2626) → 黃 (#facc15) → 綠 (#22c55e)
 *
 * ratio = [0, 1]
 *  - [0, 0.5] 之間： 紅 → 黃
 *  - [0.5, 1] 之間： 黃 → 綠
 *
 * reversed = true 時 (TO 欄位)：會先用 ratio = 1 - ratio 做反轉。
 */
function colorScale(
  value: number,
  minMax: { min: number; max: number },
  reversed = false
): string {
  const { min, max } = minMax;
  if (max === min) return "#1e293b"; // slate-900

  let ratio = (value - min) / (max - min);
  if (reversed) ratio = 1 - ratio;

  // 三段漸層的顏色節點：深紅→暗黃→深綠
  const red    = { r: 185, g: 28,  b: 28  };  // red-700
  const yellow = { r: 202, g: 138, b: 4   };  // yellow-600
  const green  = { r: 21,  g: 128, b: 61  };  // green-700

  // 在 [0, 0.5] 區間做「紅→黃」的線性插值
  // 在 (0.5, 1] 區間做「黃→綠」的線性插值
  if (ratio <= 0.5) {
    const subRatio = ratio / 0.5;
    const r = Math.round(red.r + (yellow.r - red.r) * subRatio);
    const g = Math.round(red.g + (yellow.g - red.g) * subRatio);
    const b = Math.round(red.b + (yellow.b - red.b) * subRatio);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const subRatio = (ratio - 0.5) / 0.5;
    const r = Math.round(yellow.r + (green.r - yellow.r) * subRatio);
    const g = Math.round(yellow.g + (green.g - yellow.g) * subRatio);
    const b = Math.round(yellow.b + (green.b - yellow.b) * subRatio);
    return `rgb(${r}, ${g}, ${b})`;
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

  const columns = ["FG%", "FT%", "3PTM", "PTS", "REB", "AST", "ST", "BLK", "TO"];
  const minMaxMap = getMinMaxMap(matchupsData, columns);

  return (
    <main className="min-h-screen pixel-bg">
      <div className="font-[family-name:var(--font-press-start)] container mx-auto pt-20 pb-32 px-4">
        <h1 className="text-xl mb-12 text-yellow-300 pixel-text text-center">
          Matchups
        </h1>

        {/* 原有的表格 */}
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
              {matchupsData.map((match, index) => (
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

        {/* 新增的比較表格 */}
        <div className="mt-12">
          <MatchupComparison 
            matchupsData={matchupsData} 
            columns={columns} 
          />
        </div>
      </div>
    </main>
  );
}
