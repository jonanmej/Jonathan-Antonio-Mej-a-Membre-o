import React, { useState } from 'react';
import { Settings, PenTool, AlertTriangle, Wind, Plane, Map, Camera, Info } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';

export default function DroneInspectionForm() {
  const [irradiance, setIrradiance] = useState<number | ''>('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-xl p-5 text-white flex items-center gap-4 shadow-lg">
        <div className="bg-blue-500/20 p-3 rounded-lg">
          <Plane className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Inspección Aérea Fotovoltaica (Drone)</h2>
          <p className="text-sm text-slate-300">Registro operativo de vuelo termográfico y visual</p>
        </div>
      </div>

      {/* Sección 1: Datos de la Misión y Cumplimiento */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">1. Datos de la Misión y Cumplimiento</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">ID de Misión / Ticket</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. MIS-2023-08-01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Piloto al Mando</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Nombre completo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Licencia / Certificado</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Número de registro aeronáutico" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Drone Utilizado</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="m300">DJI Matrice 300/350 RTK</option>
                <option value="m3t">DJI Mavic 3 Enterprise Thermal</option>
                <option value="autel">Autel EVO Max 4T</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Sensor / Cámara IR Utilizada</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="h20t">Zenmuse H20T / H20N</option>
                <option value="h30t">Zenmuse H30T</option>
                <option value="m3t_integrated">Integrada (Mavic 3T)</option>
                <option value="xt2">Zenmuse XT2</option>
                <option value="otro">Otra</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Condiciones Ambientales y Operativas */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Wind className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">2. Condiciones Ambientales y Operativas</h3>
        </div>
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Fecha / Hora de Despegue</label>
              <input type="datetime-local" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Coordenadas de Despegue (GPS)</label>
              <div className="flex gap-2">
                <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Lat, Lng" />
                <button type="button" className="bg-slate-200 hover:bg-slate-300 text-slate-700 dark:text-slate-200 px-3 rounded-xl transition-colors">
                  <Map className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Velocidad del Viento (m/s)</label>
              <input type="number" step="0.1" min="0" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 3.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Temperatura Ambiente (°C)</label>
              <input type="number" step="0.1" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 28.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado Baterías (Inicio %)</label>
              <input type="number" min="0" max="100" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado Baterías (Fin %)</label>
              <input type="number" min="0" max="100" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 25" />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">Irradiancia Solar en Plano (W/m²) *</label>
            <input 
              type="number" 
              value={irradiance}
              onChange={(e) => setIrradiance(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full md:w-1/2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none font-medium" 
              placeholder="Medida en tierra (Ej. 850)" 
              required
            />
            {typeof irradiance === 'number' && irradiance < 600 && (
              <div className="mt-3 bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-lg flex gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">Atención: La irradiancia es baja ({irradiance} W/m²). Los resultados de la termografía podrían no ser concluyentes según norma IEC 62446-3 (Se recomiendan &gt;600 W/m²).</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sección 3: Parámetros de Vuelo Térmico */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">3. Parámetros de Vuelo Térmico (IR)</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Altitud de Vuelo AGL (Metros)</label>
              <input type="number" step="0.1" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 25" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Velocidad de Vuelo (m/s)</label>
              <input type="number" step="0.1" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Solape Frontal (%)</label>
              <input type="number" min="0" max="100" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 80" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Solape Lateral (%)</label>
              <input type="number" min="0" max="100" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 70" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">GSD Térmico Estimado (cm/px)</label>
              <input type="number" step="0.1" className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 3.2" />
            </div>
          </div>
        </div>
      </section>

      {/* Sección 4: Hallazgos Críticos Directos en Campo */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">4. Alertas Tempranas en Vuelo</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">¿Se detectaron problemas críticos evidentes en la pantalla durante el vuelo?</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-rose-600 rounded border-slate-300 dark:border-slate-600 focus:ring-rose-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Strings completos apagados (Falla de conexión/fusible)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-rose-600 rounded border-slate-300 dark:border-slate-600 focus:ring-rose-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Inversores aparentemente detenidos (Zonas frías masivas)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-rose-600 rounded border-slate-300 dark:border-slate-600 focus:ring-rose-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Daño físico catastrófico visual (Paneles volados, vandalismo, incendio)</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Ubicación / ID de los bloques afectados (Opcional)</label>
            <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500/50 outline-none" placeholder="Ej. Bloque 4, Inversor 12 o Coordenadas aprox." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Notas Adicionales de Vuelo</label>
            <textarea rows={3} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none" placeholder="Interferencias, aves, sombras atípicas..."></textarea>
          </div>
        </div>
      </section>

      {/* Sección 5: Evidencia Fotográfica */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Camera className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">5. Evidencia Fotográfica de Respaldo</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MultiImageCategory label="Pantalla Control (Patrón Vuelo)" theme="slate" />
            <MultiImageCategory label="Estación Met. / Piranómetro" theme="blue" />
            <MultiImageCategory label="Hallazgos Visuales Terreno" theme="rose" />
            <MultiImageCategory label="Drone Despegando" theme="slate" />
          </div>
        </div>
      </section>

    </div>
  );
}
