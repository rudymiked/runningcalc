import React from 'react';
import type { VDOTEntry } from './VDOTDashboard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface VDOTChartProps {
  data: VDOTEntry[];
}

const VDOTChart: React.FC<VDOTChartProps> = ({ data }) => {
  const chartData = data.map(entry => ({
    date: entry.date,
    vdot: entry.vdot,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
        <Line type="monotone" dataKey="vdot" stroke="#1976d2" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default VDOTChart;