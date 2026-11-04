import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, X } from 'lucide-react';

interface PWAInstallButtonProps {
  onOpenAndroidGuide?: () => void;
  lang?: 'en' | 'bn';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenAndroidGuide, lang = 'en' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running in standalone mode on Android/iOS, suppress
  if (isInstalled) {
    return null;
  }

  // Chromium / Android flow
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-md transition-colors whitespace-nowrap shrink-0"
        title="Install Android App"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
        <span>{lang === 'en' ? 'Install App' : 'অ্যাপ ইনস্টল'}</span>
      </button>
    );
  }

  // If mobile iOS Safari
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors whitespace-nowrap shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5 text-slate-600" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Install on iPhone / iPad</h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                1. Tap the <strong>Share</strong> button in Safari toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-md bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback button to open Android modal guide
  return (
    <button
      type="button"
      onClick={onOpenAndroidGuide}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-md transition-colors whitespace-nowrap shrink-0"
      title="Android App & APK"
    >
      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
      <span>{lang === 'en' ? 'Android APK' : 'অ্যান্ড্রয়েড APK'}</span>
    </button>
  );
};
