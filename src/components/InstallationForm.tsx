import { useState } from 'react';
import { Camera, CheckCircle2, PenTool } from 'lucide-react';
import QrScannerInput from './QrScannerInput';

export default function InstallationForm() {
  return (
    <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
      <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 mb-6">
        <h3 className="font-bold text-lg mb-1">Reporte Técnico de Instalación Fotovoltaica</h3>
        <p className="text-sm opacity-80">Por favor completa todos los campos técnicos para garantizar la calidad del as-built.</p>
      </div>

      {/* Sección 1: Datos del Sitio y Condiciones */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Sección 1: Datos del Sitio y Condiciones</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Fecha y Hora de Finalización</label>
            <input type="datetime-local" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Condiciones Climáticas</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="soleado">Soleado</option>
              <option value="parcial">Parcialmente Nublado</option>
              <option value="nublado">Nublado</option>
              <option value="lluvia">Lluvia</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Temperatura Ambiente (°C)</label>
            <input type="number" step="0.1" placeholder="Ej. 28.5" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Tipo de Cubierta/Techo</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="chapa">Chapa trapezoidal</option>
              <option value="losa">Losa de hormigón</option>
              <option value="asfaltica">Teja asfáltica</option>
              <option value="barro">Teja de barro</option>
              <option value="suelo">Suelo</option>
              <option value="carport">Carport</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Azimut (Orientación en °)</label>
            <input type="number" placeholder="Ej. 180" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Inclinación (Tilt en °)</label>
            <input type="number" step="0.1" placeholder="Ej. 15" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
        </div>
      </section>

      {/* Sección 2: Inventario Físico Instalado */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Sección 2: Inventario Físico Instalado</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Marca y Modelo de Módulos</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <option value="">Seleccionar en BD...</option>
              <option value="jinko540">Jinko Tiger Pro 540W</option>
              <option value="longi450">LONGi Hi-MO 4 450W</option>
              <option value="canadian600">Canadian Solar HiKu7 600W</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Potencia Unitaria del Módulo (Wp)</label>
            <input type="number" placeholder="Ej. 540" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Cantidad Total de Módulos (Unds)</label>
            <input type="number" placeholder="Ej. 24" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Marca y Modelo de Inversor(es)</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <option value="">Seleccionar en BD...</option>
              <option value="huawei10k">Huawei SUN2000-10KTL</option>
              <option value="sma15k">SMA Sunny Tripower 15000TL</option>
              <option value="fronius10k">Fronius Symo 10.0-3</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <QrScannerInput label="Número(s) de Serie de Inversor(es)" placeholder="Escanea o escribe separados por coma..." theme="emerald" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Tipo de Estructura</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="coplanar">Coplanar</option>
              <option value="triangulos">Triángulos inclinados</option>
              <option value="hincada">Hincada</option>
              <option value="lastrada">Lastrada</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Material de Estructura</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="aluminio">Aluminio anodizado</option>
              <option value="acero">Acero galvanizado en caliente</option>
            </select>
          </div>
        </div>
      </section>

      {/* Sección 3: Configuración Eléctrica */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Sección 3: Configuración Eléctrica</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Cantidad de Cadenas (Strings)</label>
            <input type="number" placeholder="Ej. 2" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Módulos por String</label>
            <input type="text" placeholder="Ej. String 1: 12, String 2: 12" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Calibre Cableado DC</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="4mm">4 mm² (12 AWG)</option>
              <option value="6mm">6 mm² (10 AWG)</option>
              <option value="10mm">10 mm² (8 AWG)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Calibre Cableado AC principal</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="10awg">10 AWG</option>
              <option value="8awg">8 AWG</option>
              <option value="6awg">6 AWG</option>
              <option value="4awg">4 AWG</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Longitud aprox. AC (m)</label>
            <input type="number" step="0.1" placeholder="Ej. 15.5" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Protección Termomagnética AC (A)</label>
            <input type="number" placeholder="Ej. 40" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Sistema de Puesta a Tierra</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="pica">Pica independiente</option>
              <option value="red">Conectado a red existente</option>
              <option value="malla">Malla de tierra</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Calibre Cable de Tierra</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="10awg_bare">10 AWG desnudo</option>
              <option value="8awg_bare">8 AWG desnudo</option>
              <option value="6awg_bare">6 AWG desnudo</option>
            </select>
          </div>
        </div>
      </section>

      {/* Sección 4: Pruebas de Comisionamiento y Mediciones */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Sección 4: Pruebas y Mediciones (Comisionamiento)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Voc por String (VDC)</label>
            <input type="text" placeholder="Ej. S1: 450V, S2: 452V" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Isc por String (ADC) - Opcional</label>
            <input type="text" placeholder="Ej. S1: 12.5A, S2: 12.4A" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Voltaje AC Fase-Fase (VAC)</label>
            <input type="number" step="0.1" placeholder="Ej. 240.5" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Voltaje AC Fase-Neutro (VAC)</label>
            <input type="number" step="0.1" placeholder="Ej. 120.2" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Resistencia Puesta a Tierra (Ω)</label>
            <input type="number" step="0.1" placeholder="Ej. 15.2" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Resistencia Aislamiento DC (MΩ)</label>
            <input type="number" step="0.1" placeholder="Ej. >500" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
        </div>
      </section>

      {/* Sección 5: Verificación Final y Evidencia */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Sección 5: Verificación Final y Evidencia</h4>
        
        {/* Checklists */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Torque verificado en borneras AC/DC y grapas</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Monitoreo/Internet conectado exitosamente (Datalogger verde)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Etiquetado de Seguridad instalado (Advertencia DC/AC)</span>
          </label>
        </div>

        {/* Evidencia Fotográfica */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 mt-4">Evidencia Fotográfica de la Instalación</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div onClick={() => window.dispatchEvent(new CustomEvent('app-upload-start', { detail: { count: 1 } }))} className="aspect-square bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer text-center p-2">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold uppercase">Paneles</span>
            </div>
            <div onClick={() => window.dispatchEvent(new CustomEvent('app-upload-start', { detail: { count: 1 } }))} className="aspect-square bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer text-center p-2">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold uppercase">Estructura</span>
            </div>
            <div onClick={() => window.dispatchEvent(new CustomEvent('app-upload-start', { detail: { count: 1 } }))} className="aspect-square bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer text-center p-2">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold uppercase">Inversor</span>
            </div>
            <div onClick={() => window.dispatchEvent(new CustomEvent('app-upload-start', { detail: { count: 1 } }))} className="aspect-square bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer text-center p-2">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold uppercase">Tablero AC</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Comentarios Adicionales (Irregularidades, recomendaciones)</label>
          <textarea rows={3} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none resize-none"></textarea>
        </div>

        
      </section>
    </div>
  );
}
