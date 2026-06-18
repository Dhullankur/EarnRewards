import PropTypes from "prop-types";

function ErrorFallback({ onReset }) {
  return (
    <div className="mx-auto mt-10 max-w-xl rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-red-700">
        Something went wrong
      </h2>
      <p className="mt-2 text-sm text-red-700">
        An unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Reload app
      </button>
    </div>
  );
}

ErrorFallback.propTypes = {
  onReset: PropTypes.func.isRequired,
};

export default ErrorFallback;
