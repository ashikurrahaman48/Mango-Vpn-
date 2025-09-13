
import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Toggle: React.FC<{ label: string; description: string; }> = ({ label, description }) => {
    const [isOn, setIsOn] = useState(false);
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-700">
            <div>
                <p className="font-semibold text-gray-200">{label}</p>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
            <button 
                onClick={() => setIsOn(!isOn)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500
                    ${isOn ? 'bg-cyan-500' : 'bg-gray-600'}
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
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-cyan-400">Settings</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
            <Toggle 
                label="Auto Connect on Startup"
                description="Automatically connect to the last used server when the app starts."
            />
            <Toggle 
                label="Kill Switch"
                description="Block all internet traffic if the VPN connection drops unexpectedly."
            />
             <Toggle 
                label="Dark Mode"
                description="This is just for show, the app is already dark!"
            />
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;