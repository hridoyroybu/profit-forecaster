import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InputForm from './InputForm';

describe('InputForm', () => {
  const mockInputs = {
    months: 12,
    startUsers: 100,
    growthRate: 10,
    churnRate: 5,
    revenuePerUser: 20,
    costPerUser: 5,
    fixedCost: 1000,
    toggleRevenueBoost: false,
    toggleGrowthDrop: false
  };

  let setInputs, onCalculate;

  beforeEach(() => {
    setInputs = jest.fn();
    onCalculate = jest.fn();

    render(
      <InputForm
        inputs={mockInputs}
        setInputs={setInputs}
        onCalculate={onCalculate}
      />
    );
  });

  it('renders all input fields', () => {
    expect(screen.getByPlaceholderText(/start users/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/growth rate/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/churn rate/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/revenue per user/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/cost per user/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/fixed cost/i)).toBeInTheDocument();
  });
  
  it('calls setInputs on input change', () => {
    const input = screen.getByLabelText(/Start Users/i);
    fireEvent.change(input, { target: { value: '200' } });

    expect(setInputs).toHaveBeenCalledWith(expect.any(Function));
  });

  it('validates negative input as error', () => {
    const input = screen.getByLabelText(/Fixed Cost/i);
    fireEvent.change(input, { target: { value: '-500' } });

    expect(setInputs).toHaveBeenCalled();
    expect(input).toHaveClass('input-error');
  });

  it('renders and toggles the Revenue Boost checkbox', () => {
    const checkbox = screen.getByLabelText(/Enable a 10% increase in revenue/i);
    fireEvent.click(checkbox);

    expect(setInputs).toHaveBeenCalled();
  });

  it('renders and toggles the Growth Drop checkbox', () => {
    const checkbox = screen.getByLabelText(/Enable a 50% drop in growth rate/i);
    fireEvent.click(checkbox);

    expect(setInputs).toHaveBeenCalled();
  });

  it('calls onCalculate when button is clicked', () => {
    const button = screen.getByRole('button', { name: /Calculate Forecast/i });
    fireEvent.click(button);

    expect(onCalculate).toHaveBeenCalled();
  });

  it('disables button after click and re-enables on input change', () => {
    const button = screen.getByRole('button', { name: /Calculate Forecast/i });

    fireEvent.click(button);
    expect(button).toBeDisabled();

    const input = screen.getByLabelText(/Start Users/i);
    fireEvent.change(input, { target: { value: '12' } });

    expect(button).not.toBeDisabled();
  });
});
