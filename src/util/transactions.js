import { toIsoDate } from "./dates";

/**
 * Converts a cent amount to dollars.
 * @param {number} amountInCents
 * @returns {number} Amount in dollars.
 */
export function centsToDollars(amountInCents) {
  return amountInCents / 100;
}

export function formatCustomerName(firstName = "", lastName = "") {
  return `${firstName} ${lastName}`.trim();
}

export function normalizeTransaction(transaction) {
  return {
    ...transaction,
    price: centsToDollars(transaction.price),
    name: formatCustomerName(transaction.firstName, transaction.lastName),
    purchaseDate: toIsoDate(transaction.purchaseDate),
  };
}

export function normalizeTransactions(rawTransactions) {
  return rawTransactions.map(normalizeTransaction);
}
