"use client";
import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

interface UtilizationRingProps {
  value: number;
}

export default function UtilizationRing({ value }: UtilizationRingProps) {
  return (
    <>
      <CircularProgressbar
        value={value * 100}
        styles={buildStyles({
          pathColor:
            value < 0.5
              ? tailwindFullTheme.theme.colors.semantic.success
              : tailwindFullTheme.theme.colors.semantic.warning,
          trailColor: "#CBD3D9",
          strokeLinecap: "round",
        })}
        strokeWidth={16}
      />
    </>
  );
}
