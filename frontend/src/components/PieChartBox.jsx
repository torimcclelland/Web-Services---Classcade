import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#1e3a8a",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#ef4444",
  "#6366f1",
];

const PieChartBox = ({ data }) => (
  <PieChart width={300} height={300}>
    <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
      {data.map((entry, i) => (
        <Cell key={entry.userId} fill={COLORS[i % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
);

export default PieChartBox;
