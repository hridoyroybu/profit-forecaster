import { calculateForecast } from './calculateForecast';

describe('calculateForecast', () => {
  it('calculates correct forecast for 2 months without toggles', () => {
    const input = {
      months: 2,
      startUsers: 100,
      growthRate: 10,
      churnRate: 0,
      revenuePerUser: 10,
      costPerUser: 5,
      fixedCost: 500,
      toggleRevenueBoost: false,
      toggleGrowthDrop: false
    };

    const result = calculateForecast(input);

    expect(result).toHaveLength(2);

    // Month 1
    expect(result[0].month).toBe(1);
    expect(result[0].users).toBe(110); // 10% growth
    expect(result[0].revenue).toBe("1100.00");
    expect(result[0].cost).toBe("1050.00");
    expect(result[0].profit).toBe("50.00");

    // Month 2
    expect(result[1].users).toBe(121); // 10% growth again
    expect(result[1].revenue).toBe("1210.00");
    expect(result[1].cost).toBe("1105.00");
    expect(result[1].profit).toBe("105.00");

    // Cumulative
    expect(result[1].cumulativeProfit).toBe("155.00");
  });

  it('applies churn rate correctly', () => {
    const input = {
      months: 1,
      startUsers: 100,
      growthRate: 10,
      churnRate: 10,
      revenuePerUser: 10,
      costPerUser: 5,
      fixedCost: 500,
      toggleRevenueBoost: false,
      toggleGrowthDrop: false
    };

    const result = calculateForecast(input);
    // 100 → +10% = 110 → -10% = 99
    expect(result[0].users).toBe(99);
    expect(result[0].revenue).toBe("990.00");
  });

  it('applies 10% revenue boost after month 6', () => {
    const input = {
      months: 7,
      startUsers: 100,
      growthRate: 0,
      churnRate: 0,
      revenuePerUser: 10,
      costPerUser: 5,
      fixedCost: 0,
      toggleRevenueBoost: true,
      toggleGrowthDrop: false
    };

    const result = calculateForecast(input);

    // Months 1-6 should use base revenuePerUser = £10
    for (let i = 0; i < 6; i++) {
      expect(result[i].revenue).toBe("1000.00");
    }

    // Month 7 should use boosted revenuePerUser = £11
    expect(result[6].revenue).toBe("1100.00");
  });

  it('applies 50% growth drop after month 12', () => {
    const input = {
      months: 13,
      startUsers: 100,
      growthRate: 10,        // initial growth
      churnRate: 0,
      revenuePerUser: 10,
      costPerUser: 5,
      fixedCost: 0,
      toggleRevenueBoost: false,
      toggleGrowthDrop: true
    };

    const result = calculateForecast(input);

    // Month 12: still normal 10% growth
    const usersAtMonth12 = result[11].users;

    // Month 13: should apply 5% growth (10% * 0.5)
    const usersAtMonth13 = result[12].users;

    // Manual calc:
    // usersAtMonth13 should be usersAtMonth12 * 1.05
    const expected = Math.round(usersAtMonth12 * 1.05);

    expect(usersAtMonth13).toBe(expected);
  });

  it('applies both revenue boost after month 6 and growth drop after month 12', () => {
    const input = {
      months: 13,
      startUsers: 100,
      growthRate: 10,
      churnRate: 0,
      revenuePerUser: 10,
      costPerUser: 5,
      fixedCost: 0,
      toggleRevenueBoost: true,
      toggleGrowthDrop: true
    };
  
    const result = calculateForecast(input);
  
    // Month 6: revenue should be based on normal rate (before boost)
    expect(Number(result[5].revenue)).toBeCloseTo(result[5].users * 10, 2);
  
    // Month 7: revenue should be boosted (after month 6)
    const usersAtMonth7 = result[6].users;
    expect(Number(result[6].revenue)).toBeCloseTo(usersAtMonth7 * 11, 2);
  
    // Month 13: growth rate should be halved to 5%
    const usersAtMonth12 = result[11].users;
    const expectedUsers = Math.round(usersAtMonth12 * 1.05);
    const usersAtMonth13 = result[12].users;
    expect(usersAtMonth13).toBeCloseTo(expectedUsers, 0);
  
    // Revenue in Month 13 should use boosted rate
    expect(Number(result[12].revenue)).toBeCloseTo(expectedUsers * 11, 2);
  });  

});