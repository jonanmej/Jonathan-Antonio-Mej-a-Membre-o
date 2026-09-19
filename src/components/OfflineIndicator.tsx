import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white shadow-xl">
      <WifiOff className="w-4 h-4 animate-pulse" />
      Modo Sin Conexión — Usando caché.
    </div>
  );
};
