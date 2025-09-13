
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM10.24 13.53a.75.75 0 001.06 1.06l.72-.72.72.72a.75.75 0 101.06-1.06l-.72-.72.72-.72a.75.75 0 10-1.06-1.06l-.72.72-.72-.72a.75.75 0 00-1.06 1.06l.72.72-.72.72z" clipRule="evenodd" />
    </svg>
);


const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
        className="fixed bottom-6 right-6 z-50 flex items-start w-full max-w-sm p-4 space-x-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-error)]/50 rounded-lg shadow-xl"
        role="alert"
    >
        <ErrorIcon className="w-6 h-6 text-[var(--color-error)] flex-shrink-0 mt-0.5" />
        <div className="flex-grow text-sm font-normal text-[var(--color-text-secondary)]">{message}</div>
        <button 
            onClick={onClose} 
            className="p-1 -m-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]/50 rounded-full"
            aria-label="Close"
        >
            <CloseIcon className="w-5 h-5" />
        </button>
    </div>
  );
};

export default Toast;
