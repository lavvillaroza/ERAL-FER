import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Reusable FER Line Chart component
export const FERLineChart = ({ ferTimeSeriesData }: { ferTimeSeriesData: { timestamp: string; value: number }[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={ferTimeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="happy" stroke="#4ade80" name="Happy" />
        <Line type="monotone" dataKey="neutral" stroke="#60a5fa" name="Neutral" />
        <Line type="monotone" dataKey="surprised" stroke="#f97316" name="Surprised" />
        <Line type="monotone" dataKey="sad" stroke="#a855f7" name="Sad" />
        <Line type="monotone" dataKey="disgusted" stroke="#71717a" name="Disgusted" />
        <Line type="monotone" dataKey="angry" stroke="#ef4444" name="Angry" />
      </LineChart>
    </ResponsiveContainer>
  );
};