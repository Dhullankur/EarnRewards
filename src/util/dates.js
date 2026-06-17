import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const API_DATE_FORMAT = "MMM-DD-YYYY";
export const ISO_DATE_FORMAT = "YYYY-MM-DD";

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
