import React from 'react';
import { Settings, Wrench, CheckCircle2 } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';

export default function TrackerMaintenanceForm() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Mantenimiento de Seguidores (Trackers)</h2>
            <p className="text-emerald-100">Lubricación, torque y revisión mecánica de estructuras</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Inspección Mecánica y Lubricación</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">ID del Tracker / Fila</label>
            <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/50 outline-none" placeholder="Ej. TRK-01-A" />
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Checklist de Revisión (Marcar si se realizó)</label>
            <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50">
              <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Lubricación de Corona (Slewing Drive)</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50">
              <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Verificación de Inclinómetros</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50">
              <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Torqueo de Pernos Estructurales (Marca de pintura)</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50">
              <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Revisión de Amortiguadores (Dampers) - Fugas de aceite</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50">
              <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Revisión del Motor de Giro (Funcionamiento y sonidos)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Pruebas Funcionales</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Prueba de Avance Manual (Grados Max/Min)</label>
            <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/50 outline-none" placeholder="Ej. OK (+55° a -55°)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Activación de Alarma de Viento (Anemómetro)</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none">
              <option>Simulación OK (Tracker va a posición de defensa)</option>
              <option>Falla (No responde anemómetro)</option>
              <option>No Aplica / No Evaluado</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Grasa / Lubricante Utilizado</label>
            <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/50 outline-none" placeholder="Ej. Grasa de Litio EP2 / Molykote" />
          </div>
        </div>
      </div>

      <MultiImageCategory label="Evidencias Mecánicas y Lubricación" theme="emerald" />
    </div>
  );
}
