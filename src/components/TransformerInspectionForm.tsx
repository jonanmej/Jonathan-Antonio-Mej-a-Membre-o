import React, { useState } from 'react';
import { Settings, PenTool, ShieldAlert, Thermometer, Activity, Camera, Zap, AlertTriangle, QrCode } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';

export default function TransformerInspectionForm() {
  const [transformerType, setTransformerType] = useState('');
  const [silicaState, setSilicaState] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-xl p-5 text-white flex items-center gap-4 shadow-lg">
        <div className="bg-amber-500/20 p-3 rounded-lg">
          <Zap className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Mantenimiento de Transformador</h2>
          <p className="text-sm text-slate-300">Inspección de media/alta tensión (Seco y Aceite)</p>
        </div>
      </div>

      {/* Sección 1: Identificación y Seguridad (LOTO) */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">1. Identificación y Seguridad (LOTO)</h3>
        </div>
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">ID del Transformador / Escáner QR</label>
              <div className="flex gap-2">
                <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Ingresar o escanear placa..." />
                <button type="button" className="bg-slate-200 hover:bg-slate-300 text-slate-700 dark:text-slate-200 px-3 rounded-xl transition-colors">
                  <QrCode className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Tipo de Transformador</label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none"
                value={transformerType}
                onChange={(e) => setTransformerType(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                <option value="aceite">Sumergido en Aceite</option>
                <option value="seco">Tipo Seco (Resina epóxica)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Capacidad Nominal (kVA)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Ej. 1500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Voltajes (Pri / Sec)</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Ej. 34.5 kV / 480 V" />
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
            <p className="text-sm font-bold text-red-800">PROCEDIMIENTO CRÍTICO DE SEGURIDAD</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-red-600 rounded border-slate-300 dark:border-slate-600 focus:ring-red-500" />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Confirmo apertura de seccionadores, desenergización total y bloqueo físico (LOTO).</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-red-600 rounded border-slate-300 dark:border-slate-600 focus:ring-red-500" />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Confirmo instalación de tierras temporales en terminales de media tensión.</span>
            </label>
          </div>
        </div>
      </section>

      {/* Sección 2: Inspección Visual y Física */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">2. Inspección Visual y Física</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transformerType !== 'seco' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Nivel de Aceite (Indicador visual)</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none">
                    <option value="">Seleccionar...</option>
                    <option value="normal">Normal (Centro de la mirilla)</option>
                    <option value="bajo">Bajo (Requiere relleno)</option>
                    <option value="alto">Alto (Peligro de sobrepresión)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado de Sílica Gel (Respiradero)</label>
                  <select 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none"
                    value={silicaState}
                    onChange={(e) => setSilicaState(e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="naranja">Naranja / Amarilla (Activa / Seca)</option>
                    <option value="blanca">Blanca / Transparente (Saturada)</option>
                    <option value="azul">Azul (Activa - *En desuso normativo*)</option>
                    <option value="rosa">Rosa (Saturada - Sílica antigua)</option>
                    <option value="verde">Verde (Saturada - Sílica ecológica)</option>
                  </select>
                </div>
                {(silicaState === 'blanca' || silicaState === 'rosa' || silicaState === 'verde') && (
                  <div className="md:col-span-2 bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-lg flex gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">Alerta Preventiva: La sílica gel se reporta como saturada. Se ha generado una notificación automática al área de mantenimiento para programar el reemplazo del material absorbente de humedad.</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Fugas en Boquillas / Radiadores</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none">
                    <option value="sin_fugas">Sin fugas detectadas</option>
                    <option value="transpiracion">Fugas leves (transpiración de empaques)</option>
                    <option value="goteo">Fugas graves (goteo activo)</option>
                  </select>
                </div>
              </>
            )}
            
            <div className={transformerType === 'seco' ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado de Puesta a Tierra (Chasis/Neutro)</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="fija">Firme y sin corrosión (Limpia)</option>
                <option value="floja">Conexión mecánica floja</option>
                <option value="corroida">Corroída (Requiere limpieza)</option>
                <option value="rota">Cable o terminal rota (Peligro crítico)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3: Pruebas Dieléctricas y Físico-Químicas */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">3. Pruebas Dieléctricas y Físicas</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transformerType !== 'seco' && (
              <div className="md:col-span-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 text-amber-600 rounded border-slate-300 dark:border-slate-600 focus:ring-amber-500 cursor-pointer" />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Se tomó muestra de aceite dieléctrico (Válvula inferior) para laboratorio DGA / Físico-químico.</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                {transformerType === 'seco' ? 'Temp. Devanados (°C)' : 'Temp. Aceite (°C)'}
              </label>
              <input type="number" step="0.1" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Indicador del termómetro" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Limpieza de Aisladores / Boquillas</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="realizada">Limpieza ejecutada (Trapo y solvente dieléctrico)</option>
                <option value="no_necesaria">No necesaria (Limpio)</option>
                <option value="pendiente">Pendiente (Suciedad adherida dura)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 4: Pruebas Eléctricas de Campo */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">4. Pruebas Eléctricas de Campo</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Megger (Pri - Tierra) MΩ/GΩ</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Lectura 1 Minuto" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Megger (Sec - Tierra) MΩ/GΩ</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Lectura 1 Minuto" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Megger (Pri - Sec) MΩ/GΩ</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Lectura 1 Minuto" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Relación de Transformación (TTR)</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none">
                <option value="">Seleccionar resultado...</option>
                <option value="pasa">PASA (Desviación menor al 0.5%)</option>
                <option value="falla">FALLA (Desviación mayor al 0.5%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Resistencia de Devanados (mΩ)</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none" placeholder="Desbalance entre fases < 5%" />
            </div>
          </div>
        </div>
      </section>

      {/* Sección 5: Evidencia Fotográfica */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Camera className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">5. Evidencias y Termografía</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MultiImageCategory label="Placa de Datos (Nameplate)" theme="slate" />
            <MultiImageCategory label="Termografía (Pre-apagado)" theme="rose" />
            <MultiImageCategory label="Conexiones de Media/Baja Tensión" theme="blue" />
            {transformerType !== 'seco' && (
              <MultiImageCategory label="Radiadores / Válvulas / Silica" theme="amber" />
            )}
            <MultiImageCategory label="Panorama General Trafo" theme="emerald" />
          </div>
        </div>
      </section>
    </div>
  );
}
