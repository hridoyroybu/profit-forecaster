import { saveAs } from 'file-saver';

export const exportToCSV = (data) => {
  const header = 'Month,Users,Revenue,Cost,Profit\n';
  const rows = data.map(row => `${row.month},${row.users},${row.revenue},${row.cost},${row.profit}`).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  saveAs(blob, 'forecast.csv');
};

export const exportToJSON = (data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, 'forecast.json');
};
