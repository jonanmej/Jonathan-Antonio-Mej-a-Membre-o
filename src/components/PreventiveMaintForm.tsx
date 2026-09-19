import { useState } from 'react';
import { Camera, ShieldAlert, PenTool, Zap, Thermometer, CheckCircle2, Activity } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';

interface PreventiveMaintFormProps {
  level: string; // "Menor", "Medio", "Mayor", or empty
}

export default function PreventiveMaintForm({ level }: PreventiveMaintFormProps) {
  const [hasAlarms, setHasAlarms] = useState<boolean>(false);
  const [hasHotspots, setHasHotspots] = useState<boolean>(false);

  if (!level) {
    return (
      <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-center mt-6">
        <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-slate-600 dark:text-slate-300 font-medium">Seleccione la Clasificación (Menor, Medio o Mayor) arriba para desplegar el reporte técnico.</p>
      </div>
    );
  }

  const isMedioOrMayor = level === 'Medio' || level === 'Mayor';
  const isMayor = level === 'Mayor';

  return (
    <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-700 mt-6 animate-in fade-in duration-300">
      <div className="bg-indigo-50 text-indigo-900 p-4 rounded-xl border border-indigo-200 mb-6 flex gap-3 items-start">
        <ShieldAlert className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-lg mb-1">Reporte de Mantenimiento Preventivo ({level})</h3>
          <p className="text-sm opacity-80">Cuartos de control, inversores y tableros AC/DC. Formulario adaptativo según la profundidad del servicio.</p>
        </div>
      </div>

      {/* Sección 1: Datos de la Intervención y Seguridad */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
          <h4 className="font-bold text-slate-800 dark:text-slate-100">Sección 1: Datos de Intervención y Seguridad</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Identificador del Cuarto / Inversor</label>
            <input type="text" placeholder="Ej. Inversor Central A, Station 1..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Temperatura del Cuarto (°C) (Inicio)</label>
            <div className="relative">
              <Thermometer className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="number" step="0.1" placeholder="Ej. 24.5" className="w-full pl-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Humedad Relativa (%) (Opcional)</label>
            <input type="number" placeholder="Ej. 45" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none" />
          </div>
          
          <div className="md:col-span-2 mt-2 bg-red-50 border border-red-200 p-4 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
              <span className="text-sm font-bold text-red-900">Confirmación OBLIGATORIA: Protocolo LOTO (Lockout/Tagout) aplicado correctamente.</span>
            </label>
          </div>
        </div>
      </section>

      {/* Sección 2: Mantenimiento Menor */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Sección 2: Mantenimiento Menor</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-100 mb-2">¿Alarmas activas en pantalla/display?</label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="has_alarms" className="w-4 h-4 text-indigo-600" onChange={() => setHasAlarms(false)} defaultChecked />
                <span className="text-sm font-medium">Sin alarmas</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="has_alarms" className="w-4 h-4 text-amber-500" onChange={() => setHasAlarms(true)} />
                <span className="text-sm font-medium">Alarmas detectadas</span>
              </label>
            </div>
          </div>

          {hasAlarms && (
            <div className="md:col-span-2 animate-in slide-in-from-top-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Detalle de Alarmas (Códigos de error)</label>
              <textarea rows={2} placeholder="Ej. Err024 - Falla de ventilación..." className="w-full bg-white dark:bg-slate-800 border border-amber-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500/50 outline-none resize-none"></textarea>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Inspección de Cableado Externo</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="optimo">Óptimo</option>
              <option value="roedores">Daños por roedores</option>
              <option value="uv">Daño UV evidente</option>
              <option value="sueltos">Conectores/Prensacables sueltos</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Estado de Ventilación / Extractores</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="operativos">100% Operativos</option>
              <option value="obstruidos">Filtros obstruidos</option>
              <option value="falla_motor">Falla de motor detectada</option>
              <option value="ruidosos">Ruidosos / Vibración inusual</option>
            </select>
          </div>
          <div className="md:col-span-2 mt-2">
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Limpieza exterior de gabinetes completada (polvo y telarañas)</span>
            </label>
          </div>
        </div>
      </section>

      {/* Sección 3: Mantenimiento Medio */}
      {isMedioOrMayor && (
        <section className="space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Sección 3: Mantenimiento Medio</h4>
            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Acceso Interno</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Mantenimiento a Filtros de Aire</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="limpiados">Limpiados / Sopleteados</option>
                <option value="sustituidos">Sustituidos por nuevos</option>
                <option value="na">No aplica (Sellado hermético)</option>
              </select>
            </div>
            
            <div className="md:col-span-2 mt-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50">
                <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Aspirado interior de gabinetes realizado</span>
              </label>
            </div>

            <div className="md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-100 mb-2">Inspección Termográfica Básica</label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="has_hotspots" className="w-4 h-4 text-indigo-600" onChange={() => setHasHotspots(false)} defaultChecked />
                  <span className="text-sm font-medium">Normal / Sin hallazgos</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="has_hotspots" className="w-4 h-4 text-amber-500" onChange={() => setHasHotspots(true)} />
                  <span className="text-sm font-medium">Puntos calientes detectados</span>
                </label>
              </div>
            </div>

            {hasHotspots && (
              <div className="md:col-span-2 animate-in slide-in-from-top-2 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Temperatura Máxima Detectada (°C)</label>
                  <input type="number" step="0.1" placeholder="Ej. 85.4" className="w-full bg-white dark:bg-slate-800 border border-amber-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500/50 outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Ubicación del punto caliente</label>
                  <input type="text" placeholder="Ej. Bornera L2 AC, Fusible DC #4..." className="w-full bg-white dark:bg-slate-800 border border-amber-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500/50 outline-none" />
                </div>
              </div>
            )}

            <div className="md:col-span-2 mt-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50">
                <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Revisión de torque (Parcial / Muestreo) en conexiones accesibles</span>
              </label>
            </div>
          </div>
        </section>
      )}

      {/* Sección 4: Mantenimiento Mayor */}
      {isMayor && (
        <section className="space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Sección 4: Mantenimiento Mayor</h4>
            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Paro Total (Shutdown)</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Prueba Aislamiento DC (MΩ)</label>
              <div className="relative">
                <Zap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="number" step="0.1" placeholder="Ej. >500" className="w-full pl-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Prueba Aislamiento AC (MΩ)</label>
              <div className="relative">
                <Zap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="number" step="0.1" placeholder="Ej. >500" className="w-full pl-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none" />
              </div>
            </div>

            <div className="md:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-700/50 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-start gap-3 cursor-pointer p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 h-full">
                  <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">Reapriete 100% de borneras y barras colectoras con torquímetro</span>
                </label>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Valor Torque Promedio Barras (Nm)</label>
                <input type="number" step="0.1" placeholder="Ej. 45" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Revisión Fusibles, Contactores, SPD</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="ok">Todo Óptimo</option>
                <option value="fusibles_quemados">Fusibles quemados detectados</option>
                <option value="spd_fundidos">Varistores (SPD) fundidos</option>
                <option value="contactores_carbon">Contactores carbonizados</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-start gap-3 cursor-pointer p-3 w-full border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50">
                <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 mt-0.5" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Limpieza química profunda (PCBs dieléctrico) completada</span>
              </label>
            </div>
          </div>
        </section>
      )}

      {/* Sección 5: Evidencia Fotográfica y Cierre */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Sección 5: Evidencia y Cierre</h4>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Registro Fotográfico Requerido</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <MultiImageCategory label="Vista Gral. (Antes)" theme="slate" />
            <MultiImageCategory label="Vista Gral. (Después)" theme="slate" />
            
            <MultiImageCategory label="Interior del Gabinete" theme="indigo" disabled={!isMedioOrMayor} />

            <MultiImageCategory label="Hallazgo Termográfico" theme="amber" disabled={!hasHotspots} />
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-6 h-6 text-emerald-600 rounded focus:ring-emerald-500" />
              <span className="text-sm font-bold text-emerald-900">Energización Segura: Confirmo el retiro de LOTO, herramientas y ausencia de cortocircuitos. Equipo listo para arrancar.</span>
            </label>
          </div>

          
      </div></section>
    </div>
  );
}
