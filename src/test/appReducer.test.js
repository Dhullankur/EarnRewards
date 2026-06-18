import { describe, expect, it } from "vitest";
import {
  dashboardReducer,
  initialDashboardState,
} from "../appReducer";
import { TABLE_IDS } from "../util/constants";
import { getDefaultDateRange } from "../util/dates";

describe("dashboardReducer", () => {
  it("resets filters and table pages after a successful load", () => {
    const dirtyState = {
      ...initialDashboardState,
      status: "success",
      filters: {
        dateFrom: "2026-05-01",
        dateTo: "2026-05-31",
        pageSize: 20,
      },
      tables: {
        ...initialDashboardState.tables,
        [TABLE_IDS.MONTHLY]: {
          ...initialDashboardState.tables[TABLE_IDS.MONTHLY],
          page: 3,
        },
      },
    };

    const nextState = dashboardReducer(dirtyState, {
      type: "LOAD_SUCCESS",
      transactions: [{ transactionId: "T1" }],
    });

    expect(nextState.transactions).toHaveLength(1);
    expect(nextState.filters.dateFrom).toBe(getDefaultDateRange().dateFrom);
    expect(nextState.filters.dateTo).toBe(getDefaultDateRange().dateTo);
    expect(nextState.tables[TABLE_IDS.MONTHLY].page).toBe(1);
  });

  it("resets table pages when filters change", () => {
    const currentState = {
      ...initialDashboardState,
      status: "success",
      tables: {
        ...initialDashboardState.tables,
        [TABLE_IDS.TRANSACTIONS]: {
          ...initialDashboardState.tables[TABLE_IDS.TRANSACTIONS],
          page: 4,
        },
      },
    };

    const nextState = dashboardReducer(currentState, {
      type: "SET_PAGE_SIZE",
      value: 10,
    });

    expect(nextState.filters.pageSize).toBe(10);
    expect(nextState.tables[TABLE_IDS.TRANSACTIONS].page).toBe(1);
  });

  it("applies date filters and resets table pages", () => {
    const currentState = {
      ...initialDashboardState,
      status: "success",
      tables: {
        ...initialDashboardState.tables,
        [TABLE_IDS.TRANSACTIONS]: {
          ...initialDashboardState.tables[TABLE_IDS.TRANSACTIONS],
          page: 4,
        },
      },
    };

    const nextState = dashboardReducer(currentState, {
      type: "APPLY_DATE_FILTER",
      dateFrom: "2026-05-01",
      dateTo: "2026-05-31",
    });

    expect(nextState.filters.dateFrom).toBe("2026-05-01");
    expect(nextState.filters.dateTo).toBe("2026-05-31");
    expect(nextState.tables[TABLE_IDS.TRANSACTIONS].page).toBe(1);
  });

  it("restores the default 90-day range when dates are cleared", () => {
    const currentState = {
      ...initialDashboardState,
      status: "success",
      filters: {
        ...initialDashboardState.filters,
        dateFrom: "2026-01-01",
        dateTo: "2026-06-01",
      },
    };

    const nextState = dashboardReducer(currentState, { type: "CLEAR_DATES" });

    expect(nextState.filters.dateFrom).toBe(getDefaultDateRange().dateFrom);
    expect(nextState.filters.dateTo).toBe(getDefaultDateRange().dateTo);
  });
});
