import React, { useState, useEffect } from 'react';
import { CloudRain, Wind, AlertTriangle, Loader2 } from 'lucide-react';

interface WeatherData {
  precipitation_probability: number[];
  wind_speed_10m: number[];
}

export default function WeatherAlerts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<{ type: 'rain' | 'wind'; message: string }[]>([]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=precipitation_probability,wind_speed_10m&forecast_days=1`);
          const data = await res.json();
          
          const newAlerts = [];
          
          if (data && data.hourly) {
            const maxRain = Math.max(...(data.hourly.precipitation_probability || [0]));
            const maxWind = Math.max(...(data.hourly.wind_speed_10m || [0]));
            
            if (maxRain > 60) {
              newAlerts.push({ type: 'rain', message: `Alta probabilidad de lluvia hoy (${maxRain}%)` });
            }
            if (maxWind > 40) {
              newAlerts.push({ type: 'wind', message: `Vientos fuertes previstos (${maxWind} km/h)` });
            }
          }
          
          setAlerts(newAlerts as any);
          setLoading(false);
        } catch (err) {
          setError('Error obteniendo clima');
          setLoading(false);
        }
      },
      (err) => {
        setError('Permiso de ubicación denegado');
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Verificando condiciones climáticas...
      </div>
    );
  }

  if (alerts.length === 0 && !error) {
    return null; // Don't show anything if weather is fine
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}
      {alerts.map((alert, idx) => (
        <div key={idx} className={`px-4 py-3 rounded-xl border flex items-center gap-3 text-sm font-semibold ${ alert.type === 'rain' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-amber-50 border-amber-200 text-amber-700' }`}>
          {alert.type === 'rain' ? <CloudRain className="w-5 h-5" /> : <Wind className="w-5 h-5" />}
          {alert.message}
        </div>
      ))}
    </div>
  );
}
