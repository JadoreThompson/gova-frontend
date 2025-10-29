import { type FC, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { MessageChartData } from "@/openapi";

const MessagesChart: FC<{ chartData: MessageChartData[] }> = ({
  chartData,
}) => {
  const flattenedData = useMemo(() => {
    return chartData.map((entry) => ({
      date: entry.date,
      ...entry.counts,
    }));
  }, [chartData]);

  const platforms = useMemo(() => {
    if (flattenedData.length === 0) return [];
    return Object.keys(flattenedData[0]).filter((k) => k !== "date");
  }, [flattenedData]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Messages Processed (Last 6 Weeks)</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={flattenedData}
            barGap={4}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              labelStyle={{ color: "#374151", fontWeight: 500 }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ fontSize: "12px", paddingBottom: "8px" }}
            />

            {platforms.map((platform) => {
              let color = "#9CA3AF";

              if (platform.toLowerCase().includes("discord")) color = "#5865F2";
              else if (platform.toLowerCase().includes("telegram"))
                color = "#229ED9";
              else if (platform.toLowerCase().includes("slack"))
                color = "#ECB22E";

              return (
                <Bar
                  key={platform}
                  dataKey={platform}
                  stackId="a"
                  fill={color}
                  radius={
                    platform === platforms[platforms.length - 1]
                      ? [6, 6, 0, 0]
                      : [0, 0, 0, 0]
                  }
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MessagesChart;
