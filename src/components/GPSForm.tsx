import React, { useState } from 'react';
import { Settings, ShieldAlert, Cpu, Activity, Info, Zap, Wrench, Navigation, CheckCircle2, AlertTriangle, ScanLine, Car } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';
import QrScannerInput from './QrScannerInput';

interface GPSFormProps {
  serviceType: string;
}

export default function GPSForm({ serviceType }: GPSFormProps) {
  const [sabotajeAlert, setSabotajeAlert] = useState(false);
  const [hasScannedImei, setHasScannedImei] = useState(false);
  const [hasScannedSim, setHasScannedSim] = useState(false);
  const [imei, setImei] = useState('');
  const [sim, setSim] = useState('');

  const isInst = ['gps_inst', 'gps_reinst'].includes(serviceType);
  const isRep = serviceType === 'gps_rep';
  const isVisita = serviceType === 'gps_visita';
  const isRetir = serviceType === 'gps_retir';

  const getTitle = () => {
    switch (serviceType) {
      case 'gps_inst': return 'Instalación de Equipo GPS';
      case 'gps_reinst': return 'Reinstalación de Equipo GPS';
      case 'gps_retir': return 'Retiro de Equipo GPS';
      case 'gps_rep': return 'Reparación / Sustitución GPS';
      case 'gps_visita': return 'Visita Técnica GPS';
      default: return 'Servicio GPS';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 text-white p-5 rounded-2xl flex items-center justify-between shadow-lg">
        <div>
          <h2 className="text-xl font-bold">{getTitle()}</h2>
          <p className="text-sm text-slate-300 mt-1">
            Complete todos los campos requeridos para el reporte técnico.
          </p>
        </div>
        <div className="bg-slate-700 p-3 rounded-xl">
          <Navigation className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      {/* Alerta de Sabotaje */}
      {sabotajeAlert && (
        <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-5 shadow-sm animate-in fade-in slide-in-from-top-4 flex gap-4 items-start">
          <div className="bg-rose-100 p-2 rounded-full mt-0.5">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h3 className="font-bold text-rose-800 text-lg">¡ALERTA DE SABOTAJE DETECTADA!</h3>
            <p className="text-rose-700 text-sm mt-1 mb-3">
              Se ha reportado evidencia de manipulación no autorizada. 
              <strong> Comuníquese inmediatamente con el centro de control antes de continuar.</strong>
            </p>
            <div className="flex gap-3">
              <button className="bg-rose-600 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors">
                Llamar a Central
              </button>
              <button 
                onClick={() => setSabotajeAlert(false)}
                className="bg-white dark:bg-slate-800 text-rose-700 border border-rose-200 text-sm font-bold py-2 px-4 rounded-lg hover:bg-rose-50 transition-colors"
              >
                Falsa Alarma (Descartar)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sección 1: Identificación Vehicular y del Dispositivo (Siempre visible) */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Car className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">1. Identificación Vehicular y Dispositivo</h3>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Placa / Matrícula</label>
              <input type="text" placeholder="Ej. ABC-123" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none uppercase font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Odómetro (Km)</label>
              <input type="number" placeholder="Kilometraje" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Horómetro (Si aplica)</label>
              <input type="number" placeholder="Horas" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" />
            </div>
          </div>

          {!isRetir && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-700/50">
              <QrScannerInput
                label="IMEI del Dispositivo"
                value={imei}
                onChange={setImei}
                placeholder="Escanear o ingresar IMEI..."
              />
              <QrScannerInput
                label="ICCID (SIM Card)"
                value={sim}
                onChange={setSim}
                placeholder="Escanear o ingresar SIM..."
              />
            </div>
          )}
        </div>
      </section>

      {/* Sección Condicional: Retiro de GPS */}
      {isRetir && (
        <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">2. Detalles del Retiro de Equipo</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Motivo del Retiro</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                  <option value="">Seleccionar...</option>
                  <option value="baja_vehiculo">Baja de Vehículo / Venta</option>
                  <option value="cambio_proveedor">Cambio de Proveedor de Rastreo</option>
                  <option value="falla_irreparable">Falla Irreparable (Sustitución programada)</option>
                  <option value="fin_contrato">Fin de Contrato de Servicio</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado del Equipo Retirado</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                  <option value="">Seleccionar...</option>
                  <option value="bueno">Buen estado (Reutilizable)</option>
                  <option value="dano_menor">Daño menor (Cables cortos, carcasa rayada)</option>
                  <option value="inservible">Inservible (Quemado, roto, mojado)</option>
                  <option value="no_aplica">No se recuperó equipo</option>
                </select>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-3">
              <p className="text-sm font-semibold text-amber-800">Checklist de Cierre y Seguridad</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-amber-600 rounded border-amber-300 focus:ring-amber-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-200">Arnés original del vehículo restaurado y encintado</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-amber-600 rounded border-amber-300 focus:ring-amber-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-200">Relé de corte removido (ignición puenteada y segura)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-amber-600 rounded border-amber-300 focus:ring-amber-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-200">Paneles y molduras reinstalados sin daños</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-amber-600 rounded border-amber-300 focus:ring-amber-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-200">Vehículo arranca sin problemas tras el retiro</span>
                </label>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sección 2: Diagnóstico y Revisión Física (Para Inspección, Visita Técnica o Reparación) */}
      {(isVisita || isRep) && (
        <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">2. Diagnóstico y Revisión Inicial</h3>
          </div>
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Motivo de Revisión</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                  <option value="">Seleccionar...</option>
                  <option value="sin_reportar">Sin reportar posición</option>
                  <option value="no_apaga">Corte de motor no funciona</option>
                  <option value="posicion_incorrecta">Posición/Ruta incorrecta</option>
                  <option value="preventivo">Visita Preventiva (Revisión)</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Hallazgo Visual Principal</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none"
                  onChange={(e) => setSabotajeAlert(e.target.value === 'sabotaje')}
                >
                  <option value="">Seleccionar...</option>
                  <option value="ok">Físicamente intacto, cables conectados</option>
                  <option value="desconectado">Equipo o alimentación desconectada</option>
                  <option value="sabotaje">Evidencia de sabotaje / manipulación</option>
                  <option value="dano_agua">Daño por agua / humedad</option>
                  <option value="quemado">Cortocircuito / Quemado</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-700/50 pt-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Voltaje Batería (V)</label>
                <div className="relative">
                  <Zap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="number" step="0.1" placeholder="Ej. 12.6" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 pl-9 focus:ring-2 focus:ring-blue-500/50 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado LED GSM (Red)</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                  <option value="">Seleccionar...</option>
                  <option value="fijo">Fijo (Conectado)</option>
                  <option value="parpadeo_lento">Parpadeo lento (Buscando)</option>
                  <option value="parpadeo_rapido">Parpadeo rápido (Transfiriendo)</option>
                  <option value="apagado">Apagado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado LED GPS (Satélite)</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                  <option value="">Seleccionar...</option>
                  <option value="fijo">Fijo (Posición fijada)</option>
                  <option value="parpadeo">Parpadeo (Buscando)</option>
                  <option value="apagado">Apagado</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sección 3: Conexiones y Accesorios (Para Instalación, Reinstalación o Reparación) */}
      {(isInst || isRep) && (
        <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">{isRep ? '3. Detalles de Reparación' : '2. Detalles de Instalación'}</h3>
          </div>
          
          <div className="p-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Ubicación del Dispositivo</label>
                <input type="text" placeholder="Ej. Detrás del tablero central" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Tipo de Antenas</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                  <option value="internas">Internas (Integradas)</option>
                  <option value="externas">Externas (Con cable)</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Puntos de Empalme Realizados</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50 cursor-pointer shadow-sm">
                  <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">12V / 24V (Positivo Directo)</span>
                </label>
                <label className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50 cursor-pointer shadow-sm">
                  <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">GND (Tierra / Masa)</span>
                </label>
                <label className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50 cursor-pointer shadow-sm">
                  <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">IGN (Ignición / Switch)</span>
                </label>
                <label className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50 cursor-pointer shadow-sm">
                  <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Corte de Motor (Relé)</span>
                </label>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Prueba con Central de Monitoreo</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Se validó posición, ignición y corte remotamente</p>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>
            </div>
          </div>
        </section>
      )}

      {/* Sección: Observaciones Adicionales */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Observaciones Generales</h3>
        </div>
        <div className="p-5">
          <textarea 
            rows={3} 
            placeholder="Anotaciones adicionales sobre el servicio, estado del vehículo o configuraciones realizadas..." 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"
          ></textarea>
        </div>
      </section>

      {/* Sección: Registro Fotográfico GPS */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Registro Fotográfico del Servicio</h3>
        </div>
        <div className="p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Capture evidencia de la instalación, empalmes y estado final.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MultiImageCategory label={isRetir ? "Ubicación Previa (Antes de retirar)" : "Ubicación del Dispositivo Oculto"} theme="slate" />
            {!isRetir && <MultiImageCategory label="Empalmes (Encintado)" theme="slate" />}
            {!isRetir && <MultiImageCategory label="Placa (IMEI/SIM) del GPS" theme="amber" />}
            {isRetir && <MultiImageCategory label="Estado del GPS Retirado" theme="amber" />}
            <MultiImageCategory label="Vista General Tablero (Sin desarmes)" theme="blue" />
          </div>
        </div>
      </section>
    </div>
  );
}
