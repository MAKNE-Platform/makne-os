"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TopCreatorsBarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fill: "#ffffff70", fontSize: 11 }}
            width={140}
          />
          <Tooltip
            contentStyle={{
              background: "#000",
              border: "1px solid #636EE1",
            }}
          />
          <Bar dataKey="value" fill="#636EE1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
