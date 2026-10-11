import React, { useState } from 'react';
import { X, Mail, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slateDark/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-darkCharcoal border border-subtleGray rounded-2xl p-6 sm:p-8 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slateGray hover:text-offWhite hover:bg-slateDark transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-electricBlue/10 border border-electricBlue/30 flex items-center justify-center text-electricBlue">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-offWhite">
            Akun Kabar<span className="text-electricBlue">Satu</span>
          </h3>
          <p className="text-xs text-slateGray mt-1.5 leading-relaxed">
            Sinkronkan bookmark dan preferensi baca Anda di seluruh perangkat.
          </p>
        </div>

        {/* Guest First Banner */}
        <div className="mb-6 p-3 rounded-xl bg-slateDark border border-subtleGray/80 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slateGray leading-normal">
            <span className="font-semibold text-offWhite">Mode Tamu Aktif:</span> Anda dapat langsung menikmati semua feed berita & fitur bookmark tanpa wajib mendaftar.
          </p>
        </div>

        {submitted ? (
          <div className="py-6 text-center text-emerald-400 flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 animate-bounce" />
            <p className="text-sm font-semibold">Tautan Verifikasi Terkirim!</p>
            <p className="text-xs text-slateGray">Silakan cek inbox email simulasi Anda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mock Google Login Button */}
            <button
              type="button"
              onClick={() => {
                setSubmitted(true);
                setTimeout(() => {
                  setSubmitted(false);
                  onClose();
                }, 1500);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slateDark hover:bg-slateDark/80 border border-subtleGray text-offWhite text-sm font-semibold flex items-center justify-center gap-3 transition-colors hover:border-electricBlue/60"
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
              <span>Lanjut dengan Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-subtleGray" />
              <span className="text-[11px] text-slateGray uppercase font-medium">Atau Email</span>
              <div className="flex-1 h-px bg-subtleGray" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
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
                className="w-full py-2.5 px-4 rounded-xl bg-electricBlue hover:bg-electricBlue-dark text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-electricBlue/25"
              >
                <span>Masuk Tanpa Kata Sandi</span>
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
            Lanjutkan membaca sebagai Tamu
          </button>
        </div>
      </div>
    </div>
  );
};
