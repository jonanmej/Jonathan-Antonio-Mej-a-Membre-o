import React, { useState } from 'react';
import { Settings, PenTool, CheckCircle, AlertCircle, Wrench, ShieldAlert } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';

export default function ReinstallationForm() {
  const [mc4Confirmed, setMc4Confirmed] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-xl p-5 text-white flex items-center gap-4 shadow-lg">
        <div className="bg-white/20 p-3 rounded-lg">
          <Wrench className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Reporte de Reinstalación Fotovoltaica</h2>
          <p className="text-sm text-slate-300">Montaje post-resguardo o reubicación</p>
        </div>
      </div>

      {/* Sección 1: Contexto de Reubicación y Sitio */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">1. Contexto de Reubicación y Sitio</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Tipo de Reubicación</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="mismo_sitio">Mismo sitio original (Post-remodelación)</option>
                <option value="nueva_ubicacion">Nueva ubicación geográfica</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Tipo de Cubierta Actual</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="chapa_trapezoidal">Chapa trapezoidal</option>
                <option value="kr18">Chapa engargolada (KR-18)</option>
                <option value="losa_concreto">Losa de concreto</option>
                <option value="suelo">Estructura en suelo / Carport</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Condición Climática</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="soleado">Soleado / Despejado</option>
                <option value="nublado">Parcialmente Nublado</option>
                <option value="lluvia">Lluvia ligera</option>
                <option value="viento">Viento fuerte</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Temperatura Ambiente (°C)</label>
              <input type="number" step="0.1" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 28.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Inspección de Equipos Post-Almacenaje (Crítico) */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">2. Inspección Post-Almacenaje</h3>
        </div>
        <div className="p-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
            <p className="text-sm text-amber-800 font-medium">Evaluación del estado de los equipos al salir de resguardo para deslindar responsabilidades por daños previos a la reinstalación.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado de Módulos (Bodega)</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="sin_danos">Sin daños / Condición original</option>
                <option value="rayones">Rayones estéticos en marco/vidrio</option>
                <option value="critico">Cristal roto o marco deformado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Cantidad de Módulos Dañados</label>
              <input type="number" min="0" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado de Inversores (Bodega)</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="optimo">Óptimo</option>
                <option value="golpes">Golpes en chasis</option>
                <option value="humedad">Rastros de humedad o fauna nociva</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado de Estructura Original</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="rectos">Rieles rectos y sanos</option>
                <option value="deformados">Rieles deformados</option>
                <option value="corrosion">Corrosión detectada</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Observaciones Post-Almacenaje</label>
              <textarea rows={2} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none" placeholder="Ej. Pallet mojado, conectores aplastados..."></textarea>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3: Materiales Reutilizados vs. Nuevos */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">3. Materiales Reutilizados vs. Nuevos</h3>
        </div>
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Origen de Módulos</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="reutilizados">100% Reutilizados</option>
                <option value="mezcla">Mezcla (Reutilizados + Nuevos)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Origen de Estructura</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="reutilizada">100% Reutilizada</option>
                <option value="tramos_nuevos">Tramos nuevos añadidos</option>
                <option value="nueva">100% Nueva</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Origen de Cableado CD</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="reutilizado">100% Reutilizado (Validar aislamiento)</option>
                <option value="tramos_nuevos">Tramos nuevos intercalados</option>
                <option value="nuevo">100% Nuevo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Canalización</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="reutilizada">Tubería reutilizada</option>
                <option value="nueva">Tubería nueva instalada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Sellado de Perforaciones (Anclajes)</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="poliuretano">Poliuretano nuevo aplicado</option>
                <option value="butilica">Cinta butílica nueva</option>
                <option value="na">No aplica (Lastrado / Suelo)</option>
              </select>
            </div>
          </div>

          <div className={`p-4 rounded-xl border-2 transition-colors cursor-pointer flex gap-3 items-start ${mc4Confirmed ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-200'}`} onClick={() => setMc4Confirmed(!mc4Confirmed)}>
            <div className="mt-0.5">
              <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded border-slate-300 dark:border-slate-600 focus:ring-emerald-500" checked={mc4Confirmed} readOnly />
            </div>
            <div>
              <p className={`font-bold text-sm ${mc4Confirmed ? 'text-emerald-800' : 'text-red-800'}`}>VALIDACIÓN CRÍTICA OBLIGATORIA (LOTO & FIRE RISK)</p>
              <p className={`text-xs mt-1 ${mc4Confirmed ? 'text-emerald-700' : 'text-red-700'}`}>Confirmo que se instalaron y poncharon conectores MC4 nuevos en todas las uniones de los strings donde los originales fueron cortados o expuestos. Reutilizar MC4 está estrictamente prohibido.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 4: Nueva Configuración del Arreglo */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">4. Configuración del Arreglo Reinstalado</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Orientación Principal (Acimut)</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="sur">Sur (Óptima)</option>
                <option value="sureste">Sureste / Suroeste</option>
                <option value="este">Este / Oeste</option>
                <option value="coplanar">Coplanar múltiple</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Inclinación (°)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 15" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Total Módulos Instalados</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Uds." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Cantidad de Strings (Cadenas)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Uds." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Configuración Detallada</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. 2 strings de 12 paneles y 1 string de 10" />
            </div>
          </div>
        </div>
      </section>

      {/* Sección 5: Pruebas de Comisionamiento (Re-encendido) */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">5. Pruebas de Comisionamiento</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Voltaje Voc Strings (Vcd)</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. ST1: 650V, ST2: 648V" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Resistencia Aislamiento (MΩ)</label>
              <input type="number" step="0.1" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Vital para cables reutilizados" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Resistencia a Tierra (Ω)</label>
              <input type="number" step="0.1" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="< 10Ω" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Voltaje Inyección (Vca)</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. L1-L2: 225V" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado Inversor</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="generando">Generando a la red</option>
                <option value="standby">Standby (Esperando ventana)</option>
                <option value="falla">Falla / Alarma</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Código Falla (Si aplica)</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Ej. N/A o Código de error" />
            </div>
          </div>
        </div>
      </section>

      {/* Sección 6: Evidencia Fotográfica */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">6. Evidencia Fotográfica</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MultiImageCategory label="Equipos Bodega / Pre-Montaje" theme="slate" />
            <MultiImageCategory label="Anclajes / Sellados Nuevos" theme="slate" />
            <MultiImageCategory label="Conectores MC4 Nuevos" theme="emerald" />
            <MultiImageCategory label="Tableros CA Reconectados" theme="slate" />
            <MultiImageCategory label="Arreglo Terminado" theme="blue" />
            <MultiImageCategory label="Monitoreo (En línea)" theme="indigo" />
          </div>
        </div>
      </section>
    </div>
  );
}
