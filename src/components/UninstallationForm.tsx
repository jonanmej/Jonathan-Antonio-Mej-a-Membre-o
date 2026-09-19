import { useState } from 'react';
import { Package, ShieldAlert, CheckSquare, ZapOff, Anchor, Trash2, PenTool } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';

export default function UninstallationForm() {
  const [hasDamage, setHasDamage] = useState<boolean>(false);
  const [unknownPanels, setUnknownPanels] = useState<boolean>(false);
  const [unknownInverters, setUnknownInverters] = useState<boolean>(false);

  return (
    <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-700 mt-6 animate-in fade-in duration-300">
      <div className="flex items-start gap-3">
        <Trash2 className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-lg mb-1">Reporte Técnico de Desinstalación Fotovoltaica</h3>
          <p className="text-sm opacity-80">Registro operativo para desmontaje, reubicación o fin de vida útil. Complete la información sobre la marcha considerando posibles datos desconocidos.</p>
        </div>
      </div>

      {/* Sección 1: Evaluación Inicial y Seguridad */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Sección 1: Evaluación Inicial y Seguridad
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Motivo de la Desinstalación</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="reubicacion">Reubicación del sistema</option>
              <option value="cambio_techo">Cambio / Reparación de techo</option>
              <option value="fin_vida">Fin de vida útil (Decommissioning)</option>
              <option value="falla">Falla catastrófica / Garantía</option>
              <option value="otro">Otro motivo</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Estado Operativo al Llegar</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="encendido">Encendido / Generando (Se procedió a apagar)</option>
              <option value="apagado">Apagado / Con falla previa</option>
              <option value="desconocido">Desconocido / Abandonado</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-3 bg-rose-50/50 p-4 rounded-xl border border-rose-100">
            <h5 className="text-sm font-bold text-rose-900 mb-2">Protocolos de Seguridad Eléctrica</h5>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Protocolo LOTO (Lockout/Tagout) en tablero AC aplicado</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Protocolo LOTO en inversores y combinadores DC aplicado</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500" />
              <span className="text-sm font-semibold text-rose-900">Tensión residual DC verificada en 0V antes de desconectar MC4</span>
            </label>
          </div>
        </div>
      </section>

      {/* Sección 2: Inventario Físico a Retirar */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
          <Package className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Sección 2: Inventario Físico a Retirar
        </h4>
        
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <h5 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Módulos Solares</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Cantidad Real Encontrada (Unds)</label>
              <input type="number" placeholder="Ej. 120" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" />
            </div>
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">Marca / Modelo</label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" className="w-3 h-3 text-slate-400" checked={unknownPanels} onChange={(e) => setUnknownPanels(e.target.checked)} />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Etiqueta Ilegible</span>
                </label>
              </div>
              <input type="text" disabled={unknownPanels} placeholder={unknownPanels ? "Dato Desconocido" : "Ej. Jinko Tiger Pro"} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none disabled:bg-slate-100 disabled:text-slate-400" />
            </div>
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">Potencia Unitaria (Wp)</label>
              </div>
              <input type="number" disabled={unknownPanels} placeholder={unknownPanels ? "Desconocido" : "Ej. 540"} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none disabled:bg-slate-100 disabled:text-slate-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <h5 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Inversores y Estructura</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Cantidad de Inversores (Unds)</label>
              <input type="number" placeholder="Ej. 2" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" />
            </div>
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">Marca / Modelo de Inversor</label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" className="w-3 h-3 text-slate-400" checked={unknownInverters} onChange={(e) => setUnknownInverters(e.target.checked)} />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Etiqueta Ilegible</span>
                </label>
              </div>
              <input type="text" disabled={unknownInverters} placeholder={unknownInverters ? "Dato Desconocido" : "Ej. Huawei SUN2000"} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none disabled:bg-slate-100 disabled:text-slate-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Tipo de Estructura Encontrada</label>
              <select className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="coplanar">Coplanar al techo</option>
                <option value="triangulos">Triángulos / Inclinada</option>
                <option value="lastrada">Lastrada (Sin perforación)</option>
                <option value="seguidor">Seguidor Solar (Tracker)</option>
                <option value="hechiza">Desconocido / Fabricación Hechiza</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Material de la Estructura</label>
              <select className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="aluminio">Aluminio Anodizado</option>
                <option value="acero">Acero Galvanizado</option>
                <option value="madera">Madera (Estructura atípica)</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3: Registro de Daños Previos */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Sección 3: Registro de Daños Previos al Desmontaje
        </h4>
        
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-4">
          <label className="block text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">¿Existen paneles con daños evidentes previos al desmontaje?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="has_pre_damage" className="w-4 h-4 text-amber-600" onChange={() => setHasDamage(false)} defaultChecked />
              <span className="text-sm font-medium">No, módulos aparentemente íntegros</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="has_pre_damage" className="w-4 h-4 text-amber-600" onChange={() => setHasDamage(true)} />
              <span className="text-sm font-medium text-amber-800">Sí, hay paneles dañados</span>
            </label>
          </div>

          {hasDamage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-amber-200/50 animate-in slide-in-from-top-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Cantidad de Paneles Dañados</label>
                <input type="number" placeholder="Ej. 4" className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500/50 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Tipo de Daños en Paneles (Selección Múltiple)</label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> <span className="text-xs text-slate-700 dark:text-slate-200">Cristal Roto / Astillado</span></label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> <span className="text-xs text-slate-700 dark:text-slate-200">Delaminados (Humedad interna)</span></label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> <span className="text-xs text-slate-700 dark:text-slate-200">Quemados / Hotspots severos</span></label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> <span className="text-xs text-slate-700 dark:text-slate-200">Marco de aluminio dañado/suelto</span></label>
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-2 border-t border-amber-200/50">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Estado del Cableado Existente (DC/AC)</label>
            <select className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="reutilizable">En buen estado (Reutilizable)</option>
              <option value="quebradizo">Cristalizado / Quebradizo por el sol</option>
              <option value="quemado">Con signos de quemaduras o arco eléctrico</option>
              <option value="humedo">Inundado / Evidencia de humedad interna</option>
              <option value="desconocido">Desconocido / No aplica</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Observaciones adicionales de daños</label>
            <textarea rows={2} placeholder="Describa cualquier otra anomalía detectada antes de intervenir..." className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500/50 outline-none resize-none"></textarea>
          </div>
        </div>
      </section>

      {/* Sección 4: Estado Post-Desinstalación */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
          <Anchor className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Sección 4: Infraestructura Post-Desinstalación
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Condición de la Cubierta/Techo al Retirar</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="intacta">Intacta / Desgaste normal por sombra</option>
              <option value="ocultos">Con daños previos que estaban ocultos (óxido, roturas)</option>
              <option value="reparacion">Requiere reparación mayor antes de reinstalar</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Método de Sellado de Perforaciones/Anclajes</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="poliuretano">Sellador de Poliuretano (Sikaflex o sim.)</option>
              <option value="butilica">Cinta Butílica impermeabilizante</option>
              <option value="civil">Tapajuntas / Intervención Civil</option>
              <option value="na">No Aplica / Sistema Lastrado / Puntos intactos</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Embalaje utilizado para Paneles</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="vertical">Paletizado Vertical con Zunchos/Esquineros</option>
              <option value="horizontal">Paletizado Horizontal (Menos recomendado)</option>
              <option value="originales">Cajas Originales del fabricante</option>
              <option value="agranel">A Granel / Sin Embalaje Seguro (Alto Riesgo)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Destino de los Equipos (Paneles/Inversores)</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="almacen">Almacén del Cliente / Resguardo en sitio</option>
              <option value="traslado">Traslado Inmediato a Nuevo Sitio</option>
              <option value="reciclaje">Disposición Final / Reciclaje Ecológico</option>
            </select>
          </div>
        </div>
      </section>

      {/* Sección 5: Evidencia Fotográfica y Cierre */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Sección 5: Evidencia Fotográfica (Desinstalación)</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">Capture imágenes clave para documentar el estado inicial, las condiciones de desmontaje y cómo quedaron los equipos tras su retiro.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MultiImageCategory label="Panorámica Previa" theme="slate" />
          <MultiImageCategory label="Placas / Etiquetas" theme="slate" />
          <MultiImageCategory label="Daños Previos" theme="rose" />
          <MultiImageCategory label="Techo Sellado (Post)" theme="emerald" />
          <MultiImageCategory label="Equipos Embalados" theme="indigo" />
        </div>

        
      </section>
    </div>
  );
}
