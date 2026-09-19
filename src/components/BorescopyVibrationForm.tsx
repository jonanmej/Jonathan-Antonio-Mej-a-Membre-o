import React from 'react';
import { SearchCode, Activity, Play } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';

export default function BorescopyVibrationForm() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <SearchCode className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Boroscopía y Vibraciones</h2>
            <p className="text-slate-300">Inspección interna y análisis del espectro de vibración en motores HFO</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Análisis de Vibraciones (Norma ISO 10816-6)</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Punto de Medición (Ej. Cojinete Libre / Acople)</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-500/50 outline-none" placeholder="Ej. Lado Acople (Drive End)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Velocidad Global RMS (mm/s)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-500/50 outline-none" placeholder="Ej. 12.5" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Hallazgos Espectrales Dominantes (Frecuencias)</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50">
                <input type="checkbox" className="w-5 h-5 text-slate-700 dark:text-slate-200 rounded" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">1X RPM (Desbalanceo Masivo)</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50">
                <input type="checkbox" className="w-5 h-5 text-slate-700 dark:text-slate-200 rounded" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">2X / 3X RPM (Desalineación, Eje Torcido)</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50">
                <input type="checkbox" className="w-5 h-5 text-slate-700 dark:text-slate-200 rounded" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Frecuencias Altas (Desgaste de rodamientos/engranajes)</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Diagnóstico ISO 10816-6</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-500/50 outline-none appearance-none">
              <option>Zona A (Excelente)</option>
              <option>Zona B (Aceptable para operación continua)</option>
              <option>Zona C (Marginal - Planear corrección)</option>
              <option>Zona D (Inaceptable - Peligro de daño)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Play className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Inspección Boroscópica (Cilindros y Válvulas)</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Cilindro / Cámara Inspeccionada</label>
            <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-500/50 outline-none" placeholder="Ej. Cilindro A3 / B6" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado de Válvulas de Escape</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-500/50 outline-none appearance-none">
                <option>Sin daños (Asiento limpio)</option>
                <option>Depósitos de Carbón (Ligero)</option>
                <option>Depósitos de Vanadio/Sodio (Corrosión)</option>
                <option>Quemaduras / Fugas (Blow-by)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado de la Corona del Pistón</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-500/50 outline-none appearance-none">
                <option>Patrón de combustión normal</option>
                <option>Depósitos pesados</option>
                <option>Impactos térmicos (Hot spots)</option>
                <option>Humedad / Rastros de agua</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado de la Camisa (Liner Honing)</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-500/50 outline-none appearance-none">
                <option>Rayado cruzado visible (Cross-hatch OK)</option>
                <option>Pulido (Glazing / Bore polish)</option>
                <option>Rayaduras verticales (Scuffing)</option>
                <option>Corrosión en punto frío</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Observaciones Generales Boroscopía</label>
            <textarea rows={3} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-500/50 outline-none resize-none" placeholder="Detalle los hallazgos críticos..."></textarea>
          </div>
        </div>
      </div>

      <MultiImageCategory label="Fotos Boroscópicas y Gráficas de Espectro" theme="slate" />
    </div>
  );
}
