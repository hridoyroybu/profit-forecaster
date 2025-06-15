# 📊 CALCULATIONS.md  
### Revenue Forecaster Lite – Business Logic & Assumptions

---

## 🧠 Overview

This document outlines the core logic and mathematical assumptions behind the **Revenue Forecaster Lite** application. The forecasting engine models how a startup's **active user base**, **revenue**, **costs**, and **profit** evolve over a period of up to 36 months.

---

## 🧮 Core Formula Breakdown

For each forecasted month, we compute the following values:

### 1. 📈 **User Growth & Churn**

```js
users += users * (growthRate / 100);
users -= users * (churnRate / 100);
users = Math.max(0, Math.round(users));
```

- **Growth Rate**: % increase in users per month.
- **Churn Rate**: % of users lost per month.
- **Users** are rounded to the nearest integer.
- We ensure users never drop below 0.

---

### 2. 💰 **Monthly Revenue**

```js
revenue = users * revenuePerUser;
```

- **Revenue Per User** is the expected monthly income from one active user.
- If `toggleRevenueBoost` is enabled, revenue increases by **10% after month 6**:

```js
if (toggleRevenueBoost && month > 6)
  revenuePerUser = baseRevenuePerUser * 1.1;
```

---

### 3. 💸 **Monthly Cost**

```js
cost = users * costPerUser + fixedCost;
```

- **Cost Per User**: variable cost for supporting each user (e.g. infrastructure).
- **Fixed Cost**: recurring monthly overhead (e.g. salaries, rent).

---

### 4. 🧾 **Monthly Profit**

```js
profit = revenue - cost;
```

A simple calculation showing net monthly earnings.

---

### 5. 📊 **Cumulative Totals**

```js
cumulativeRevenue += revenue;
cumulativeCost += cost;
cumulativeProfit += profit;
```

These values track total revenue, cost, and profit over the entire forecast period.

---

## 🛠 Inputs Accepted

| Input                   | Type     | Description |
|------------------------|----------|-------------|
| `months`               | Integer  | Number of months to forecast (12–36) |
| `startUsers`           | Integer  | Initial user base |
| `growthRate`           | Float %  | Monthly user growth |
| `churnRate`            | Float %  | Monthly user churn |
| `revenuePerUser`       | Float £  | Monthly revenue per user |
| `costPerUser`          | Float £  | Monthly cost per user |
| `fixedCost`            | Float £  | Monthly fixed cost |
| `toggleRevenueBoost`   | Boolean  | Apply 10% revenue increase after month 6 |
| `toggleGrowthDrop`     | Boolean  | Reduce growth rate by 50% after month 12 |

---

## ⚙️ Toggle Features

| Feature                     | Behavior |
|----------------------------|----------|
| 🔄 **toggleRevenueBoost**  | Adds +10% to revenue per user **after month 6** |
| ⬇️ **toggleGrowthDrop**    | Cuts growth rate in half **after month 12** |

---

## 📤 Output Structure

Each month's result includes:

```json
{
  "month": 1,
  "users": 110,
  "revenue": "1100.00",
  "cost": "1050.00",
  "profit": "50.00",
  "cumulativeRevenue": "1100.00",
  "cumulativeCost": "1050.00",
  "cumulativeProfit": "50.00"
}
```

All currency values are formatted to two decimal places.

---

## 🧪 Assumptions

- All user metrics are rounded to the nearest integer.
- No negative revenue, profit, or users are allowed (floor at 0).
- Percentage inputs (growth/churn) are interpreted as decimals, i.e., 10 means 10%.
- Monthly changes are **applied sequentially**: growth first, then churn.
- The model assumes revenue and cost scale linearly with users.

---

## ✅ Example Forecast Logic

```js
if (toggleGrowthDrop && month > 12) {
  growthRate = originalGrowthRate * 0.5;
}
if (toggleRevenueBoost && month > 6) {
  revenuePerUser = originalRevenuePerUser * 1.1;
}
```

This allows the app to dynamically simulate business scenarios over time.

---

## ✨ Final Thoughts

This forecasting model is designed to be flexible, lightweight, and interpretable. It empowers startup founders to make data-informed decisions based on realistic growth projections.

---