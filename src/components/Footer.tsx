import React from 'react';
import { Sparkles, Globe, Shield, Zap, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slateDark border-t border-subtleGray mt-20 relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-electricBlue/10 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-subtleGray/60">
          {/* Brand & Slogan */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-darkCharcoal border border-subtleGray flex items-center justify-center p-1">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black text-offWhite tracking-tight">
                Kabar<span className="text-electricBlue">Satu</span>
              </span>
            </div>
            <p className="text-sm text-slateGray font-medium">
              "Semua Kabar, Satu Tujuan"
            </p>
            <p className="text-xs text-slateGray/80 mt-1 max-w-sm">
              Unified Feed Aggregator portal berita nasional terpercaya dan media sosial publik dalam satu genggaman modern.
            </p>
          </div>

          {/* Badges / Tech Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-darkCharcoal border border-subtleGray text-xs text-slateGray">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Ultra-Fast PWA</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-darkCharcoal border border-subtleGray text-xs text-slateGray">
              <Globe className="w-3.5 h-3.5 text-electricBlue" />
              <span>Cloudflare Pages</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-darkCharcoal border border-subtleGray text-xs text-slateGray">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Guest-First Privacy</span>
            </div>
            <button
              onClick={scrollToTop}
              title="Kembali ke Atas"
              className="p-2 rounded-xl bg-darkCharcoal border border-subtleGray text-slateGray hover:text-offWhite hover:border-electricBlue transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Copyright Line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slateGray gap-3">
          <p className="font-medium text-center sm:text-left">
            © 2026 KabarSatu. Created by <span className="text-offWhite font-semibold">Muhammad Arya</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slateGray/80">
            <span>Kompas • Detik • Antara • CNN • Tempo • YouTube • Medsos</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
