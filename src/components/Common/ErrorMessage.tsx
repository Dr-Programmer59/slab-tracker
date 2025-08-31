import React from 'react';

interface ErrorMessageProps {
  error: string | null;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-red-500 text-lg">⚠️</span>
        <div className="flex-1">
          <span className="text-red-800 text-sm">{error}</span>
          {onRetry && (
            <button 
              className="ml-4 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors" 
              onClick={onRetry}
              type="button"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;