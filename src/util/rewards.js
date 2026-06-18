import { COLUMN_KEYS, CURRENCY_SORT_KEYS } from "./constants";
import {
  formatApiDate,
  formatMonthYear,
  getMonthKey,
  isDateWithinRange,
  parseToDayjs,
} from "./dates";

function toCents(amountInDollars) {
  return Math.round(amountInDollars * 100);
}

function fromCents(amountInCents) {
  return amountInCents / 100;
}

export function formatCurrency(value) {
  return `$${fromCents(toCents(value)).toFixed(2)}`;
}

export function calculateRewardPoints(amountInDollars) {
  const wholeDollars = Math.floor(amountInDollars);

  if (wholeDollars <= 50) {
    return 0;
  }

  if (wholeDollars <= 100) {
    return wholeDollars - 50;
  }

  return (wholeDollars - 100) * 2 + 50;
}

export function buildCustomerNameMap(transactions) {
  return transactions.reduce((nameMap, transaction) => {
    if (!nameMap.has(transaction.customerId)) {
      nameMap.set(transaction.customerId, transaction.name);
    }

    return nameMap;
  }, new Map());
}

export function buildMonthlyUsage(transactions, customerNames) {
  const monthlyMap = transactions.reduce((accumulator, transaction) => {
    const monthKey = getMonthKey(transaction.purchaseDate);
    const key = `${transaction.customerId}-${monthKey}`;
    const priceInCents = toCents(transaction.price);
    const existingEntry = accumulator.get(key);

    if (existingEntry) {
      const amountSpentInCents = existingEntry.amountSpentInCents + priceInCents;

      accumulator.set(key, {
        ...existingEntry,
        amountSpentInCents,
        rewardPoints:
          existingEntry.rewardPoints + calculateRewardPoints(transaction.price),
      });

      return accumulator;
    }

    accumulator.set(key, {
      id: `MU-${monthKey}-${transaction.customerId}`,
      customerId: transaction.customerId,
      name: customerNames.get(transaction.customerId),
      month: formatMonthYear(transaction.purchaseDate),
      monthKey,
      amountSpentInCents: priceInCents,
      rewardPoints: calculateRewardPoints(transaction.price),
    });

    return accumulator;
  }, new Map());

  return Array.from(monthlyMap.values()).map(
    ({ amountSpentInCents, ...row }) => ({
      ...row,
      amountSpent: fromCents(amountSpentInCents),
    }),
  );
}

export function buildTotalRewards(monthlyUsage, customerNames) {
  const totalMap = monthlyUsage.reduce((accumulator, row) => {
    const existingEntry = accumulator.get(row.customerId);
    const amountSpentInCents = toCents(row.amountSpent);

    if (existingEntry) {
      accumulator.set(row.customerId, {
        ...existingEntry,
        amountSpentInCents: existingEntry.amountSpentInCents + amountSpentInCents,
        rewardPoints: existingEntry.rewardPoints + row.rewardPoints,
      });

      return accumulator;
    }

    accumulator.set(row.customerId, {
      id: `TR-${row.customerId}`,
      customerId: row.customerId,
      name: customerNames.get(row.customerId),
      amountSpentInCents,
      rewardPoints: row.rewardPoints,
    });

    return accumulator;
  }, new Map());

  return Array.from(totalMap.values()).map(({ amountSpentInCents, ...row }) => ({
    ...row,
    amountSpent: fromCents(amountSpentInCents),
  }));
}

export function createRewardsReport(transactions) {
  const customerNames = buildCustomerNameMap(transactions);
  const monthlyUsage = buildMonthlyUsage(transactions, customerNames);
  const totalRewards = buildTotalRewards(monthlyUsage, customerNames);
  const transactionsTable = transactions.map((transaction) => ({
    id: transaction.transactionId,
    transactionId: transaction.transactionId,
    customerId: transaction.customerId,
    name: customerNames.get(transaction.customerId),
    purchaseDate: formatApiDate(transaction.purchaseDate),
    productPurchased: transaction.productPurchased,
    price: formatCurrency(transaction.price),
    rewardPoints: calculateRewardPoints(transaction.price),
  }));

  return {
    transactionsTable,
    monthlyRewardsTable: monthlyUsage.map((row) => ({
      ...row,
      amountSpent: formatCurrency(row.amountSpent),
    })),
    totalRewardsTable: totalRewards.map((row) => ({
      ...row,
      amountSpent: formatCurrency(row.amountSpent),
    })),
  };
}

export function filterTransactionsByDate(transactions, dateFrom, dateTo) {
  if (!dateFrom && !dateTo) {
    return transactions;
  }

  return transactions.filter((transaction) =>
    isDateWithinRange(transaction.purchaseDate, dateFrom, dateTo),
  );
}

function parseSortableValue(row, sortKey) {
  const value = row[sortKey];

  if (typeof value === "number") {
    return value;
  }

  if (CURRENCY_SORT_KEYS.includes(sortKey)) {
    return Number(String(value).replace(/[^0-9.-]/g, ""));
  }

  if (sortKey === COLUMN_KEYS.REWARD_POINTS) {
    return Number(value);
  }

  if (sortKey === COLUMN_KEYS.MONTH_KEY) {
    return String(value ?? "");
  }

  if (sortKey === COLUMN_KEYS.PURCHASE_DATE) {
    const parsedDate = parseToDayjs(value);
    return parsedDate ? parsedDate.valueOf() : String(value ?? "");
  }

  return String(value ?? "");
}

export function sortTableRows(rows, sortKey, sortDirection = 1) {
  if (!rows.length || !sortKey) {
    return rows;
  }

  const direction = sortDirection >= 0 ? 1 : -1;

  return [...rows].sort((firstRow, secondRow) => {
    const firstValue = parseSortableValue(firstRow, sortKey);
    const secondValue = parseSortableValue(secondRow, sortKey);

    if (typeof firstValue === "number" && typeof secondValue === "number") {
      return (firstValue - secondValue) * direction;
    }

    return String(firstValue).localeCompare(String(secondValue)) * direction;
  });
}

export function getPageRows(allRows, page, pageSize) {
  const safePage = Math.max(1, page);
  const startIndex = (safePage - 1) * pageSize;

  return {
    rows: allRows.slice(startIndex, startIndex + pageSize),
    totalPages: Math.max(1, Math.ceil(allRows.length / pageSize)),
    currentPage: safePage,
  };
}
