
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Toggle: React.FC<{ label: string; description: string; }> = ({ label, description }) => {
    const [isOn, setIsOn] = useState(false);
    return (
        <div className="flex items-center justify-between py-4 border-b border-[var(--color-bg-tertiary)]">
            <div>
                <p className="font-semibold text-[var(--color-text-secondary)]">{label}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
            </div>
            <button 
                onClick={() => setIsOn(!isOn)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)] focus:ring-[var(--color-primary)]
                    ${isOn ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-bg-tertiary)]'}
                `}
            >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300
                    ${isOn ? 'translate-x-6' : 'translate-x-1'}
                `}/>
            </button>
        </div>
    );
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, availableThemes } = useTheme();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl w-full max-w-md border border-[var(--color-bg-tertiary)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-bg-tertiary)]">
          <h2 className="text-2xl font-bold text-[var(--color-accent)]">Settings</h2>
          <button 
            onClick={onClose} 
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableThemes.map((themeName) => (
                  <button
                    key={themeName}
                    onClick={() => setTheme(themeName)}
                    className={`w-full p-2 rounded-lg text-sm capitalize border-2 transition-colors ${
                      theme === themeName
                        ? 'border-[var(--color-primary)] bg-[color:var(--color-primary)/0.1] text-[var(--color-primary)] font-semibold'
                        : 'border-transparent bg-[var(--color-bg-tertiary)] hover:border-[var(--color-text-muted)]'
                    }`}
                  >
                    {themeName}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-[var(--color-bg-tertiary)]"></div>
            <Toggle 
                label="Auto Connect on Startup"
                description="Connect to the last server on launch."
            />
            <Toggle 
                label="Kill Switch"
                description="Block internet if the VPN disconnects."
            />
             <Toggle 
                label="Dark Mode"
                description="This is just for show, use themes!"
            />
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
