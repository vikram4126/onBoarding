import React, { useState, useEffect } from 'react';
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage';
import heroImg from '../assets/hero.png';
import welcomeData from '../data/welcome.json';

const WelcomePopup = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      const hasSeen = getStorage(STORAGE_KEYS.HAS_SEEN_WELCOME, false);
      if (!hasSeen) {
        setIsOpen(true);
      }
    }
  }, [profile]);

  const handleClose = () => {
    setStorage(STORAGE_KEYS.HAS_SEEN_WELCOME, true);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all">
        {/* Header Banner */}
        <div className="relative h-40 shrink-0 bg-primary-900">
          <img 
            src={heroImg} 
            alt="Welcome Banner" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
        </div>
        
        {/* Content Area - Scrollable */}
        <div className="px-8 pb-8 -mt-20 relative z-10 flex-1 overflow-y-auto custom-scrollbar">
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Director Profile Column */}
            <div className="flex flex-col items-center md:w-1/3 shrink-0 text-center">
              <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 mb-4">
                <img 
                  src={welcomeData.director.image} 
                  alt={welcomeData.director.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{welcomeData.director.name}</h3>
              <p className="text-sm text-primary-600 font-semibold mb-1">{welcomeData.director.role}</p>
              <p className="text-xs text-slate-500 mb-4">{welcomeData.director.department}</p>
            </div>

            {/* Letter Column */}
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                Welcome to the Team, {profile.fullName}! 🎉
              </h2>
              
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                {welcomeData.letter.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 shrink-0 flex justify-end">
          <button 
            onClick={handleClose}
            className="py-3 px-8 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 transform transition-all active:scale-95"
          >
            Start My Journey
          </button>
        </div>

      </div>
    </div>
  );
};

export default WelcomePopup;
