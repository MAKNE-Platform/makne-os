"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function DeliverablesLineChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#ffffff10" strokeDasharray="4 4" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#ffffff70", fontSize: 11 }}
            axisLine={{ stroke: "#ffffff20" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#ffffff70", fontSize: 11 }}
            axisLine={{ stroke: "#ffffff20" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#000",
              border: "1px solid #636EE1",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#636EE1"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
