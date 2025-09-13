
import React from 'react';
import { MangoVpnLogo } from './Header'; // Re-use the logo component

// SVG Icons for Windows-style controls
const MinimizeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M0 5 L10 5" />
    </svg>
);

const MaximizeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="0.5" y="0.5" width="9" height="9" />
    </svg>
);

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M0 0 L10 10 M10 0 L0 10" />
    </svg>
);


const TitleBar: React.FC = () => {
  return (
    <div
      // This data attribute is commonly used by frameworks like Tauri to make a region draggable
      data-tauri-drag-region
      className="h-10 bg-[var(--color-bg-secondary)] rounded-t-lg flex items-center justify-between px-3 select-none border-b border-[var(--color-bg-tertiary)]/50 flex-shrink-0"
    >
      <div className="flex items-center gap-2" data-tauri-drag-region>
        <MangoVpnLogo className="h-5 w-5" />
        <span className="text-sm font-semibold">Mango VPN Connect</span>
      </div>
      <div className="flex items-center">
        <button className="w-8 h-full flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)]/70 hover:text-[var(--color-text-primary)] transition-colors" aria-label="Minimize">
            <MinimizeIcon />
        </button>
        <button className="w-8 h-full flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)]/70 hover:text-[var(--color-text-primary)] transition-colors" aria-label="Maximize">
            <MaximizeIcon />
        </button>
        <button className="w-8 h-full flex items-center justify-center text-[var(--color-text-muted)] hover:bg-red-500 hover:text-white transition-colors" aria-label="Close">
            <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
