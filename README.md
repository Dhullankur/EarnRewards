# Earn Rewards App

React + Vite app that calculates retailer reward points and shows three summary tables.
1. User Monthly Rewards
2. Total Rewards
3. Transactions

## Reward rules

- 2 points per dollar spent over $100
- 1 point per dollar between $50 and $100
- $50 or less earns 0 points

Example: $120 purchase → `(20 × 2) + 50 = 90` points. Amounts use whole dollars (`Math.floor`), so $100.20 counts as $100.

## Data

Mock API file: `public/transactions.json`  

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test:run`