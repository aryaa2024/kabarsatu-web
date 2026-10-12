import React, { useEffect, useState, useRef } from 'react';
import { audioService } from '../services/audioService';
import { Sparkles, UserCheck, Volume2, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadingOut, setFadingOut] = useState(false);
  const onCompleteRef = useRef(onComplete);

  // Keep ref up to date without triggering effects
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    // 1. Play intro audio
    audioService.playFuturisticChime().catch(() => {});

    // 2. Guaranteed auto-transition after 1.8 seconds
    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => {
        onCompleteRef.current();
      }, 350); // Fast 350ms fade
    }, 1800);

    // 3. Absolute safety timeout (2.4s max)
    const safetyTimer = setTimeout(() => {
      onCompleteRef.current();
    }, 2400);

    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  }, []); // Run ONLY once on mount!

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComplete();
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slateDark cursor-pointer transition-opacity duration-400 select-none ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background radial ambient glow */}
      <div className="absolute w-[450px] h-[450px] bg-electricBlue/15 rounded-full blur-[100px] pointer-events-none animate-pulse-subtle" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md mx-auto pointer-events-none">
        {/* Logo Container with Subtle Pulse and Glow */}
        <div className="relative mb-5 group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 via-electricBlue to-cyan-400 opacity-60 blur-lg transition duration-700 animate-pulse-subtle"></div>
          
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-darkCharcoal border border-subtleGray/70 flex items-center justify-center p-3 shadow-2xl overflow-hidden">
            <img
              src="/logo.png"
              alt="Logo KabarSatu"
              className="w-full h-full object-contain filter drop-shadow animate-fade-in"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallbackDiv = document.createElement('div');
                  fallbackDiv.className = 'text-electricBlue font-bold text-3xl tracking-tight';
                  fallbackDiv.innerText = 'K1';
                  parent.appendChild(fallbackDiv);
                }
              }}
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-offWhite tracking-tight mb-2 drop-shadow-md">
          Kabar<span className="text-electricBlue">Satu</span>
        </h1>

        {/* Slogan with Fade-In */}
        <p className="text-slateGray text-base sm:text-lg font-medium tracking-wide flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-electricBlue animate-pulse" />
          <span>Semua Kabar, Satu Tujuan</span>
          <Sparkles className="w-4 h-4 text-electricBlue animate-pulse" />
        </p>

        {/* Creator Identity / Branding in Splash Screen */}
        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slateDark/80 border border-subtleGray/60 text-[11px] text-slateGray font-medium">
          <UserCheck className="w-3 h-3 text-electricBlue" />
          <span>Created by <strong className="text-offWhite">Muhammad Arya</strong></span>
        </div>

        {/* Subtle Tech Loading Bar */}
        <div className="w-44 h-1 bg-subtleGray rounded-full mt-6 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-electricBlue to-cyan-400 origin-left animate-[slideUp_1.8s_ease-in-out]" />
        </div>

        {/* Status text */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slateGray/80">
          <Volume2 className="w-3.5 h-3.5 text-electricBlue animate-pulse" />
          <span>Memuat beranda & menyiapkan kabar...</span>
        </div>
      </div>

      {/* Skip Button (Bottom Right) */}
      <button
        onClick={handleSkip}
        className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-darkCharcoal/90 border border-subtleGray text-xs text-slateGray hover:text-offWhite hover:border-electricBlue transition-all shadow-md pointer-events-auto"
      >
        <span>Langsung Masuk</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
