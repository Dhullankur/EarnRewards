import { useState } from "react";
import PropTypes from "prop-types";
import { DATE_RANGE_WARNING, PAGE_SIZE_OPTIONS } from "../util/constants";
import {
  isDateRangeWithinLimit,
} from "../util/dates";

function DashboardFilters({
  dateFrom,
  dateTo,
  pageSize,
  filteredCount,
  totalCount,
  onApplyDates,
  onClearDates,
  onPageSizeChange,
}) {
  const [draftDateFrom, setDraftDateFrom] = useState(dateFrom);
  const [draftDateTo, setDraftDateTo] = useState(dateTo);

  const hasPendingDateChanges =
    draftDateFrom !== dateFrom || draftDateTo !== dateTo;
  const bothDraftDatesSet = Boolean(draftDateFrom && draftDateTo);
  const hasValidDraftRange =
    !bothDraftDatesSet || isDateRangeWithinLimit(draftDateFrom, draftDateTo);
  const showDateRangeWarning = bothDraftDatesSet && !hasValidDraftRange;
  const canApplyDates = hasPendingDateChanges && !showDateRangeWarning;

  const handleApplyDates = () => {
    onApplyDates({
      dateFrom: draftDateFrom,
      dateTo: draftDateTo,
    });
  };

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
        Date from
        <input
          type="date"
          value={draftDateFrom}
          onChange={(event) => setDraftDateFrom(event.target.value)}
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-800"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
        Date to
        <input
          type="date"
          value={draftDateTo}
          onChange={(event) => setDraftDateTo(event.target.value)}
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-800"
        />
      </label>
      <button
        type="button"
        onClick={handleApplyDates}
        disabled={!canApplyDates}
        className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Apply
      </button>
      <button
        type="button"
        onClick={onClearDates}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Reset dates
      </button>
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
        Rows per page
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-800"
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs text-slate-500">
        Showing {filteredCount} of {totalCount} transactions
      </p>
      {showDateRangeWarning && (
        <p
          role="alert"
          className="w-full rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
        >
          {DATE_RANGE_WARNING}
        </p>
      )}
    </div>
  );
}

DashboardFilters.propTypes = {
  dateFrom: PropTypes.string.isRequired,
  dateTo: PropTypes.string.isRequired,
  pageSize: PropTypes.number.isRequired,
  filteredCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onApplyDates: PropTypes.func.isRequired,
  onClearDates: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
};

export default DashboardFilters;
