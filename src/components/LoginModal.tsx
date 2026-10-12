import React, { useState } from 'react';
import { UserProfile } from '../types/feed';
import { X, Mail, ShieldCheck, CheckCircle2, ArrowRight, LogOut, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (profile: UserProfile) => void;
  onLogout: () => void;
  onNotify?: (message: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onNotify
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    const mockGoogleUser: UserProfile = {
      name: 'Pembaca KabarSatu',
      email: 'user.kabarsatu@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      isLoggedIn: true,
      provider: 'google'
    };
    onLogin(mockGoogleUser);
    onNotify?.('Berhasil masuk dengan akun Google!');
    onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      const mockEmailUser: UserProfile = {
        name: name.trim() || email.split('@')[0],
        email: email.trim(),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        isLoggedIn: true,
        provider: 'email'
      };
      onLogin(mockEmailUser);
      onNotify?.(`Selamat datang, ${mockEmailUser.name}!`);
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slateDark/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-darkCharcoal border border-subtleGray rounded-2xl p-6 sm:p-8 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slateGray hover:text-offWhite hover:bg-slateDark transition-colors"
          title="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser && currentUser.isLoggedIn ? (
          // Logged In State View
          <div className="text-center py-4">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl border-2 border-electricBlue overflow-hidden shadow-lg">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-xl font-bold text-offWhite">{currentUser.name}</h3>
            <p className="text-xs text-slateGray mt-1">{currentUser.email}</p>

            <div className="mt-4 p-3 rounded-xl bg-slateDark border border-subtleGray text-xs text-slateGray">
              <span className="text-emerald-400 font-semibold">● Sesi Terhubung:</span> Preferensi baca dan bookmark Anda aktif tersinkronisasi di peramban ini.
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-electricBlue hover:bg-electricBlue-dark text-white text-sm font-semibold transition-all shadow-md shadow-electricBlue/20"
              >
                Lanjut Membaca Feed
              </button>
              <button
                onClick={() => {
                  onLogout();
                  onNotify?.('Anda telah keluar dari akun.');
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-slateDark hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 border border-rose-900/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun (Logout)</span>
              </button>
            </div>
          </div>
        ) : (
          // Guest State / Login Options
          <div>
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-electricBlue/10 border border-electricBlue/30 flex items-center justify-center text-electricBlue">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-offWhite">
                Akun Kabar<span className="text-electricBlue">Satu</span>
              </h3>
              <p className="text-xs text-slateGray mt-1.5 leading-relaxed">
                Akses profil personalisasi dan simpan artikel favorit Anda.
              </p>
            </div>

            {/* Guest First Banner */}
            <div className="mb-6 p-3 rounded-xl bg-slateDark border border-subtleGray/80 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slateGray leading-normal">
                <span className="font-semibold text-offWhite">Mode Tamu Aktif:</span> Anda langsung dapat menikmati seluruh feed tanpa hambatan pendaftaran.
              </p>
            </div>

            {submitted ? (
              <div className="py-6 text-center text-emerald-400 flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
                <p className="text-sm font-semibold">Tautan Masuk Terverifikasi!</p>
                <p className="text-xs text-slateGray">Menyinkronkan sesi baca Anda...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-slateDark hover:bg-slateDark/80 border border-subtleGray text-offWhite text-sm font-semibold flex items-center justify-center gap-3 transition-colors hover:border-electricBlue/60 active:scale-95"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Masuk dengan Google</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-subtleGray" />
                  <span className="text-[11px] text-slateGray uppercase font-medium">Atau dengan Email</span>
                  <div className="flex-1 h-px bg-subtleGray" />
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slateGray">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Anda (opsional)"
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-slateDark border border-subtleGray text-offWhite text-sm placeholder-slateGray focus:outline-none focus:border-electricBlue"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slateGray">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-slateDark border border-subtleGray text-offWhite text-sm placeholder-slateGray focus:outline-none focus:border-electricBlue"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-electricBlue hover:bg-electricBlue-dark text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-electricBlue/25 active:scale-95"
                  >
                    <span>Masuk Instan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className="text-xs text-slateGray hover:text-offWhite underline transition-colors"
              >
                Tetap lanjut sebagai Tamu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
