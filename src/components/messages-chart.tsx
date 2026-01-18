import type { BarChartData } from "@/openapi";
import { type FC } from "react";
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

const MessagesChart: FC<{ chartData: BarChartData[] }> = ({ chartData }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Activity Overview (Last 6 Weeks)</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
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

            <Bar
              dataKey="evaluations_count"
              name="Evaluations"
              stackId="a"
              fill="#3B82F6"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="actions_count"
              name="Actions"
              stackId="a"
              fill="#10B981"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MessagesChart;
