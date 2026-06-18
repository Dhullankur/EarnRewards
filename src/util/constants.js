export const PAGE_SIZE = 5;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const DEFAULT_PAGE = 1;
export const DEFAULT_SORT_DIRECTION = 1;

export const TABLE_IDS = {
  MONTHLY: "monthly",
  TOTAL: "total",
  TRANSACTIONS: "transactions",
};

export const REPORT_KEYS = {
  MONTHLY: "monthlyRewardsTable",
  TOTAL: "totalRewardsTable",
  TRANSACTIONS: "transactionsTable",
};

export const COLUMN_KEYS = {
  ID: "id",
  CUSTOMER_ID: "customerId",
  NAME: "name",
  MONTH: "month",
  MONTH_KEY: "monthKey",
  AMOUNT_SPENT: "amountSpent",
  PRICE: "price",
  REWARD_POINTS: "rewardPoints",
  PURCHASE_DATE: "purchaseDate",
  TRANSACTION_ID: "transactionId",
  PRODUCT_PURCHASED: "productPurchased",
};

export const TABLE_CONFIG = [
  {
    id: TABLE_IDS.MONTHLY,
    title: "User Monthly Rewards",
    reportKey: REPORT_KEYS.MONTHLY,
    defaultSortKey: COLUMN_KEYS.MONTH_KEY,
    hiddenColumns: [COLUMN_KEYS.ID, COLUMN_KEYS.MONTH_KEY],
    sortColumnMap: {
      [COLUMN_KEYS.MONTH]: COLUMN_KEYS.MONTH_KEY,
    },
  },
  {
    id: TABLE_IDS.TOTAL,
    title: "Total Rewards",
    reportKey: REPORT_KEYS.TOTAL,
    defaultSortKey: COLUMN_KEYS.CUSTOMER_ID,
    hiddenColumns: [COLUMN_KEYS.ID],
  },
  {
    id: TABLE_IDS.TRANSACTIONS,
    title: "Transactions",
    reportKey: REPORT_KEYS.TRANSACTIONS,
    defaultSortKey: COLUMN_KEYS.PURCHASE_DATE,
    hiddenColumns: [COLUMN_KEYS.ID],
  },
];

export const EMPTY_REWARDS_REPORT = TABLE_CONFIG.reduce(
  (report, { reportKey }) => ({
    ...report,
    [reportKey]: [],
  }),
  {},
);

export const DASHBOARD_HEADER = {
  title: "Retail Rewards Dashboard",
  description:
    "Monthly and total rewards are calculated from transaction data on the frontend.",
};

export const DATE_RANGE_WARNING =
  "Date range cannot exceed 90 days. Please select a shorter range.";

export const CURRENCY_SORT_KEYS = [
  COLUMN_KEYS.AMOUNT_SPENT,
  COLUMN_KEYS.PRICE,
];
