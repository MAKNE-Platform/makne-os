"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function PaymentsLineChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#ffffff10" strokeDasharray="4 4" />
          <XAxis dataKey="label" tick={{ fill: "#ffffff70", fontSize: 11 }} />
          <YAxis tick={{ fill: "#ffffff70", fontSize: 11 }} />
          <Tooltip
            formatter={(v) => [`₹${v ?? 0}`, "Spend"]}
            contentStyle={{
              background: "#000",
              border: "1px solid #636EE1",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22d3ee"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
