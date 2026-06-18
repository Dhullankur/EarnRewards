import { describe, expect, it } from "vitest";
import {
  centsToDollars,
  formatCustomerName,
  normalizeTransaction,
  normalizeTransactions,
} from "../util/transactions";

describe("centsToDollars", () => {
  it("converts integer cents to dollars", () => {
    expect(centsToDollars(8000)).toBe(80);
    expect(centsToDollars(4599)).toBe(45.99);
    expect(centsToDollars(10020)).toBe(100.2);
  });
});

describe("formatCustomerName", () => {
  it("combines first and last name", () => {
    expect(formatCustomerName("Jane", "Doe")).toBe("Jane Doe");
  });
});

describe("normalizeTransaction", () => {
  it("converts API fields into normalized transaction shape", () => {
    expect(
      normalizeTransaction({
        transactionId: "T-1",
        customerId: "C-101",
        firstName: "Jane",
        lastName: "Doe",
        purchaseDate: "Jun-02-2026",
        productPurchased: "Yoga Mat",
        price: 4599,
      }),
    ).toEqual({
      transactionId: "T-1",
      customerId: "C-101",
      firstName: "Jane",
      lastName: "Doe",
      purchaseDate: "2026-06-02",
      productPurchased: "Yoga Mat",
      price: 45.99,
      name: "Jane Doe",
    });
  });
});

describe("normalizeTransactions", () => {
  it("normalizes every transaction in a list", () => {
    const normalized = normalizeTransactions([
      {
        transactionId: "T-1",
        customerId: "C-101",
        firstName: "Jane",
        lastName: "Doe",
        purchaseDate: "Jun-02-2026",
        productPurchased: "Yoga Mat",
        price: 4599,
      },
    ]);

    expect(normalized).toHaveLength(1);
    expect(normalized[0].name).toBe("Jane Doe");
    expect(normalized[0].purchaseDate).toBe("2026-06-02");
  });
});
