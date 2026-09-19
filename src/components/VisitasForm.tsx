import React, { useState } from 'react';
import { Stethoscope, AlertTriangle, Search, Map, Wrench, Camera, PenTool, ClipboardList, ShieldAlert, CheckCircle2 } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';

interface VisitasFormProps {
  serviceType: string;
}

export default function VisitasForm({ serviceType }: VisitasFormProps) {
  const [systemType, setSystemType] = useState('');

  const getServiceInfo = () => {
    switch (serviceType) {
      case 'vis_fallas':
        return {
          title: 'Visita Técnica: Diagnóstico de Fallas',
          desc: 'Evaluación y diagnóstico de equipos o instalaciones defectuosas.',
          icon: <Stethoscope className="w-8 h-8 text-white" />,
          color: 'bg-indigo-600',
          lightColor: 'bg-indigo-500',
          textColor: 'text-indigo-100'
        };
      case 'vis_emerg':
        return {
          title: 'Visita Técnica: Atención de Emergencia',
          desc: 'Respuesta inmediata a situaciones críticas o peligrosas en sitio.',
          icon: <AlertTriangle className="w-8 h-8 text-white" />,
          color: 'bg-rose-600',
          lightColor: 'bg-rose-500',
          textColor: 'text-rose-100'
        };
      case 'vis_insp':
        return {
          title: 'Visita Técnica: Inspección Previa',
          desc: 'Levantamiento de información y viabilidad para futuros trabajos.',
          icon: <Search className="w-8 h-8 text-white" />,
          color: 'bg-violet-600',
          lightColor: 'bg-violet-500',
          textColor: 'text-violet-100'
        };
      default:
        return {
          title: 'Visita Técnica',
          desc: 'Reporte general de visita.',
          icon: <ClipboardList className="w-8 h-8 text-white" />,
          color: 'bg-slate-600',
          lightColor: 'bg-slate-500',
          textColor: 'text-slate-100'
        };
    }
  };

  const info = getServiceInfo();
  const theme = serviceType === 'vis_emerg' ? 'rose' : (serviceType === 'vis_insp' ? 'indigo' : 'indigo');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${info.color} text-white p-5 rounded-2xl flex items-center justify-between shadow-lg`}>
        <div>
          <h2 className="text-xl font-bold">{info.title}</h2>
          <p className={`text-sm ${info.textColor} mt-1`}>
            {info.desc}
          </p>
        </div>
        <div className={`${info.lightColor} p-3 rounded-xl`}>
          {info.icon}
        </div>
      </div>

      {/* Sección 1: Datos del Sitio y Sistema */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Map className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">1. Contexto de la Visita</h3>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Tipo de Instalación / Área</label>
              <select 
                className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-${theme}-500/50 outline-none`}
                value={systemType}
                onChange={(e) => setSystemType(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                <option value="fv_techo">Planta Fotovoltaica (Techo)</option>
                <option value="fv_suelo">Planta Fotovoltaica (Suelo)</option>
                <option value="cuarto_electrico">Cuarto Eléctrico / Inversores</option>
                <option value="estructura">Estructuras / Obra Civil</option>
                <option value="hfo">Zona de Motores / HFO</option>
                <option value="gps">Flota / Vehículos GPS</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Contacto en Sitio</label>
              <input type="text" placeholder="Nombre de quien recibe al técnico" className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-${theme}-500/50 outline-none`} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Motivo Inicial Reportado (Según solicitud)</label>
            <textarea 
              rows={2} 
              placeholder="Describa el motivo por el cual se programó esta visita..." 
              className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-${theme}-500/50 outline-none resize-none`}
            ></textarea>
          </div>
        </div>
      </section>

      {/* Sección 2: Desarrollo según el tipo de servicio */}
      {serviceType === 'vis_fallas' && (
        <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">2. Diagnóstico de Falla</h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Equipos Afectados</label>
              <input type="text" placeholder="Ej. Inversor #3 (SMA Core 1), String 5..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500/50 outline-none" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Tipo de Falla Detectada</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500/50 outline-none">
                  <option value="">Seleccionar...</option>
                  <option value="electrica">Falla Eléctrica (Corto, Sobretensión, etc.)</option>
                  <option value="comunicaciones">Falla de Comunicaciones / Monitoreo</option>
                  <option value="mecanica">Falla Mecánica / Estructural</option>
                  <option value="configuracion">Problema de Configuración / Software</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado de Operación</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500/50 outline-none">
                  <option value="">Seleccionar...</option>
                  <option value="fuera_servicio">Totalmente Fuera de Servicio</option>
                  <option value="parcial">Operación Parcial / Degradada</option>
                  <option value="operativo">Operativo (Falla Intermitente)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Descripción Técnica del Diagnóstico</label>
              <textarea 
                rows={3} 
                placeholder="Detalle las mediciones realizadas, códigos de error en pantalla, pruebas ejecutadas..." 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none"
              ></textarea>
            </div>
          </div>
        </section>
      )}

      {serviceType === 'vis_emerg' && (
        <section className="bg-white dark:bg-slate-800 rounded-2xl border border-rose-200 shadow-sm overflow-hidden animate-in fade-in">
          <div className="px-5 py-4 border-b border-rose-100 bg-rose-50 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="font-semibold text-rose-900">2. Reporte de Emergencia</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Nivel de Riesgo a la Llegada</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500/50 outline-none">
                  <option value="">Seleccionar...</option>
                  <option value="critico">Crítico (Peligro inminente, incendio, riesgo vital)</option>
                  <option value="alto">Alto (Daño material progresivo, corto franco)</option>
                  <option value="medio">Medio (Instalación inestable, riesgo acotado)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Acciones de Contención (Inmediatas)</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500/50 outline-none">
                  <option value="">Seleccionar...</option>
                  <option value="desconexion_total">Desconexión Total del Sistema</option>
                  <option value="aislamiento">Aislamiento de la Zona Afectada</option>
                  <option value="extincion">Uso de extintores / PVSTOP</option>
                  <option value="acordonamiento">Acordonamiento del área</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Cronología de los Hechos y Daños Observados</label>
              <textarea 
                rows={3} 
                placeholder="Describa el estado exacto al llegar, cómo se encontraba la instalación y qué componentes sufrieron daños severos..." 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 outline-none resize-none"
              ></textarea>
            </div>
            
            <label className="flex items-start gap-3 p-3 bg-rose-50/50 rounded-xl border border-rose-200 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-rose-600 rounded border-slate-300 dark:border-slate-600 focus:ring-rose-500 mt-0.5" />
              <div>
                <span className="text-sm font-bold text-rose-900 block">Sitio Seguro al Retirarse</span>
                <span className="text-xs text-rose-700">Se mitigó el peligro inmediato y se dejó el área en condiciones seguras (aunque inoperativa).</span>
              </div>
            </label>
          </div>
        </section>
      )}

      {serviceType === 'vis_insp' && (
        <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-violet-600" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">2. Levantamiento de Información</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Aspectos Evaluados</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-violet-600 rounded border-slate-300 dark:border-slate-600 focus:ring-violet-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Accesos y Logística</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-violet-600 rounded border-slate-300 dark:border-slate-600 focus:ring-violet-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Puntos de Conexión Eléctrica</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-violet-600 rounded border-slate-300 dark:border-slate-600 focus:ring-violet-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Mediciones Estructurales / Techos</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-violet-600 rounded border-slate-300 dark:border-slate-600 focus:ring-violet-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Cobertura de Internet / Señal</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Observaciones de Viabilidad</label>
              <textarea 
                rows={3} 
                placeholder="Indique si hay obstáculos, requerimientos especiales (ej. grúa), riesgos detectados para la ejecución futura..." 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-violet-500/50 outline-none resize-none"
              ></textarea>
            </div>
          </div>
        </section>
      )}

      {/* Sección 3: Conclusiones y Plan de Acción */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <CheckCircle2 className={`w-5 h-5 text-${theme}-600`} />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">3. Conclusión y Siguientes Pasos</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estado Final de la Visita</label>
              <select className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-${theme}-500/50 outline-none`}>
                <option value="">Seleccionar...</option>
                {serviceType === 'vis_fallas' && <option value="resuelto">Problema Resuelto en Sitio</option>}
                {serviceType === 'vis_fallas' && <option value="requiere_repuesto">Requiere Repuestos / Cambio de Equipo</option>}
                {serviceType === 'vis_emerg' && <option value="controlado">Emergencia Controlada (Seguro)</option>}
                {serviceType === 'vis_emerg' && <option value="requiere_reparacion">Requiere Reparación Mayor Post-Emergencia</option>}
                {serviceType === 'vis_insp' && <option value="viable">Proyecto Viable sin contratiempos</option>}
                {serviceType === 'vis_insp' && <option value="viable_condiciones">Viable con condiciones / modificaciones</option>}
                {serviceType === 'vis_insp' && <option value="no_viable">No Viable / Alto Riesgo</option>}
                <option value="pendiente">Requiere segunda visita / Escalamiento</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Materiales / Repuestos Sugeridos</label>
              <input type="text" placeholder="Ej. 2x MC4, 1x Fusible 15A..." className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-${theme}-500/50 outline-none`} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Comentarios Adicionales (Recomendaciones al cliente o equipo técnico)</label>
            <textarea 
              rows={3} 
              className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-${theme}-500/50 outline-none resize-none`}
            ></textarea>
          </div>
        </div>
      </section>

      {/* Sección 4: Registro Fotográfico  */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Camera className={`w-5 h-5 text-${theme}-600`} />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">4. Evidencia Fotográfica y Cierre</h3>
        </div>
        <div className="p-5 space-y-6">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Fotografías del Levantamiento</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MultiImageCategory label="Panorámica del Sitio" theme="slate" />
              <MultiImageCategory label="Foco del Problema / Área" theme={theme === 'rose' ? 'rose' : 'amber'} />
              <MultiImageCategory label="Detalle Técnico (Placas, mediciones)" theme="slate" />
              <MultiImageCategory label="Estado Final / Solución" theme={theme === 'indigo' ? 'indigo' : 'emerald'} />
            </div>
          </div>
          
          
        </div>
      </section>
    </div>
  );
}
