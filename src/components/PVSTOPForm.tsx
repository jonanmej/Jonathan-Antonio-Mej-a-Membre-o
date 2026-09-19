import React, { useState } from 'react';
import { BookOpen, Users, ShieldAlert, Droplets, CheckCircle2, Info, Camera, PenTool, Sparkles, Activity } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';

interface PVSTOPFormProps {
  serviceType: string;
}

export default function PVSTOPForm({ serviceType }: PVSTOPFormProps) {
  const [liveDemo, setLiveDemo] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-orange-600 text-white p-5 rounded-2xl flex items-center justify-between shadow-lg">
        <div>
          <h2 className="text-xl font-bold">Capacitación Técnica: PVSTOP</h2>
          <p className="text-sm text-orange-100 mt-1">
            Registro de entrenamiento y demostración del bloqueador solar líquido.
          </p>
        </div>
        <div className="bg-orange-500 p-3 rounded-xl">
          <Droplets className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Sección 1: Detalles de la Capacitación */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">1. Audiencia y Alcance</h3>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Perfil de los Asistentes</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none">
                <option value="">Seleccionar perfil principal...</option>
                <option value="bomberos">Bomberos / Rescatistas</option>
                <option value="instaladores">Instaladores Solares / O&M</option>
                <option value="seguridad">Personal de Seguridad Industrial</option>
                <option value="propietarios">Propietarios de Instalaciones</option>
                <option value="mixto">Grupo Mixto</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Nº Asistentes</label>
                <input type="number" placeholder="Ej. 15" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Duración (Hrs)</label>
                <input type="number" step="0.5" placeholder="Ej. 2" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Temario Cubierto */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">2. Temario Impartido</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-orange-600 rounded border-slate-300 dark:border-slate-600 focus:ring-orange-500 mt-0.5" defaultChecked />
              <div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">Riesgos Eléctricos Solares</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Peligros de DC y la imposibilidad de apagar paneles con luz solar.</span>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-orange-600 rounded border-slate-300 dark:border-slate-600 focus:ring-orange-500 mt-0.5" defaultChecked />
              <div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">Propiedades de PVSTOP</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Bloqueo de luz, secado rápido, resistencia a la intemperie y no inflamabilidad.</span>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-orange-600 rounded border-slate-300 dark:border-slate-600 focus:ring-orange-500 mt-0.5" defaultChecked />
              <div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">Técnica de Aplicación</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Distancia de rociado, patrón en Z, y cobertura total del panel.</span>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-orange-600 rounded border-slate-300 dark:border-slate-600 focus:ring-orange-500 mt-0.5" defaultChecked />
              <div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">Remoción y Limpieza</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Técnica para despegar la película ("peeling") sin dañar el módulo solar.</span>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* Sección 3: Demostración Práctica */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">3. Demostración Práctica (Live Demo)</h3>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">¿Se realizó demo física?</span>
            <div className="relative">
              <input type="checkbox" className="sr-only peer" checked={liveDemo} onChange={(e) => setLiveDemo(e.target.checked)} />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </div>
          </label>
        </div>
        
        {liveDemo && (
          <div className="p-5 space-y-5 border-t border-slate-100 dark:border-slate-700/50 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Paneles Cubiertos</label>
                <input type="number" placeholder="Ej. 2" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Medición de Voltaje</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none">
                  <option value="ambos">Se midió Antes y Después (Reducción comprobada)</option>
                  <option value="solo_despues">Solo se comprobó 0V al final</option>
                  <option value="no_medido">No se usó multímetro en la demo</option>
                </select>
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 flex gap-4">
              <Sparkles className="w-6 h-6 text-orange-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-orange-800">Evaluación de la Aplicación</p>
                <p className="text-xs text-orange-700 mt-1">¿Los asistentes practicaron la aplicación o remoción del producto de forma supervisada?</p>
                <div className="mt-3 flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-orange-600 rounded border-orange-300 focus:ring-orange-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">Asistentes aplicaron producto</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-orange-600 rounded border-orange-300 focus:ring-orange-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">Asistentes removieron la película</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Sección 4: Observaciones */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">4. Conclusiones y Feedback</h3>
        </div>
        <div className="p-5">
          <textarea 
            rows={3} 
            placeholder="Preguntas frecuentes de los asistentes, nivel de interés, dudas pendientes..." 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-orange-500/50 outline-none resize-none"
          ></textarea>
        </div>
      </section>
      
      
      {/* Sección 5: Registro Fotográfico y Cierre */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Camera className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">5. Evidencia Fotográfica </h3>
        </div>
        <div className="p-5 space-y-6">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Registro Fotográfico</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MultiImageCategory label="Asistentes (Teoría)" theme="slate" />
              <MultiImageCategory label="Aplicación del PVSTOP" theme="amber" />
              <MultiImageCategory label="Panel Cubierto / Remoción" theme="emerald" />
            </div>
          </div>
          
          
        </div>
      </section>
    </div>
  );
}

