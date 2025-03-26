"use client";

import { ButtonHTMLAttributes } from "react";

interface MatchupsPowerRankButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function MatchupsPowerRankButton({
  className = "",
  children,
  ...props
}: MatchupsPowerRankButtonProps) {
  const base =
    "pixel-text font-pixel-zh text-sm text-yellow-300 border border-gray-700 px-4 py-2 rounded-sm shadow-sm hover:translate-y-[1px] hover:shadow-inner hover:border-yellow-300 active:translate-y-[2px] transition duration-150";

  return (
    <button {...props} className={`${base} ${className}`}>
      {children}
    </button>
  );
}
