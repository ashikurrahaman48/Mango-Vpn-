import React from 'react';

const MenuBar: React.FC = () => {
  return (
    <div className="h-8 bg-[var(--color-bg-secondary)]/80 backdrop-blur-sm flex items-center px-3 select-none border-b border-[var(--color-bg-tertiary)]/50 flex-shrink-0">
      <nav className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)]">
        <button className="px-3 py-1 rounded hover:bg-[var(--color-bg-tertiary)]/70 transition-colors">File</button>
        <button className="px-3 py-1 rounded hover:bg-[var(--color-bg-tertiary)]/70 transition-colors">Options</button>
        <button className="px-3 py-1 rounded hover:bg-[var(--color-bg-tertiary)]/70 transition-colors">View</button>
        <button className="px-3 py-1 rounded hover:bg-[var(--color-bg-tertiary)]/70 transition-colors">Help</button>
      </nav>
    </div>
  );
};

export default MenuBar;
