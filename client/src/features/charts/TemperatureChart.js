import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const TemperatureChart = ({ data, unit }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis
        label={{
          value: `°${unit}`,
          angle: -90,
          position: 'insideLeft',
        }}
      />
      <Tooltip
        formatter={(value) => [`${value.toFixed(1)}°${unit}`, 'Temperature']}
      />
      <Legend />
      <Line
        type="monotone"
        dataKey="temp_c"
        stroke="#8884d8"
        name={`Temperature (°${unit})`}
      />
    </LineChart>
  </ResponsiveContainer>
);

export default TemperatureChart;
