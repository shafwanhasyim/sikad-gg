import { useState, useEffect } from 'react';

const SuccessMessage = ({ message, onDismiss, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong className="font-bold">Success: </strong>
      <span className="block sm:inline">{message}</span>
      <button
        onClick={handleDismiss}
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
        aria-label="Close"
      >
        <span className="text-2xl">&times;</span>
      </button>
    </div>
  );
};

export default SuccessMessage;
