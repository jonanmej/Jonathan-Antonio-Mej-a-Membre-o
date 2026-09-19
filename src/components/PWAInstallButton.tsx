import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition"
      >
        <Download className="w-4 h-4" />
        Instalar App
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Download className="w-4 h-4" />
          Instalar en iOS
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 relative">
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-2"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Instalar en iPhone / iPad</h3>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <p className="flex items-start gap-3">
                  <span className="flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 font-bold w-6 h-6 rounded-full shrink-0">1</span>
                  <span>Toca el botón <strong>Compartir</strong> en la barra inferior de Safari. (El ícono cuadrado con la flecha hacia arriba)</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 font-bold w-6 h-6 rounded-full shrink-0">2</span>
                  <span>Desplázate hacia abajo y selecciona <strong>Agregar a inicio</strong> o <strong>Add to Home Screen</strong>.</span>
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
