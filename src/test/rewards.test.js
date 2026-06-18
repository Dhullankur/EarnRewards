import { describe, expect, it } from "vitest";
import { mockTransactions } from "./fixtures/transactions";
import { REPORT_KEYS } from "../util/constants";
import {
  buildCustomerNameMap,
  buildMonthlyUsage,
  buildTotalRewards,
  calculateRewardPoints,
  createRewardsReport,
  filterTransactionsByDate,
  formatCurrency,
  getPageRows,
  sortTableRows,
} from "../util/rewards";

describe("formatCurrency", () => {
  it("formats amounts with a dollar symbol only", () => {
    expect(formatCurrency(124.99)).toBe("$124.99");
    expect(formatCurrency(0)).toBe("$0.00");
    expect(formatCurrency(124.99)).not.toMatch(/^US/);
  });
});

describe("calculateRewardPoints", () => {
  it("returns 0 for purchases up to 50 dollars", () => {
    expect(calculateRewardPoints(50)).toBe(0);
    expect(calculateRewardPoints(45.99)).toBe(0);
  });

  it("calculates points between 50 and 100 dollars", () => {
    expect(calculateRewardPoints(75)).toBe(25);
    expect(calculateRewardPoints(100)).toBe(50);
  });

  it("calculates points over 100 dollars", () => {
    expect(calculateRewardPoints(120)).toBe(90);
  });
});

describe("buildCustomerNameMap", () => {
  it("keeps one name per customer id", () => {
    const nameMap = buildCustomerNameMap(mockTransactions);

    expect(nameMap.get("C-101")).toBe("Jane Doe");
    expect(nameMap.get("C-102")).toBe("Adam Smith");
  });
});

describe("createRewardsReport", () => {
  it("builds monthly and total tables for all months in the filtered range", () => {
    const report = createRewardsReport(mockTransactions);

    expect(report[REPORT_KEYS.TRANSACTIONS]).toHaveLength(8);
    expect(report[REPORT_KEYS.MONTHLY]).toHaveLength(5);
    expect(report[REPORT_KEYS.TOTAL]).toHaveLength(3);

    expect(
      report[REPORT_KEYS.MONTHLY].find(
        (row) => row.customerId === "C-101" && row.month === "April 2026",
      ),
    ).toEqual(
      expect.objectContaining({
        amountSpent: "$165.99",
        rewardPoints: 90,
      }),
    );

    expect(
      report[REPORT_KEYS.TOTAL].find((row) => row.customerId === "C-101"),
    ).toEqual(
      expect.objectContaining({
        customerId: "C-101",
        name: "Jane Doe",
        amountSpent: "$245.99",
        rewardPoints: 120,
      }),
    );
  });

  it("sums reward points per transaction within a month", () => {
    const transactions = [
      {
        transactionId: "T-2026-0025",
        customerId: "C-101",
        name: "John Carter",
        purchaseDate: "2026-06-02",
        productPurchased: "Wireless Earbuds",
        price: 80,
      },
      {
        transactionId: "T-2026-0026",
        customerId: "C-101",
        name: "John Carter",
        purchaseDate: "2026-06-07",
        productPurchased: "Cycling Helmet",
        price: 89.99,
      },
    ];

    const report = createRewardsReport(transactions);
    const juneRow = report[REPORT_KEYS.MONTHLY].find(
      (row) => row.customerId === "C-101" && row.month === "June 2026",
    );

    expect(juneRow).toEqual(
      expect.objectContaining({
        amountSpent: "$169.99",
        rewardPoints: 69,
      }),
    );

    expect(
      report[REPORT_KEYS.TOTAL].find((row) => row.customerId === "C-101"),
    ).toEqual(
      expect.objectContaining({
        rewardPoints: 69,
      }),
    );
  });

  it("avoids floating point drift when combining monthly spend", () => {
    const transactions = [
      {
        transactionId: "T1",
        customerId: "C-101",
        name: "John Carter",
        purchaseDate: "2026-06-02",
        productPurchased: "A",
        price: 59.99,
      },
      {
        transactionId: "T2",
        customerId: "C-101",
        name: "John Carter",
        purchaseDate: "2026-06-03",
        productPurchased: "B",
        price: 65,
      },
    ];
    const customerNames = buildCustomerNameMap(transactions);
    const monthlyUsage = buildMonthlyUsage(transactions, customerNames);

    expect(monthlyUsage[0].amountSpent).toBe(124.99);
    expect(createRewardsReport(transactions)[REPORT_KEYS.MONTHLY][0].amountSpent).toBe(
      "$124.99",
    );
  });
});

describe("buildMonthlyUsage", () => {
  it("assigns stable ids and month/year fields to monthly rows", () => {
    const transactions = [
      {
        customerId: "C-101",
        name: "Jane",
        purchaseDate: "2026-04-20",
        price: 80,
      },
    ];
    const customerNames = buildCustomerNameMap(transactions);
    const monthlyUsage = buildMonthlyUsage(transactions, customerNames);

    expect(monthlyUsage[0].id).toBe("MU-2026-04-C-101");
    expect(monthlyUsage[0].month).toBe("April 2026");
  });
});

describe("buildTotalRewards", () => {
  it("aggregates monthly rows by customer", () => {
    const customerNames = new Map([
      ["C-200", "Zara"],
      ["C-100", "Adam"],
    ]);
    const totals = buildTotalRewards(
      [
        {
          customerId: "C-200",
          name: "Zara",
          amountSpent: 60,
          rewardPoints: 10,
        },
        {
          customerId: "C-100",
          name: "Adam",
          amountSpent: 60,
          rewardPoints: 10,
        },
      ],
      customerNames,
    );

    expect(totals.map((row) => row.customerId)).toEqual(["C-200", "C-100"]);
    expect(totals[0].name).toBe("Zara");
  });
});

describe("filterTransactionsByDate", () => {
  it("filters transactions by ISO date range", () => {
    const filtered = filterTransactionsByDate(
      mockTransactions,
      "2026-05-01",
      "2026-05-31",
    );

    expect(filtered).toHaveLength(3);
    expect(
      filtered.every((transaction) => transaction.purchaseDate.startsWith("2026-05")),
    ).toBe(true);
  });
});

describe("sortTableRows", () => {
  it("sorts numeric reward points descending", () => {
    const sorted = sortTableRows(
      [
        { customerId: "A", rewardPoints: 10 },
        { customerId: "B", rewardPoints: 50 },
      ],
      "rewardPoints",
      -1,
    );

    expect(sorted[0].customerId).toBe("B");
  });

  it("sorts formatted currency values numerically", () => {
    const sorted = sortTableRows(
      [
        { customerId: "A", amountSpent: "$120.00" },
        { customerId: "B", amountSpent: "$45.99" },
      ],
      "amountSpent",
      1,
    );

    expect(sorted[0].customerId).toBe("B");
  });

  it("sorts api-formatted dates chronologically", () => {
    const sorted = sortTableRows(
      [
        { customerId: "A", purchaseDate: "Jun-18-2026" },
        { customerId: "B", purchaseDate: "Jun-01-2026" },
      ],
      "purchaseDate",
      1,
    );

    expect(sorted[0].customerId).toBe("B");
  });
});

describe("getPageRows", () => {
  it("returns one page of rows", () => {
    const rows = Array.from({ length: 10 }, (_, index) => ({ id: index + 1 }));
    const result = getPageRows(rows, 2, 5);

    expect(result.rows).toHaveLength(5);
    expect(result.rows[0].id).toBe(6);
    expect(result.currentPage).toBe(2);
    expect(result.totalPages).toBe(2);
  });
});
