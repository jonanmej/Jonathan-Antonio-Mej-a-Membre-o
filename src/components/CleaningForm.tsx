import { useState } from 'react';
import { Camera, AlertTriangle, Droplets, PenTool, CheckCircle2 } from 'lucide-react';

export default function CleaningForm() {
  const [hasDamage, setHasDamage] = useState<boolean>(false);
  const [tipoLavado, setTipoLavado] = useState<string>('');
  const [usedChemitek, setUsedChemitek] = useState<boolean>(false);
  const [otherProducts, setOtherProducts] = useState<string>('');

  return (
    <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-700 mt-6 animate-in fade-in duration-300">
      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-200 mb-6 flex gap-3 items-start">
        <Droplets className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-lg mb-1">Reporte Técnico de Limpieza Fotovoltaica</h3>
          <p className="text-sm opacity-80">Registro operativo para limpieza robotizada/motorizada.</p>
        </div>
      </div>

      {/* Sección 1: Condiciones Iniciales y del Sitio */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Sección 1: Condiciones y Parámetros</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Fecha de Operación</label>
            <input type="date" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Clima Actual</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="soleado">Soleado (Atención a temp. del panel)</option>
              <option value="parcial">Parcialmente Nublado</option>
              <option value="nublado">Nublado</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Temperatura Ambiente (°C)</label>
            <input type="number" step="0.1" placeholder="Ej. 28.5" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Inclinación de Trabajo (°)</label>
            <input type="number" placeholder="Ej. 15" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Dureza del Agua (ppm)</label>
            <input type="number" placeholder="Ej. 50" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Presión de Agua (PSI)</label>
            <input type="number" placeholder="Ej. 120" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">Tipo Principal de Suciedad (Múltiple)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Polvo / Tierra', 'Guano de aves', 'Ceniza / Hollín', 'Salitre', 'Polución industrial', 'Musgo / Líquenes'].map(type => (
                <label key={type} className="flex items-center gap-2 p-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-200">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Daños Previos en Módulos */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
          <h4 className="font-bold text-slate-800 dark:text-slate-100">Sección 2: Daños Previos en Módulos</h4>
          <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200">
            <AlertTriangle className="w-3 h-3" /> CRÍTICA PARA GARANTÍAS
          </span>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-4">
          <label className="block text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">¿Se detectaron paneles con daños previos a la limpieza?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="has_damage" 
                className="w-4 h-4 text-amber-600" 
                onChange={() => setHasDamage(false)}
                defaultChecked
              />
              <span className="text-sm font-medium">No, todo en orden</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="has_damage" 
                className="w-4 h-4 text-red-600" 
                onChange={() => setHasDamage(true)}
              />
              <span className="text-sm font-medium text-red-700">Sí, se detectaron daños</span>
            </label>
          </div>

          {hasDamage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-amber-200/50 animate-in slide-in-from-top-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Cantidad de Módulos Dañados</label>
                <input type="number" placeholder="Ej. 3" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500/50 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Tipo de Daño Preexistente</label>
                <select className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500/50 outline-none">
                  <option value="">Seleccionar...</option>
                  <option value="roto">Cristal roto / astillado</option>
                  <option value="delaminacion">Delaminación</option>
                  <option value="marco">Marco suelto / deformado</option>
                  <option value="quemadura">Quemadura de celda (Hotspot severo)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Ubicación Topológica (Identificador)</label>
                <input type="text" placeholder="Ej. Inversor 2, Mesa 4, Fila inferior, panel 12" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500/50 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Acción Preventiva Tomada</label>
                <select className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500/50 outline-none">
                  <option value="">Seleccionar...</option>
                  <option value="aislo">Se aisló/saltó el módulo durante la limpieza</option>
                  <option value="manual">Limpieza 100% manual perimetral con extrema precaución</option>
                  <option value="aborto">Se abortó limpieza en la mesa completa por seguridad</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sección 3: Equipos y Recursos de Limpieza */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Sección 3: Equipos y Recursos de Limpieza</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Método Principal de Limpieza</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="robot">Robot Autónomo / Oruga</option>
              <option value="cepillo_rotativo">Cepillo Rotativo Motorizado</option>
              <option value="manual">Manual con Pértiga Telescópica</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Marca/Modelo del Equipo</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none">
              <option value="">Seleccionar en BD...</option>
              <option value="solarcleano_f1">SolarCleano F1</option>
              <option value="sunbrush">SunBrush Mobil</option>
              <option value="karcher_isolar">Kärcher iSolar</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Tipo de Lavado</label>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none"
              value={tipoLavado}
              onChange={(e) => setTipoLavado(e.target.value)}
            >
              <option value="">Seleccionar...</option>
              <option value="seco">En seco</option>
              <option value="humedo">Húmedo</option>
              <option value="humedo_producto">Húmedo con producto</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Volumen de Agua Consumida (Galones)</label>
            <input type="number" placeholder="Ej. 400" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" />
          </div>

          {tipoLavado === 'humedo_producto' && (
            <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col gap-4 animate-in slide-in-from-top-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" 
                    checked={usedChemitek}
                    onChange={(e) => setUsedChemitek(e.target.checked)}
                  />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">¿Se utilizó producto Chemitek Solar?</span>
                </label>
                
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Otros productos aplicados</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Detergente neutro, antiespumante..." 
                    className="w-full bg-white dark:bg-slate-800 border border-blue-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" 
                    value={otherProducts}
                    onChange={(e) => setOtherProducts(e.target.value)}
                  />
                </div>
              </div>
              
              {usedChemitek && (
                <div className="animate-in slide-in-from-top-2 border-t border-blue-200 pt-3">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Volumen de Chemitek Consumido (Galones puros)</label>
                  <input type="number" step="0.1" placeholder="Ej. 1.5" className="w-full md:w-1/2 bg-white dark:bg-slate-800 border border-blue-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" />
                  <p className="text-xs text-blue-600 mt-1">Este valor descontará inventario automáticamente.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Sección 4: Ejecución y Tiempos */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Sección 4: Ejecución y Tiempos</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Cantidad Total de Módulos Limpiados</label>
            <input type="number" placeholder="Ej. 450" className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Hora de Inicio (Lavado físico)</label>
            <input type="time" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Hora de Finalización</label>
            <input type="time" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Incidencias Operativas</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none">
              <option value="ninguna">Ninguna operación fluida</option>
              <option value="atasco">Atasco / Caída del Robot</option>
              <option value="agua">Falla de suministro de agua</option>
              <option value="bateria">Descarga prematura de batería</option>
              <option value="desnivel">Desnivel crítico entre mesas</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Detalle de Incidencia (Si aplica)</label>
            <textarea rows={2} placeholder="Explique brevemente si hubo algún retraso..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"></textarea>
          </div>
        </div>
      </section>

      {/* Sección 5: Evidencia Fotográfica y Cierre */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Sección 5: Evidencia Fotográfica y Cierre</h4>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Evidencia Fotográfica de la Limpieza</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div onClick={() => window.dispatchEvent(new CustomEvent('app-upload-start', { detail: { count: 1 } }))} className="aspect-square bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer text-center p-2 relative overflow-hidden group">
              <Camera className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase">Estado Inicial</span>
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
            </div>
            <div onClick={() => window.dispatchEvent(new CustomEvent('app-upload-start', { detail: { count: 1 } }))} className="aspect-square bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer text-center p-2 relative overflow-hidden group">
              <Camera className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase">Estado Final</span>
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
            </div>
            
            {hasDamage ? (
              <div onClick={() => window.dispatchEvent(new CustomEvent('app-upload-start', { detail: { count: 1 } }))} className="aspect-square bg-red-50 border-2 border-dashed border-red-300 rounded-xl flex flex-col items-center justify-center text-red-600 hover:bg-red-100 transition-colors cursor-pointer text-center p-2">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold uppercase leading-tight">Foto Daño Preexistente</span>
              </div>
            ) : (
              <div onClick={() => window.dispatchEvent(new CustomEvent('app-upload-start', { detail: { count: 1 } }))} className="aspect-square bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 opacity-50 cursor-not-allowed text-center p-2">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold uppercase leading-tight">Sin Daños</span>
              </div>
            )}

            <div onClick={() => window.dispatchEvent(new CustomEvent('app-upload-start', { detail: { count: 1 } }))} className="aspect-square bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer text-center p-2">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold uppercase leading-tight">Equipo Operando (Opcional)</span>
            </div>
          </div>
        </div>

        
      </section>
    </div>
  );
}
