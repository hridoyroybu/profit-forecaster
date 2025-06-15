import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import './ChartView.css';

const ChartView = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">Month: {label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: £{parseFloat(entry.value).toFixed(2)}
          </p>
        ))}
      </div>
    );
  };

  const [chartType, setChartType] = useState('bar');
  // Collect all Y-axis values across revenue, cost, and profit
  const allYValues = data.flatMap(d => [d.revenue, d.cost, d.profit]);
  const minY = Math.min(...allYValues);
  const maxY = Math.max(...allYValues);
  const bufferMin = minY < 0 ? (maxY - minY) * 0.1 : 0;
  const bufferMax = (maxY - minY) * 0.1;

  return (
    <div className="forecast-chart-wrapper">
      <h2 className="forecast-chart-title">Forecast Chart</h2>
      <div className='toggole-button'>
        <button onClick={() => setChartType(chartType === 'bar' ? 'area' : 'bar')}>
          Switch to {chartType === 'bar' ? 'Area' : 'Bar'} Chart
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'area' ? (
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, angle: -45 }}
              label={{ value: 'Month', position: 'insideBottom', offset: -15 }}
            />
            <YAxis
              domain={[minY - bufferMin, maxY + bufferMax]}
              tick={{ fontSize: 12, angle: -45 }}
              tickFormatter={(value) => value.toFixed(2)}
              label={{ value: '£ (Amount)', angle: -90, position: 'insideLeft', offset: -10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" align="right" layout="vertical" />
            <Area type="monotone" dataKey="revenue" stroke="#82ca9d" fill="#d0f0c0" name="Revenue (£)" />
            <Area type="monotone" dataKey="cost" stroke="#8884d8" fill="#dcd4f5" name="Cost (£)" />
            <Area type="monotone" dataKey="profit" stroke="#ff7300" fill="#ffd8b0" name="Profit (£)" />
          </AreaChart>
        ) : (
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, angle: -45 }}
              label={{ value: 'Month', position: 'insideBottom', offset: -15 }}
            />
            <YAxis
              domain={[minY - bufferMin, maxY + bufferMax]}
              tick={{ fontSize: 12, angle: -45 }}
              tickFormatter={(value) => value.toFixed(2)}
              label={{ value: '£ (Amount)', angle: -90, position: 'insideLeft', offset: -10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" align="right" layout="vertical" />
            <ReferenceLine y={0} stroke="#000" />
            <Bar dataKey="revenue" fill="#82ca9d" />
            <Bar dataKey="cost" fill="#8884d8" />
            <Bar dataKey="profit" fill="#ff7300" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartView;
