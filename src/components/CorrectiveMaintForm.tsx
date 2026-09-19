import { useState } from 'react';
import { Camera, AlertTriangle, PenTool, Wrench, Clock, Activity, Zap, Server } from 'lucide-react';
import QrScannerInput from './QrScannerInput';
import MultiImageCategory from './MultiImageCategory';

export default function CorrectiveMaintForm() {
  const [hasReplacedParts, setHasReplacedParts] = useState(false);

  return (
    <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-700 mt-6 animate-in fade-in duration-300">
      <div className="bg-rose-50 text-rose-900 p-4 rounded-xl border border-rose-200 mb-6 flex gap-3 items-start">
        <Wrench className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-lg mb-1">Reporte de Mantenimiento Correctivo</h3>
          <p className="text-sm opacity-80">Documentación de diagnóstico, resolución de fallas y trazabilidad de garantías (RMA).</p>
        </div>
      </div>

      {/* Sección 1: Detección y Diagnóstico Inicial */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
          <AlertTriangle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <h4 className="font-bold text-slate-800 dark:text-slate-100">Sección 1: Detección y Diagnóstico Inicial</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Fuente del Reporte</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="noc">Centro de Monitoreo (NOC)</option>
              <option value="scada">SCADA Local</option>
              <option value="cliente">Reportado por Cliente (en sitio)</option>
              <option value="inspeccion">Hallazgo en Inspección Rutinaria</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Estado Operativo al Llegar</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="fault">Apagado total (Fault)</option>
              <option value="derating">Derateo (Potencia limitada)</option>
              <option value="intermitente">Operación intermitente / Reinicios</option>
              <option value="comms">Falla de comunicación</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Código de Error / Alarma (Display/Portal)</label>
            <input type="text" placeholder="Ej. Arc Fault, Err004..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Hora de Llegada al Sitio</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="datetime-local" className="w-full pl-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Análisis de Falla y Causa Raíz */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
          <Activity className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <h4 className="font-bold text-slate-800 dark:text-slate-100">Sección 2: Análisis de Falla y Causa Raíz</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Subsistema Afectado</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="inversor">Inversor / Convertidor</option>
              <option value="modulos">Módulo(s) Fotovoltaico(s)</option>
              <option value="dc">Cableado / Conectores DC (MC4)</option>
              <option value="ac">Tablero AC / Protecciones</option>
              <option value="comms">Sistema de Monitoreo / Datalogger</option>
              <option value="trafo">Transformador / Subestación</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Tipo de Daño Visual</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none" multiple size={3}>
              <option value="quemadura">Quemadura / Fogonazo</option>
              <option value="rotura">Rotura Mecánica / Cristal roto</option>
              <option value="corrosion">Sulfatación / Corrosión</option>
              <option value="fauna">Daño por fauna (Roedores, Aves)</option>
              <option value="humedad">Inundación / Humedad interna</option>
              <option value="ninguno">Sin daño visual aparente</option>
            </select>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Mantenga presionada la tecla Ctrl/Cmd para selección múltiple</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Causa Raíz Probable</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="sobretension">Descarga Atmosférica / Sobretensión</option>
              <option value="doa">Defecto de Fábrica (DOA / Falla prematura)</option>
              <option value="fatiga">Envejecimiento / Fatiga Térmica</option>
              <option value="vandalismo">Vandalismo / Robo</option>
              <option value="instalacion">Error de instalación previa (Mala praxis)</option>
              <option value="sombra">Sombreado severo (Hotspot)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Descripción Técnica del Diagnóstico</label>
            <textarea rows={3} placeholder="Explique las pruebas realizadas para llegar a esta conclusión..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none resize-none"></textarea>
          </div>
        </div>
      </section>

      {/* Sección 3: Acciones Correctivas y Trazabilidad */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
          <Server className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <h4 className="font-bold text-slate-800 dark:text-slate-100">Sección 3: Acciones Correctivas y Trazabilidad (RMA)</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Acción Correctiva Principal</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="reparacion">Reparación In-situ (soldadura, crimpado)</option>
              <option value="reemplazo">Reemplazo de componente (RMA)</option>
              <option value="firmware">Actualización de Firmware / Software</option>
              <option value="parametros">Ajuste de parámetros de red</option>
              <option value="limpieza">Limpieza profunda / Dieléctrico</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Descripción de la Reparación</label>
            <textarea rows={2} placeholder="Procedimiento realizado para solventar el fallo..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none resize-none"></textarea>
          </div>

          <div className="md:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-100 mb-3">¿Se reemplazaron piezas o equipos?</label>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-800 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50">
                <input type="radio" name="replaced_parts" className="w-4 h-4 text-rose-600" onChange={() => setHasReplacedParts(false)} defaultChecked />
                <span className="text-sm font-medium">No (Reparado sin repuestos)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-800 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50">
                <input type="radio" name="replaced_parts" className="w-4 h-4 text-rose-600" onChange={() => setHasReplacedParts(true)} />
                <span className="text-sm font-medium">Sí (Requiere trazabilidad)</span>
              </label>
            </div>
          </div>

          {hasReplacedParts && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-rose-50/50 border border-rose-100 p-4 rounded-xl animate-in slide-in-from-top-2">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Nombre / Modelo del Componente Reemplazado</label>
                <input type="text" placeholder="Ej. Ventilador SUN2000, Tarjeta Comms V2..." className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none" />
              </div>
              
              <div>
                <QrScannerInput label="N/S de la Pieza RETIRADA (Dañada)" theme="rose" placeholder="Escanear pieza vieja..." />
              </div>
              
              <div>
                <QrScannerInput label="N/S de la Pieza NUEVA (Instalada)" theme="emerald" placeholder="Escanear pieza de almacén..." />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sección 4: Pruebas de Verificación Post-Reparación */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
          <Zap className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <h4 className="font-bold text-slate-800 dark:text-slate-100">Sección 4: Pruebas de Verificación Post-Reparación</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Voltaje de Operación DC (VDC)</label>
            <input type="number" step="0.1" placeholder="Ej. 650.4" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Voltaje de Red AC (VAC)</label>
            <input type="number" step="0.1" placeholder="Ej. 242.0" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Potencia/Corriente Inyectada</label>
            <input type="text" placeholder="Ej. 12kW / 15A" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Estado de LEDs / Display</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="verde">Verde fijo (Normal / Inyectando)</option>
              <option value="parpadeo">Parpadeo (Conectando a red)</option>
              <option value="rojo">Rojo (Falla persistente)</option>
            </select>
          </div>
          <div className="md:col-span-2 mt-2">
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50">
              <input type="checkbox" className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Se aplicó actualización de Firmware recomendada por fabricante</span>
            </label>
          </div>
        </div>
      </section>

      {/* Sección 5: Evidencia Fotográfica y Cierre */}
      <section className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">Sección 5: Dossier de Falla y Evidencia</h4>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Registro Fotográfico Obligatorio (RMA)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MultiImageCategory label="Falla / Pantalla (Error)" theme="slate" />
            <MultiImageCategory label="Componente Dañado" theme="slate" />
            
            <MultiImageCategory label="Pieza Nueva Instalada" theme="emerald" disabled={!hasReplacedParts} />

            <MultiImageCategory label="Equipo Operando" theme="slate" />
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500" />
              <span className="text-sm font-bold text-blue-900">Verificación Cloud: Confirmo que el equipo ya se visualiza en línea y exportando en el portal de monitoreo.</span>
            </label>
          </div>

          
      </div></section>
    </div>
  );
}
