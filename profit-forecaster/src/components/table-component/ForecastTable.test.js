import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForecastTable from './ForecastTable';

describe('ForecastTable', () => {
  const generateMockData = (count, withProfit = true) =>
    Array.from({ length: count }, (_, i) => ({
      month: i + 1,
      users: 100 + i,
      revenue: 1000 + i * 10,
      cost: 500 + i * 5,
      profit: withProfit ? 500 + i * 2 : -100 - i * 2,
      cumulativeRevenue: (1000 + i * 10) * (i + 1),
      cumulativeCost: (500 + i * 5) * (i + 1),
      cumulativeProfit: (withProfit ? 500 + i * 2 : -100 - i * 2) * (i + 1),
    }));

  it('shows only 12 rows initially when data > 12', () => {
    render(<ForecastTable data={generateMockData(20)} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(13); // 1 header + 12 visible rows
  });

  it('shows all rows after clicking "See More"', () => {
    render(<ForecastTable data={generateMockData(20)} />);
    fireEvent.click(screen.getByText(/See More/i));
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(21); // 1 header + 20 data rows
  });

  it('collapses rows after clicking "Show Less"', () => {
    render(<ForecastTable data={generateMockData(20)} />);
    const button = screen.getByText(/See More/i);
    fireEvent.click(button);
    fireEvent.click(screen.getByText(/Show Less/i));
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(13);
  });

  it('does not show "See More" button when data ≤ 12', () => {
    render(<ForecastTable data={generateMockData(10)} />);
    expect(screen.queryByText(/See More/i)).not.toBeInTheDocument();
  });

  it('renders 🟢 icon and profit style for positive profit rows', () => {
    render(<ForecastTable data={[{ month: 1, users: 100, revenue: 1000, cost: 500, profit: 300 }]} />);
    const cell = screen.getByText(/🟢 £300.00/);
    expect(cell).toHaveClass('row-profit');
  });

  it('renders 🔴 icon and loss style for negative profit rows', () => {
    render(<ForecastTable data={[{ month: 1, users: 100, revenue: 1000, cost: 1500, profit: -500 }]} />);
    const cell = screen.getByText(/🔴 -£500.00/);
    expect(cell).toHaveClass('row-loss');
  });
  
  it('resets expansion state when data changes', () => {
    const { rerender } = render(<ForecastTable data={generateMockData(20)} />);
    fireEvent.click(screen.getByText(/See More/i));
    expect(screen.getAllByRole('row')).toHaveLength(21);
    
    // rerender with different data (simulate new forecast)
    rerender(<ForecastTable data={generateMockData(15)} />);
    expect(screen.getAllByRole('row')).toHaveLength(13); // back to collapsed
  });
});
