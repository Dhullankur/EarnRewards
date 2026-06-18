import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const API_DATE_FORMAT = "MMM-DD-YYYY";
export const ISO_DATE_FORMAT = "YYYY-MM-DD";
export const MAX_DATE_RANGE_DAYS = 90;

export function parseToDayjs(dateValue) {
  if (!dateValue) {
    return null;
  }

  const isoDate = dayjs(dateValue, ISO_DATE_FORMAT, true);
  if (isoDate.isValid()) {
    return isoDate;
  }

  const apiDate = dayjs(dateValue, API_DATE_FORMAT, true);
  return apiDate.isValid() ? apiDate : null;
}

export function toIsoDate(dateValue) {
  const parsedDate = parseToDayjs(dateValue);
  return parsedDate ? parsedDate.format(ISO_DATE_FORMAT) : "";
}

export function formatApiDate(dateValue) {
  const parsedDate = parseToDayjs(dateValue);
  return parsedDate ? parsedDate.format(API_DATE_FORMAT) : String(dateValue ?? "");
}

export function getDefaultDateRange(referenceDate = dayjs()) {
  return {
    dateFrom: referenceDate
      .subtract(MAX_DATE_RANGE_DAYS - 1, "day")
      .format(ISO_DATE_FORMAT),
    dateTo: referenceDate.format(ISO_DATE_FORMAT),
  };
}

export function getDateRangeDayCount(dateFrom, dateTo) {
  const startDate = parseToDayjs(dateFrom);
  const endDate = parseToDayjs(dateTo);

  if (!startDate || !endDate || endDate.isBefore(startDate)) {
    return 0;
  }

  return endDate.diff(startDate, "day") + 1;
}

export function isDateRangeWithinLimit(dateFrom, dateTo, maxDays = MAX_DATE_RANGE_DAYS) {
  const dayCount = getDateRangeDayCount(dateFrom, dateTo);
  return dayCount > 0 && dayCount <= maxDays;
}

export function isDateWithinRange(purchaseDate, dateFrom, dateTo) {
  const purchase = parseToDayjs(purchaseDate);

  if (!purchase) {
    return false;
  }

  if (dateFrom) {
    const from = parseToDayjs(dateFrom);

    if (from && purchase.isBefore(from, "day")) {
      return false;
    }
  }

  if (dateTo) {
    const to = parseToDayjs(dateTo);

    if (to && purchase.isAfter(to, "day")) {
      return false;
    }
  }

  return true;
}

export function getMonthKey(dateValue) {
  const parsedDate = parseToDayjs(dateValue);
  return parsedDate ? parsedDate.format("YYYY-MM") : "";
}

export function formatMonthYear(dateValue) {
  const parsedDate = parseToDayjs(dateValue);
  return parsedDate ? parsedDate.format("MMMM YYYY") : "";
}
