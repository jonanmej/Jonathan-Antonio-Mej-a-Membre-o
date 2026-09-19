import React from 'react';
import { Activity, Sun, Zap, Camera, CheckCircle2 } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';

export default function IVCurveForm() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Curvas I-V y Electroluminiscencia (EL)</h2>
            <p className="text-orange-100">Evaluación avanzada de rendimiento y degradación PID/LID</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Condiciones Ambientales (Norma IEC 60891)</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Irradiancia Medida (W/m²)</label>
            <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Ej. 850" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Temp. Módulo Posterior (°C)</label>
            <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Ej. 45.2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Temp. Ambiente (°C)</label>
            <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Ej. 30.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Equipo Trazador Utilizado</label>
            <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Ej. Seaward PV210 / HT I-V500w" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Resultados del Trazado I-V</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Voc (V)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Medido" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Isc (A)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Medido" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Pmpp (W)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Medido" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Fill Factor (FF) %</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Ej. 75" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Degradación Estimada vs STC (%)</label>
            <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Ej. -2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Forma de Curva (Anomalías detectadas)</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none appearance-none">
              <option>Curva Normal (Sin anomalías)</option>
              <option>Escalones (Bypass Diodes fallando / Sombras)</option>
              <option>Pendiente en Isc (Resistencia Shunt baja)</option>
              <option>Pendiente en Voc (Resistencia Serie alta)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Camera className="w-5 h-5 text-indigo-500" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Inspección de Electroluminiscencia (EL)</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Hallazgos Frecuentes (Check)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50">
                <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Microfisuras (Microcracks)</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50">
                <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Células Muertas / Inactivas</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50">
                <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">PID (Degradación Inducida por Potencial)</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50">
                <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Daño por impacto (Granizo/Mecánico)</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Observaciones EL</label>
            <textarea rows={3} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none"></textarea>
          </div>
        </div>
      </div>

      <MultiImageCategory label="Gráficas de Curva I-V / Pantallazos del Trazador" theme="emerald" />
      <MultiImageCategory label="Imágenes de Electroluminiscencia (EL)" theme="indigo" />
    </div>
  );
}
