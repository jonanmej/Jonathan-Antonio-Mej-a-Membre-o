import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, Undo, Edit2, Trash2, Loader2, MapPin, ZoomIn } from 'lucide-react';
import { imageStore, notifyImageChange } from '../utils/imageStore';

interface AnnotatableImagePickerProps {
  label: string;
  theme?: 'emerald' | 'blue' | 'indigo' | 'rose' | 'slate' | 'amber';
  disabled?: boolean;
  key?: React.Key;
  onPhotoAdded?: () => void;
}

export default function AnnotatableImagePicker({ label, theme = 'slate', disabled = false, onPhotoAdded }: AnnotatableImagePickerProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (imageSrc) imageStore.set(label, imageSrc);
    else imageStore.delete(label);
    notifyImageChange();
  }, [imageSrc, label]);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [metadata, setMetadata] = useState<{date: string, location: string} | null>(null);
  const [visionError, setVisionError] = useState<string | null>(null);

  const themeColors = {
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-300 hover:bg-emerald-100',
    blue: 'text-blue-600 bg-blue-50 border-blue-300 hover:bg-blue-100',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-300 hover:bg-indigo-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-300 hover:bg-rose-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-300 hover:bg-amber-100',
    slate: 'text-slate-600 bg-slate-50 border-slate-300 hover:bg-slate-100',
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsFetchingMeta(true);
    window.dispatchEvent(new CustomEvent('app-upload-start', { detail: { count: 1 } }));

    let locationStr = 'Ubicación no disponible';
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000, maximumAge: 60000 });
      });
      locationStr = `Lat: ${pos.coords.latitude.toFixed(6)}, Lng: ${pos.coords.longitude.toFixed(6)}`;
    } catch (err) {
      console.warn("No se pudo obtener la ubicación", err);
    }

    const dateStr = new Date().toLocaleString();
    setMetadata({ date: dateStr, location: locationStr });

    const reader = new FileReader();
    reader.onload = async (event) => {
      const src = event.target?.result as string;
      try {
        const response = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: src })
        });
        if (response.ok) {
          const data = await response.json();
          if (data.isValid === false) {
            setVisionError(data.message || "La imagen no cumple con los criterios de calidad.");
          } else {
            setVisionError(null);
          }
        }
      } catch (err) {
        console.warn('Vision API check failed:', err);
      }
      setImageSrc(src);
      setIsFetchingMeta(false);
      if (onPhotoAdded) onPhotoAdded();
      setIsAnnotating(true);
    };
    reader.readAsDataURL(file);
  };

  const initCanvas = () => {
    if (!canvasRef.current || !imageSrc) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Scale image to a reasonable max size (e.g., 800px width)
      const MAX_WIDTH = 800;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Burn Metadata
      if (metadata) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, height - 60, width, 60);

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px sans-serif';
        ctx.fillText(`Fecha/Hora: ${metadata.date}`, 10, height - 35);
        ctx.fillText(`Ubicación: ${metadata.location}`, 10, height - 12);
      }
      
      // Configure drawing style
      ctx.strokeStyle = '#ef4444'; // Red
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Save initial state to history
      setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    };
    img.src = imageSrc;
  };

  useEffect(() => {
    if (isAnnotating) {
      initCanvas();
    }
  }, [isAnnotating]);

  const saveHistory = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const newHistory = [...history, ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)];
    setHistory(newHistory.slice(-10)); // Keep last 10 states
  };

  const undo = () => {
    if (history.length <= 1 || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const previousState = history[history.length - 2];
    ctx.putImageData(previousState, 0, 0);
    setHistory(history.slice(0, -1));
  };

  // Drawing event handlers
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault(); // Prevent scrolling on touch
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveHistory();
    }
  };

  const saveAnnotation = () => {
    if (canvasRef.current) {
      setImageSrc(canvasRef.current.toDataURL('image/jpeg', 0.8));
    }
    setIsAnnotating(false);
  };

  if (disabled) {
    return (
      <div className="aspect-square bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 opacity-50 cursor-not-allowed text-center p-2 relative overflow-hidden">
        {visionError && <div className="absolute top-0 left-0 right-0 bg-red-500/90 text-white text-[9px] p-1 text-center font-medium z-10">{visionError}</div>}
            <Camera className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-bold uppercase leading-tight">{label}</span>
      </div>
    );
  }

  return (
    <>
      <div 
        onClick={() => !imageSrc && !isFetchingMeta && fileInputRef.current?.click()}
        className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer text-center p-2 relative overflow-hidden group ${ imageSrc ? 'border-transparent bg-slate-900' : themeColors[theme] }`}
      >
        {isFetchingMeta ? (
          <>
            <Loader2 className="w-6 h-6 mb-1 animate-spin opacity-50" />
            <span className="text-[10px] font-bold uppercase leading-tight opacity-50">Procesando...</span>
            {isLightboxOpen && imageSrc && (
        <div className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center touch-none animate-in fade-in duration-200">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
            className="absolute top-4 right-4 text-white p-3 hover:bg-white/10 rounded-full z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={imageSrc} 
            alt={label} 
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${scale})`, touchAction: "none" }}
            onWheel={(e) => setScale(s => Math.max(1, Math.min(5, s - e.deltaY * 0.01)))}
            onClick={() => setScale(s => s === 1 ? 2.5 : 1)} 
            
          />
        </div>
      )}
    </>
        ) : imageSrc ? (
          <>
            <img src={imageSrc} alt={label} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
            {visionError && <div className="absolute top-0 left-0 right-0 bg-red-500/90 text-white text-[9px] p-1 text-center font-medium z-10 leading-tight">{visionError}</div>}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }}
                className="bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm p-2 rounded-full"
                title="Ver en grande"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsAnnotating(true); }}
                className="bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm p-2 rounded-full"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setImageSrc(null); setMetadata(null); setVisionError(null); }}
                className="bg-rose-500/80 hover:bg-rose-600 text-white backdrop-blur-sm p-2 rounded-full"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <span className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-[10px] py-1 rounded backdrop-blur-sm truncate px-2">
              {label}
            </span>
          </>
        ) : (
          <>
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold uppercase leading-tight">{label}</span>
          </>
        )}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {isAnnotating && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col animate-in fade-in duration-200 touch-none">
          <div className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-md">
            <button 
              onClick={() => setIsAnnotating(false)}
              className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-white text-sm font-medium">Anotar Foto: {label}</div>
            <div className="flex gap-2">
              <button 
                onClick={undo}
                disabled={history.length <= 1}
                className="text-white p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
              >
                <Undo className="w-5 h-5" />
              </button>
              <button 
                onClick={saveAnnotation}
                className="bg-emerald-500 text-white p-2 hover:bg-emerald-600 rounded-full transition-colors"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative bg-black">
             <div className="relative w-full h-full flex flex-col items-center justify-center">
                <canvas
                  ref={canvasRef}
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerOut={stopDrawing}
                  onPointerCancel={stopDrawing}
                  className="max-w-full max-h-[80vh] object-contain touch-none cursor-crosshair border border-slate-700 rounded-lg shadow-2xl"
                  style={{ touchAction: 'none' }}
                />
             </div>
             
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-800/80 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full shadow-lg border border-slate-700">
               Deslice el dedo para rodear hallazgos (Rojo)
             </div>
          </div>
        </div>
      )}
    </>
  );
}
