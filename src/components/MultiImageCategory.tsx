import { useState } from 'react';
import AnnotatableImagePicker from './AnnotatableImagePicker';
import { Plus } from 'lucide-react';

interface Props {
  label: string;
  theme?: 'slate' | 'amber' | 'rose' | 'emerald' | 'indigo' | 'blue';
  disabled?: boolean;
  onPhotoAdded?: () => void;
}

export default function MultiImageCategory({ label, theme = 'slate', disabled = false, onPhotoAdded }: Props) {
  const [images, setImages] = useState<number[]>([Date.now()]);

  const addSlot = () => {
    if (!disabled) {
      setImages([...images, Date.now()]);
    }
  };

  return (
    <div className="space-y-2 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">{label}</span>
        {!disabled && (
          <button 
            type="button" 
            onClick={addSlot} 
            className="text-xs text-blue-600 font-bold hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md transition-colors"
          >
            <Plus className="w-3 h-3" /> Añadir
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {images.map((id, index) => (
          <AnnotatableImagePicker 
            key={id} 
            label={`${label} ${index + 1}`} 
            theme={theme} 
            disabled={disabled} 
            onPhotoAdded={onPhotoAdded}
          />
        ))}
      </div>
    </div>
  );
}
