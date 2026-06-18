import {
  DEFAULT_PAGE,
  DEFAULT_SORT_DIRECTION,
  PAGE_SIZE,
  TABLE_CONFIG,
} from "./util/constants";
import { getDefaultDateRange } from "./util/dates";

const createTableState = (sortKey) => ({
  page: DEFAULT_PAGE,
  sortKey,
  sortDirection: DEFAULT_SORT_DIRECTION,
});

const createInitialTableState = () =>
  TABLE_CONFIG.reduce(
    (tables, { id, defaultSortKey }) => ({
      ...tables,
      [id]: createTableState(defaultSortKey),
    }),
    {},
  );

const defaultDateRange = getDefaultDateRange();

export const initialDashboardState = {
  status: "loading",
  errorMessage: "",
  transactions: [],
  filters: {
    dateFrom: defaultDateRange.dateFrom,
    dateTo: defaultDateRange.dateTo,
    pageSize: PAGE_SIZE,
  },
  tables: createInitialTableState(),
};

function resetTablePages(tables) {
  return Object.fromEntries(
    Object.entries(tables).map(([tableKey, tableState]) => [
      tableKey,
      { ...tableState, page: DEFAULT_PAGE },
    ]),
  );
}

function normalizeDateRange(dateFrom, dateTo) {
  if (dateFrom && dateTo && dateTo < dateFrom) {
    return { dateFrom, dateTo: "" };
  }

  return { dateFrom, dateTo };
}

function createSuccessState(transactions) {
  const freshDateRange = getDefaultDateRange();

  return {
    ...initialDashboardState,
    status: "success",
    transactions,
    filters: {
      ...initialDashboardState.filters,
      dateFrom: freshDateRange.dateFrom,
      dateTo: freshDateRange.dateTo,
    },
    tables: createInitialTableState(),
  };
}

export function dashboardReducer(state, action) {
  switch (action.type) {
    case "LOAD_START":
      return {
        ...state,
        status: "loading",
        errorMessage: "",
      };

    case "LOAD_SUCCESS":
      return createSuccessState(action.transactions);

    case "LOAD_ERROR":
      return {
        ...state,
        status: "error",
        errorMessage: action.errorMessage,
      };

    case "APPLY_DATE_FILTER": {
      const { dateFrom, dateTo } = normalizeDateRange(
        action.dateFrom,
        action.dateTo,
      );

      return {
        ...state,
        filters: {
          ...state.filters,
          dateFrom,
          dateTo,
        },
        tables: resetTablePages(state.tables),
      };
    }

    case "CLEAR_DATES": {
      const resetDateRange = getDefaultDateRange();

      return {
        ...state,
        filters: {
          ...state.filters,
          dateFrom: resetDateRange.dateFrom,
          dateTo: resetDateRange.dateTo,
        },
        tables: resetTablePages(state.tables),
      };
    }

    case "SET_PAGE_SIZE":
      return {
        ...state,
        filters: { ...state.filters, pageSize: action.value },
        tables: resetTablePages(state.tables),
      };

    case "SET_TABLE_PAGE":
      return {
        ...state,
        tables: {
          ...state.tables,
          [action.table]: {
            ...state.tables[action.table],
            page: action.page,
          },
        },
      };

    case "SET_TABLE_SORT_KEY":
      return {
        ...state,
        tables: {
          ...state.tables,
          [action.table]: {
            ...state.tables[action.table],
            sortKey: action.sortKey,
          },
        },
      };

    case "SET_TABLE_SORT_DIRECTION":
      return {
        ...state,
        tables: {
          ...state.tables,
          [action.table]: {
            ...state.tables[action.table],
            sortDirection: action.direction,
          },
        },
      };

    default:
      return state;
  }
}
