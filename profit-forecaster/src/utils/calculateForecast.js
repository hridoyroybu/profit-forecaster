export const calculateForecast = ({
    months,
    startUsers,
    growthRate,
    churnRate,
    revenuePerUser,
    costPerUser,
    fixedCost,
    toggleRevenueBoost,
    toggleGrowthDrop
  }) => {
    let results = [];
    let users = startUsers;
    let cumulativeRevenue = 0;
    let cumulativeCost = 0;
    let cumulativeProfit = 0;
  
    let revenuePU = revenuePerUser;
    let growth = growthRate;
  
    for (let month = 1; month <= months; month++) {
      if (toggleGrowthDrop && month > 12) growth = growthRate * 0.5;
      if (toggleRevenueBoost && month > 6) revenuePU = revenuePerUser * 1.1;
  
      users += users * (growth / 100);
      users -= users * (churnRate / 100);
      users = Math.max(0, Math.round(users));
  
      const revenue = users * revenuePU;
      const cost = users * costPerUser + fixedCost;
      const profit = revenue - cost;
  
      cumulativeRevenue += revenue;
      cumulativeCost += cost;
      cumulativeProfit += profit;
  
      results.push({
        month,
        users,
        revenue: revenue.toFixed(2),
        cost: cost.toFixed(2),
        profit: profit.toFixed(2),
        cumulativeRevenue: cumulativeRevenue.toFixed(2),
        cumulativeCost: cumulativeCost.toFixed(2),
        cumulativeProfit: cumulativeProfit.toFixed(2)
      });
    }
  
    return results;
  };
  
  