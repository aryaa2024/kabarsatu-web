import React, { useEffect, useState } from 'react';
import { audioService } from '../services/audioService';
import { Volume2, Sparkles, UserCheck, Play } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadingOut, setFadingOut] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);

  useEffect(() => {
    // Attempt audio playback immediately on load
    const playIntro = async () => {
      try {
        const played = await audioService.playFuturisticChime();
        if (played) setSoundPlayed(true);
      } catch (err) {
        console.log('Intro sound waiting for user gesture:', err);
      }
    };
    playIntro();

    // Smooth exit sequence after 2.4s to let the intro voiceover finish
    const timer = setTimeout(() => {
      setFadingOut(true);
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 500); // 500ms fade transition
      return () => clearTimeout(exitTimer);
    }, 2400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleManualPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.playFuturisticChime();
    setSoundPlayed(true);
  };

  const handleScreenClick = () => {
    // If sound hasn't played due to browser autoplay restriction, play it on user click
    if (!soundPlayed) {
      audioService.playFuturisticChime();
    }
    onComplete();
  };

  return (
    <div
      onClick={handleScreenClick}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slateDark cursor-pointer transition-opacity duration-500 select-none ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background radial ambient glow */}
      <div className="absolute w-[450px] h-[450px] bg-electricBlue/15 rounded-full blur-[100px] pointer-events-none animate-pulse-subtle" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md mx-auto">
        {/* Logo Container with Subtle Pulse and Glow */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 via-electricBlue to-cyan-400 opacity-60 blur-lg group-hover:opacity-100 transition duration-700 animate-pulse-subtle"></div>
          
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
        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slateDark/70 border border-subtleGray/60 text-[11px] text-slateGray font-medium">
          <UserCheck className="w-3 h-3 text-electricBlue" />
          <span>Created by <strong className="text-offWhite">Muhammad Arya</strong></span>
        </div>

        {/* Subtle Tech Loading Bar */}
        <div className="w-44 h-1 bg-subtleGray rounded-full mt-6 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-electricBlue to-cyan-400 origin-left animate-[slideUp_2.4s_ease-in-out_infinite]" />
        </div>

        {/* Audio Status & Interactive Hint */}
        <div className="mt-7 flex items-center gap-3 text-xs text-slateGray/80">
          <button
            onClick={handleManualPlay}
            title="Dengarkan Suara Intro Buatan Anda"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-darkCharcoal border border-subtleGray hover:text-offWhite hover:border-electricBlue transition-all active:scale-95 shadow-sm"
          >
            <Volume2 className={`w-3.5 h-3.5 ${soundPlayed ? 'text-electricBlue animate-pulse' : 'text-slateGray'}`} />
            <span className="font-medium">{soundPlayed ? 'Suara Intro Diputar 🔊' : 'Putar Suara Intro ▶'}</span>
          </button>
          <span>•</span>
          <span className="hover:text-offWhite transition-colors">Klik untuk masuk</span>
        </div>
      </div>
    </div>
  );
};
