import React from 'react';
import { Droplet, Beaker, FileText } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';

export default function OilAnalysisForm() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Droplet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Análisis de Aceites y Tribología</h2>
            <p className="text-blue-100">Cromatografía de Gases (DGA) y Pruebas Fisicoquímicas</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Beaker className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Resultados Fisicoquímicos y Dieléctricos</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Tensión de Ruptura Dieléctrica (kV)</label>
            <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 65" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Contenido de Humedad / Agua (ppm)</label>
            <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 12" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Acidez Total (mg KOH/g)</label>
            <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 0.015" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Factor de Potencia del Aceite (A 25°C %)</label>
            <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 0.03" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Tensión Interfacial (mN/m)</label>
            <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 42" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Color / Inspección Visual (ASTM D1500)</label>
            <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 1.0 (Claro, brillante)" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Cromatografía de Gases Disueltos (DGA) en ppm</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Hidrógeno (H2)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="ppm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Metano (CH4)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="ppm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Etano (C2H6)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="ppm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Etileno (C2H4)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="ppm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Acetileno (C2H2)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="ppm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Monóx. Carbono (CO)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="ppm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Dióx. Carbono (CO2)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="ppm" />
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Diagnóstico Final (Método Duval / Doernenburg)</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none">
              <option>Condición Normal</option>
              <option>Arco de Alta Energía (D2)</option>
              <option>Arco de Baja Energía (D1)</option>
              <option>Descargas Parciales (PD)</option>
              <option>Falla Térmica T1 (&lt; 300°C)</option>
              <option>Falla Térmica T2 (300 - 700°C)</option>
              <option>Falla Térmica T3 (&gt; 700°C)</option>
            </select>
          </div>
        </div>
      </div>

      <MultiImageCategory label="Documentos Laboratorio / Muestreo de Aceite" theme="blue" />
    </div>
  );
}
