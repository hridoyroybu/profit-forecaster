// InputForm.jsx
import React, { useState } from 'react';
import './InputForm.css';

const InputForm = ({ inputs, setInputs, onCalculate }) => {
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : parseFloat(value);


    let error = '';
    if (type !== 'checkbox') {
      if (name === 'months') {
        if (val < 12 || val > 36) error = 'Must be between 12 and 36';
        val = Math.max(12, Math.min(36, val));
      } else if (val < 0 || isNaN(val)) {
        error = 'Must be greater than 0';
        val = 0;
      }
    }

    setIsButtonDisabled(false);
    setInputs(prev => ({ ...prev, [name]: val }));
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const getTooltip = (key) => {
    const tooltips = {
      months: 'Number of months to forecast (12-36)',
      startUsers: 'Initial number of active users',
      growthRate: 'Monthly growth rate as a %',
      churnRate: 'Monthly churn rate as a % of users leaving',
      revenuePerUser: 'Revenue earned from each user per month in £',
      costPerUser: 'Cost incurred for each user per month in £',
      fixedCost: 'Fixed monthly cost (e.g. salaries, rent)'
    };
    return tooltips[key] || '';
  };

  return (
    <form className="input-form" onSubmit={(e) => e.preventDefault()}>
      {Object.entries(inputs).map(([key, value]) => (
        key.startsWith('toggle') ? (
          <div key={key} className="toggle-wrapper">
            <label className="switch">
              <input
                id={key}
                type="checkbox"
                name={key}
                checked={value}
                onChange={handleChange}
              />
              <span className="slider"></span>
            </label>
            <label htmlFor={key} className="toggle-label">
              {key === 'toggleRevenueBoost'
                ? ' Enable a 10% increase in revenue per user after month 6'
                : ' Enable a 50% drop in growth rate after month 12'}
            </label>
          </div>
        ) : key === 'months' ? (
          <div key={key} className="slider-group">
            <label htmlFor={key} className="input-label">
              Number of Months to Forecast: <span className="slider-value">{value}</span>
            </label>
            <input
              type="range"
              name={key}
              id={key}
              min="12"
              max="36"
              step="1"
              value={value}
              onChange={handleChange}
              className="styled-slider"
              style={{
                background: `linear-gradient(to right, #185a9d ${(inputs.months - 12) * 4.1667}%, #dfe6e9 ${(inputs.months - 12) * 4.1667}%)`
              }}
            />
            <div className="slider-labels">
              {[...Array(25)].map((_, i) => (
                <span key={i}>{i + 12}</span>
              ))}
            </div>
          </div>
        ) : (
          <div key={key} className="input-group">
            <label htmlFor={key} className="input-label">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              <span className="info-icon">
                ℹ️
                <span className="tooltip-text">{getTooltip(key)}</span>
              </span>
            </label>
            <input
              className={`input-field${errors[key] ? ' input-error' : ''}`}
              type="number"
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={key.replace(/([A-Z])/g, ' $1')}
              min={key === 'months' ? 12 : 0}
              max={key === 'months' ? 36 : undefined}
            />
            {errors[key] && <span className="error-text">{errors[key]}</span>}
          </div>
        )
      ))}
      <button
        className="calculate-button"
        onClick={() => {
          onCalculate();
          setIsButtonDisabled(true);
        }}
        disabled={isButtonDisabled}
      >
        Calculate Forecast
      </button>
    </form>
  );
};

export default InputForm;
