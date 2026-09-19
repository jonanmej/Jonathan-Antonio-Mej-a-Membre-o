import { useState } from 'react';
import { QrCode, X, ScanLine } from 'lucide-react';

interface QrScannerInputProps {
  label: string;
  placeholder?: string;
  theme?: 'emerald' | 'blue' | 'indigo' | 'rose' | 'slate';
  value?: string;
  onChange?: (val: string) => void;
}

export default function QrScannerInput({ label, placeholder, theme = 'emerald', value, onChange }: QrScannerInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const currentValue = value !== undefined ? value : internalValue;
  const handleChange = (val: string) => { if (onChange) onChange(val); else setInternalValue(val); };
  const [isScanning, setIsScanning] = useState(false);

  const handleSimulateScan = () => {
    // Simulamos un retraso para mostrar la UI del escáner y luego "leemos" un código
    setTimeout(() => {
      handleChange('SN-' + Math.random().toString(36).substring(2, 10).toUpperCase());
      setIsScanning(false);
    }, 2000);
  };

  const ringColors = {
    emerald: 'focus:ring-emerald-500/50',
    blue: 'focus:ring-blue-500/50',
    indigo: 'focus:ring-indigo-500/50',
    rose: 'focus:ring-rose-500/50',
    slate: 'focus:ring-slate-500/50',
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder || "Ingrese o escanee el N/S..."} 
          className={`flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 outline-none transition-all ${ringColors[theme]}`} 
        />
        <button 
          type="button"
          onClick={() => { setIsScanning(true); handleSimulateScan(); }}
          className="bg-slate-800 text-white p-2.5 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 px-4 shadow-sm"
        >
          <QrCode className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Escanear</span>
        </button>
      </div>

      {/* Interfaz Simulada del Escáner */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <button 
            type="button"
            onClick={() => setIsScanning(false)}
            className="absolute top-6 right-6 text-white p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-full max-w-sm aspect-square bg-black border-2 border-slate-800 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-2xl">
            {/* Viewfinder brackets */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl"></div>
            <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-emerald-500 rounded-br-xl"></div>
            
            {/* Scanning laser line (usando la clase de index.css) */}
            <div className="absolute left-8 right-8 h-[2px] bg-emerald-400 shadow-[0_0_15px_3px_rgba(52,211,153,0.8)] animate-scan z-10"></div>
            
            <ScanLine className="w-20 h-20 text-slate-700/50" />
            
            {/* Overlay semitransparente para simular enfoque */}
            <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay"></div>
          </div>
          
          <div className="mt-8 text-center space-y-2">
            <h3 className="text-white font-bold text-lg">Escáner Activo</h3>
            <p className="text-slate-400 text-sm animate-pulse">Apunte la cámara al código de barras o QR de la pieza...</p>
          </div>
        </div>
      )}
    </div>
  );
}
