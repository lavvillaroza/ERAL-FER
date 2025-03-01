import React from 'react';
import { cn } from "@/lib/utils";

interface DonutChartProps {
  value: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ value, color, size = 80, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted-foreground/20"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          className={cn(color)}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
        {value}%
      </div>
    </div>
  );
};

export default DonutChart;