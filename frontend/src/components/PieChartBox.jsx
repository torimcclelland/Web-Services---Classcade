import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Red', value: 30 },
  { name: 'Blue', value: 10 },
  { name: 'Green', value: 15 },
  { name: 'Yellow', value: 25 },
  { name: 'Purple', value: 20 },
];

const COLORS = ['#FF4C4C', '#4C9EFF', '#4CAF50', '#FFD700', '#A020F0'];

const PieChartBox = () => (
  <PieChart width={300} height={300}>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
);

export default PieChartBox;
