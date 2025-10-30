import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'A', value: 40 },
  { name: 'B', value: 24 },
  { name: 'C', value: 18 },
  { name: 'D', value: 32 },
  { name: 'E', value: 27 },
  { name: 'F', value: 22 },
];

const BarChartBox = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
);

export default BarChartBox;
