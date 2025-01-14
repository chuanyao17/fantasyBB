import { Matchup } from "@/types/matchups";

/**
 * 計算各欄位的最小值與最大值
 */
export function getMinMaxMap(data: Matchup[], columns: string[]) {
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
 * 多段漸層色彩計算
 */
export function colorScale(
  value: number,
  minMax: { min: number; max: number },
  reversed = false
): string {
  const { min, max } = minMax;
  if (max === min) return "#1e293b";

  let ratio = (value - min) / (max - min);
  if (reversed) ratio = 1 - ratio;

  const red    = { r: 185, g: 28,  b: 28  };
  const yellow = { r: 202, g: 138, b: 4   };
  const green  = { r: 21,  g: 128, b: 61  };

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