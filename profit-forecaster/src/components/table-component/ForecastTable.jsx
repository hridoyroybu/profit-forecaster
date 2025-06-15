import React, { useState, useEffect } from 'react';
import './ForecastTable.css';

const ForecastTable = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const visibleRows = expanded ? data : data.slice(0, 12);

  const getFormatedValue = (value) => {
    return `${value < 0 ? '-' : ''}£${Math.abs(value).toFixed(2)}`
  }

  useEffect(() => {
    setExpanded(false)
  }, [data]); 

  return (
    <div className="forecast-table-wrapper">
      <h2 className="forecast-table-title">Monthly Financial Forecast</h2>
      <table className="forecast-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Users</th>
            <th>Revenue (£)</th>
            <th>Cost (£)</th>
            <th>Profit (£)</th>
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, index) => (
            <tr key={`${row.month}-${index}`}>
              <td>{row.month}</td>
              <td>{row.users}</td>
              <td>£{Number(row.revenue).toFixed(2)}</td>
              <td>£{Number(row.cost).toFixed(2)}</td>
              <td
                className={row.profit >= 0 ? 'row-profit' : 'row-loss'}
              >
                {row.profit >= 0 ? '🟢' : '🔴'} { getFormatedValue(row.profit) }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 12 && (
        <div className="table-expand-button-wrapper">
          <button
            className="table-expand-button"
            onClick={() => setExpanded(prev => !prev)}
          >
            {expanded ? '▲ Show Less' : '▼ See More'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ForecastTable;
