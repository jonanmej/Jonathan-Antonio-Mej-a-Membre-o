import React, { useState } from 'react';
import { Droplets, Sun, ClipboardList, Settings, Camera, PenTool, CheckCircle, ShieldAlert } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';

interface ChemitekFormProps {
  serviceType: string;
}

export default function ChemitekForm({ serviceType }: ChemitekFormProps) {
  const [waterType, setWaterType] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-sky-600 text-white p-5 rounded-2xl flex items-center justify-between shadow-lg">
        <div>
          <h2 className="text-xl font-bold">Servicio de Limpieza Chemitek Solar</h2>
          <p className="text-sm text-sky-100 mt-1">
            Limpieza profesional y tratamiento de módulos fotovoltaicos.
          </p>
        </div>
        <div className="bg-sky-500 p-3 rounded-xl">
          <Droplets className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Sección 1: Evaluación Inicial del Sitio */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">1. Evaluación de la Instalación</h3>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Cantidad de Paneles</label>
              <input type="number" placeholder="Ej. 250" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500/50 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Potencia Total (kWp)</label>
              <input type="number" step="0.1" placeholder="Ej. 100" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500/50 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Nivel de Suciedad</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="bajo">Bajo (Mantenimiento regular)</option>
                <option value="medio">Medio (Polvo acumulado)</option>
                <option value="alto">Alto (Costras, excremento)</option>
                <option value="extremo">Extremo (Líquenes, cemento)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Tipo de Suciedad Principal Detectada</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <label className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50 cursor-pointer shadow-sm">
                <input type="checkbox" className="w-5 h-5 text-sky-600 rounded border-slate-300 dark:border-slate-600 focus:ring-sky-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Polvo / Arena / Tierra</span>
              </label>
              <label className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50 cursor-pointer shadow-sm">
                <input type="checkbox" className="w-5 h-5 text-sky-600 rounded border-slate-300 dark:border-slate-600 focus:ring-sky-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Excremento de Aves</span>
              </label>
              <label className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50 cursor-pointer shadow-sm">
                <input type="checkbox" className="w-5 h-5 text-sky-600 rounded border-slate-300 dark:border-slate-600 focus:ring-sky-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Contaminación Industrial</span>
              </label>
              <label className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50 cursor-pointer shadow-sm">
                <input type="checkbox" className="w-5 h-5 text-sky-600 rounded border-slate-300 dark:border-slate-600 focus:ring-sky-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Polvo de Cemento / Cantera</span>
              </label>
              <label className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50 cursor-pointer shadow-sm">
                <input type="checkbox" className="w-5 h-5 text-sky-600 rounded border-slate-300 dark:border-slate-600 focus:ring-sky-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Líquenes / Hongos</span>
              </label>
              <label className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50 cursor-pointer shadow-sm">
                <input type="checkbox" className="w-5 h-5 text-sky-600 rounded border-slate-300 dark:border-slate-600 focus:ring-sky-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Salitre / Ambiente Marino</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Productos y Aplicación */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">2. Productos y Método de Aplicación</h3>
        </div>
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Productos Chemitek Utilizados</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-sky-50 transition-colors">
                  <input type="checkbox" className="w-5 h-5 text-sky-600 rounded border-slate-300 dark:border-slate-600 focus:ring-sky-500" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Solar Wash Protect (SWP)</span>
                </label>
                <label className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-sky-50 transition-colors">
                  <input type="checkbox" className="w-5 h-5 text-sky-600 rounded border-slate-300 dark:border-slate-600 focus:ring-sky-500" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Water Drop (Secado Rápido)</span>
                </label>
                <label className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-sky-50 transition-colors">
                  <input type="checkbox" className="w-5 h-5 text-sky-600 rounded border-slate-300 dark:border-slate-600 focus:ring-sky-500" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Antistatic (Prevención de polvo)</span>
                </label>
                <label className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-sky-50 transition-colors">
                  <input type="checkbox" className="w-5 h-5 text-sky-600 rounded border-slate-300 dark:border-slate-600 focus:ring-sky-500" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Lichen / Cement Removal (Fuertes)</span>
                </label>
                <label className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-sky-50 transition-colors">
                  <input type="checkbox" className="w-5 h-5 text-sky-600 rounded border-slate-300 dark:border-slate-600 focus:ring-sky-500" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Rust Removal (Remoción de Óxido)</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Método de Limpieza</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500/50 outline-none">
                  <option value="">Seleccionar...</option>
                  <option value="cepillo_manual">Cepillo rotatorio / Manual (Pértiga)</option>
                  <option value="robot">Robot de limpieza solar</option>
                  <option value="tractor">Tractor con brazo rotatorio</option>
                  <option value="hidrolavadora">Hidrolavadora baja presión (Aplicación química)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Calidad del Agua</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500/50 outline-none"
                  value={waterType}
                  onChange={(e) => setWaterType(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option value="osmotizada">Agua Osmotizada / Desmineralizada (Óptima)</option>
                  <option value="red">Agua de Red / Grifo (Requiere SWP)</option>
                  <option value="pozo">Agua de Pozo / Dura (Alto riesgo de cal)</option>
                </select>
              </div>
              
              {(waterType === 'red' || waterType === 'pozo') && (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 flex gap-2 items-start animate-in fade-in">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 font-medium">
                    Al usar agua dura, es indispensable la correcta dosificación de Solar Wash Protect para evitar manchas de cal en el cristal.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Ratio de Dilución y Consumo</label>
            <textarea 
              rows={2} 
              placeholder="Ej. Dilución de 2Kg de SWP en 1000L de agua. Consumo total de agua: 3000L..." 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-sky-500/50 outline-none resize-none"
            ></textarea>
          </div>
        </div>
      </section>

      
      {/* Sección 3: Ejecución y Tiempos */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">3. Ejecución y Tiempos</h3>
        </div>
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Cantidad Total de Módulos Limpiados</label>
              <input type="number" placeholder="Ej. 450" className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-sky-500/50 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Hora de Inicio (Lavado físico)</label>
              <input type="time" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-sky-500/50 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Hora de Finalización</label>
              <input type="time" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-sky-500/50 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Incidencias Operativas</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-sky-500/50 outline-none">
                <option value="ninguna">Ninguna operación fluida</option>
                <option value="atasco">Atasco / Caída del Robot</option>
                <option value="agua">Falla de suministro de agua</option>
                <option value="bateria">Descarga prematura de batería</option>
                <option value="desnivel">Desnivel crítico entre mesas</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Detalle de Incidencia (Si aplica)</label>
              <textarea rows={2} placeholder="Explique brevemente si hubo algún retraso..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-sky-500/50 outline-none resize-none"></textarea>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 4: Resultados */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">4. Resultados y Observaciones</h3>
        </div>
        <div className="p-5">
          <div className="mb-4">
            <label className="flex items-center justify-between cursor-pointer bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <div>
                  <span className="text-sm font-bold text-emerald-900">Limpieza Completada con Éxito</span>
                  <p className="text-xs text-emerald-700">Módulos limpios, sin manchas de agua, y capa protectora aplicada.</p>
                </div>
              </div>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </div>
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Observaciones Finales (Anomalías, manchas persistentes, paneles dañados)</label>
          <textarea 
            rows={3} 
            placeholder="Documente si algunos paneles ya presentaban rayones, roturas previas o manchas imposibles de remover..." 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-sky-500/50 outline-none resize-none"
          ></textarea>
        </div>
      </section>

      {/* Sección 5: Registro Fotográfico  */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Camera className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">5. Evidencia Fotográfica y Cierre</h3>
        </div>
        <div className="p-5 space-y-6">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Registro Fotográfico del Proceso</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MultiImageCategory label="Antes (Suciedad)" theme="slate" />
              <MultiImageCategory label="Productos Utilizados" theme="amber" />
              <MultiImageCategory label="Proceso (Lavado)" theme="blue" />
              <MultiImageCategory label="Después (Limpio)" theme="emerald" />
            </div>
          </div>
          
          
        </div>
      </section>
    </div>
  );
}
