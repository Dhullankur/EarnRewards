import PropTypes from "prop-types";

export const tableRowPropType = PropTypes.shape({
  id: PropTypes.string,
  transactionId: PropTypes.string,
  customerId: PropTypes.string,
  name: PropTypes.string,
  month: PropTypes.string,
  monthKey: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  purchaseDate: PropTypes.string,
  productPurchased: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  amountSpent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rewardPoints: PropTypes.number,
});
