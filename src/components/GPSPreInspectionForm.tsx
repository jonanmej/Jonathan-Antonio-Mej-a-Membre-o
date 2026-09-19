import React, { useState } from 'react';
import { Camera, CheckCircle, Lock, ShieldAlert, Car, Unlock, TriangleAlert } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';

interface GPSPreInspectionFormProps {
  isUnlocked: boolean;
  onUnlock: () => void;
  onLock: () => void;
}

export default function GPSPreInspectionForm({ isUnlocked, onUnlock, onLock }: GPSPreInspectionFormProps) {
  const [isReady, setIsReady] = useState(true);

  if (isUnlocked) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-full">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-800">Inspección Previa del Vehículo Completada</h3>
            <p className="text-xs text-emerald-600 font-medium">Condiciones validadas para iniciar el servicio.</p>
          </div>
        </div>
        <button onClick={onLock} className="text-xs font-bold text-emerald-700 bg-emerald-100/50 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-emerald-200/50">
          <Unlock className="w-3.5 h-3.5" /> Editar
        </button>
      </div>
    );
  }

  const StatusGroup = ({ label, name }: { label: string, name: string }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="flex gap-2 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
        <label className="flex-1 text-center">
          <input type="radio" name={name} className="peer sr-only" defaultChecked />
          <div className="text-sm font-medium py-1.5 rounded-md text-slate-600 dark:text-slate-300 peer-checked:bg-white peer-checked:text-emerald-700 peer-checked:shadow-sm cursor-pointer transition-all">OK</div>
        </label>
        <label className="flex-1 text-center">
          <input type="radio" name={name} className="peer sr-only" />
          <div className="text-sm font-medium py-1.5 rounded-md text-slate-600 dark:text-slate-300 peer-checked:bg-white peer-checked:text-amber-600 peer-checked:shadow-sm cursor-pointer transition-all">Regular</div>
        </label>
        <label className="flex-1 text-center">
          <input type="radio" name={name} className="peer sr-only" />
          <div className="text-sm font-medium py-1.5 rounded-md text-slate-600 dark:text-slate-300 peer-checked:bg-white peer-checked:text-rose-600 peer-checked:shadow-sm cursor-pointer transition-all">Malo</div>
        </label>
      </div>
    </div>
  );

  const CheckboxItem = ({ label }: { label: string }) => (
    <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer group">
      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500 mt-0.5" />
      <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-slate-900 leading-tight">{label}</span>
    </label>
  );

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl border border-blue-200 shadow-md overflow-hidden relative">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
      
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Car className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Inspección Visual Previa del Vehículo</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Evaluación del vehículo (monitoreo GPS vía SIM) antes de iniciar labores físicas</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200 text-xs font-bold">
          <TriangleAlert className="w-4 h-4 text-amber-500" />
          Evita reclamos por daños
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatusGroup label="Tablero / Consola" name="status_tablero" />
          <StatusGroup label="Sistema Eléctrico (Batería)" name="status_bateria" />
          <StatusGroup label="Carrocería Exterior" name="status_exterior" />
          <StatusGroup label="Interior / Tapicería" name="status_interior" />
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mb-6">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">Registro de daños o condiciones previas detectadas</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Tablero y Consola</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CheckboxItem label="Testigos de falla encendidos (Check Engine, etc.)" />
                <CheckboxItem label="Testigo de batería encendido" />
                <CheckboxItem label="Plásticos rotos o sueltos en el tablero" />
                <CheckboxItem label="Faltan tornillos / grapas en las tapas" />
                <CheckboxItem label="Radio o accesorios con fallas" />
                <CheckboxItem label="Rayones visibles en el área de trabajo" />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Sistema Eléctrico</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CheckboxItem label="Batería descargada / Vehículo no arranca" />
                <CheckboxItem label="Cables expuestos / Instalaciones no originales" />
                <CheckboxItem label="Bornes de batería sulfatados o flojos" />
                <CheckboxItem label="Caja de fusibles sin tapa o modificada" />
                <CheckboxItem label="Luces interiores no funcionan" />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Carrocería e Interior</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CheckboxItem label="Golpes o choques evidentes" />
                <CheckboxItem label="Cristales rotos o con daños" />
                <CheckboxItem label="Humedad o filtraciones de agua en cabina" />
                <CheckboxItem label="Tapicería manchada o rota" />
                <CheckboxItem label="Alfombra mojada o dañada" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Detalle del estado del vehículo</label>
            <textarea rows={2} placeholder="Describir cualquier daño preexistente o anomalía encontrada..." className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"></textarea>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mb-8">
          <label className="flex items-center justify-between cursor-pointer mb-4">
            <div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Vehículo apto para instalar/reparar</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Si el vehículo presenta condiciones de riesgo alto eléctrico, desmarca esta opción.</p>
            </div>
            <div className="relative">
              <input type="checkbox" className="sr-only peer" checked={isReady} onChange={(e) => setIsReady(e.target.checked)} />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </label>
          
          <div className="space-y-4">
            {!isReady && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <textarea rows={2} placeholder="Motivo de rechazo o restricciones para ejecutar el trabajo..." className="w-full bg-white dark:bg-slate-800 border border-amber-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500/50 outline-none resize-none"></textarea>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">Registro fotográfico del estado previo</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Capturar tablero encendido, kilometraje y cualquier daño preexistente antes de desarmar.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MultiImageCategory label="Tablero Encendido (Kilometraje)" theme="slate" />
            <MultiImageCategory label="Detalle Daños / Rayones" theme="rose" />
          </div>
        </div>

        <button 
          onClick={onUnlock}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all shadow-md"
        >
          <Lock className="w-5 h-5" />
          Guardar Inspección y Desbloquear Reporte
        </button>
      </div>
    </section>
  );
}
