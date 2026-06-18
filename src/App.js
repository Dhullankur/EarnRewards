import { useCallback, useEffect, useMemo, useReducer } from "react";
import TableSection from "./components/TableSection";
import DashboardFilters from "./components/DashboardFilters";
import ErrorState from "./components/ErrorState";
import LoadingState from "./components/LoadingState";
import { fetchTransactions } from "./api/api";
import { normalizeTransactions } from "./util/transactions";
import {
  dashboardReducer,
  initialDashboardState,
} from "./appReducer";
import {
  DASHBOARD_HEADER,
  EMPTY_REWARDS_REPORT,
  TABLE_CONFIG,
} from "./util/constants";
import {
  createRewardsReport,
  filterTransactionsByDate,
} from "./util/rewards";
import { logger } from "./util/logger";

function App() {
  const [state, dispatch] = useReducer(
    dashboardReducer,
    initialDashboardState,
  );

  const loadTransactions = useCallback(async () => {
    dispatch({ type: "LOAD_START" });

    try {
      const rawTransactions = await fetchTransactions();
      const transactions = normalizeTransactions(rawTransactions);
      dispatch({ type: "LOAD_SUCCESS", transactions });
    } catch (error) {
      logger.error("Data loading failed", { message: error.message });
      dispatch({
        type: "LOAD_ERROR",
        errorMessage: error.message || "Failed to load data.",
      });
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    if (state.status !== "success") {
      return [];
    }

    return filterTransactionsByDate(
      state.transactions,
      state.filters.dateFrom,
      state.filters.dateTo,
    );
  }, [state.status, state.transactions, state.filters.dateFrom, state.filters.dateTo]);

  const report = useMemo(() => {
    if (state.status !== "success") {
      return EMPTY_REWARDS_REPORT;
    }

    return createRewardsReport(filteredTransactions);
  }, [state.status, filteredTransactions]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          {DASHBOARD_HEADER.title}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{DASHBOARD_HEADER.description}</p>
      </header>

      {state.status === "loading" && <LoadingState />}

      {state.status === "error" && (
        <ErrorState
          message={state.errorMessage}
          onRetry={loadTransactions}
        />
      )}

      {state.status === "success" && (
        <div className="space-y-4">
          <DashboardFilters
            key={`${state.filters.dateFrom}-${state.filters.dateTo}`}
            dateFrom={state.filters.dateFrom}
            dateTo={state.filters.dateTo}
            pageSize={state.filters.pageSize}
            filteredCount={filteredTransactions.length}
            totalCount={state.transactions.length}
            onApplyDates={({ dateFrom, dateTo }) =>
              dispatch({ type: "APPLY_DATE_FILTER", dateFrom, dateTo })
            }
            onClearDates={() => dispatch({ type: "CLEAR_DATES" })}
            onPageSizeChange={(value) =>
              dispatch({ type: "SET_PAGE_SIZE", value })
            }
          />

          {TABLE_CONFIG.map(({ id, title, reportKey, hiddenColumns, sortColumnMap }) => {
            const tableState = state.tables[id];

            return (
              <TableSection
                key={id}
                title={title}
                rows={report[reportKey]}
                page={tableState.page}
                onPageChange={(page) =>
                  dispatch({ type: "SET_TABLE_PAGE", table: id, page })
                }
                pageSize={state.filters.pageSize}
                sortKey={tableState.sortKey}
                sortDirection={tableState.sortDirection}
                onSortKeyChange={(sortKey) =>
                  dispatch({ type: "SET_TABLE_SORT_KEY", table: id, sortKey })
                }
                onSortDirectionChange={(direction) =>
                  dispatch({
                    type: "SET_TABLE_SORT_DIRECTION",
                    table: id,
                    direction,
                  })
                }
                hiddenColumns={hiddenColumns}
                sortColumnMap={sortColumnMap}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}

export default App;
