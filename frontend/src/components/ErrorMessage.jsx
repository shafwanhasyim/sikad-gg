const ErrorMessage = ({ message, onRetry, title = "Error" }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
      <strong className="font-bold">{title}: </strong>
      <span className="block sm:inline">{message}</span>
      {onRetry && (
        <div className="mt-2">
          <button
            onClick={onRetry}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
