import React, { useState } from 'react';
import { Settings, PenTool, ShieldAlert, Wrench, Activity, Camera, Flame, CheckCircle, AlertOctagon } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';

export default function HFOCorrectiveForm() {
  const [affectedSystem, setAffectedSystem] = useState('');
  const [startupResult, setStartupResult] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-xl p-5 text-white flex items-center gap-4 shadow-lg">
        <div className="bg-orange-500/20 p-3 rounded-lg">
          <Flame className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Mantenimiento Correctivo - Motores HFO</h2>
          <p className="text-sm text-slate-300">Generación Térmica (Heavy Fuel Oil)</p>
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">ID del Motor / Unidad</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none" placeholder="Ej. Unidad 3 (Wärtsilä / MAN)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Horas de Operación (Running Hours)</label>
              <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none" placeholder="Ej. 45000 hrs" />
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
            <p className="text-sm font-bold text-red-800">PROTOCOLOS DE AISLAMIENTO (LOTO MULTIDISCIPLINARIO)</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-red-600 rounded border-slate-300 dark:border-slate-600 focus:ring-red-500" />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Aislamiento Eléctrico: Breaker de generador abierto, extraído y bloqueado.</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-red-600 rounded border-slate-300 dark:border-slate-600 focus:ring-red-500" />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Aislamiento Mecánico: Válvulas de aire de arranque cerradas y purgadas.</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-red-600 rounded border-slate-300 dark:border-slate-600 focus:ring-red-500" />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Aislamiento de Fluidos: Válvulas de HFO, Lube Oil y Cooling Water bloqueadas.</span>
            </label>
          </div>
        </div>
      </section>

      {/* Sección 2: Diagnóstico de Falla */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">2. Diagnóstico de Falla</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Sistema Afectado</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none"
                  value={affectedSystem}
                  onChange={(e) => setAffectedSystem(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option value="combustible">Sistema de Combustible (HFO/LFO)</option>
                  <option value="lubricacion">Sistema de Aceite Lubricante (Lube Oil)</option>
                  <option value="enfriamiento">Sistema de Enfriamiento (HT/LT Water)</option>
                  <option value="aire">Aire de Carga / Gases de Escape</option>
                  <option value="mecanico">Componentes Mecánicos (Pistón, Válvulas, Cojinetes)</option>
                  <option value="electrico">Eléctrico / Generador / AVR</option>
                  <option value="instrumentacion">Instrumentación y Control (Sensores)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Tipo de Falla</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none">
                  <option value="">Seleccionar...</option>
                  <option value="fuga">Fuga de fluido / Presión baja</option>
                  <option value="temperatura">Sobretemperatura</option>
                  <option value="vibracion">Vibración alta / Ruido anormal</option>
                  <option value="sensor">Fallo de sensor / Alarma HMI</option>
                  <option value="rotura">Rotura / Fatiga mecánica</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Descripción del Síntoma / Alarma</label>
              <textarea rows={2} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none resize-none" placeholder="Ej. Alarma de baja presión de aceite de lubricación antes del filtro..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Causa Raíz Identificada (RCA)</label>
              <textarea rows={2} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none resize-none" placeholder="Ej. O-ring de la bomba de prelubricación cristalizado por fatiga térmica..."></textarea>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3: Intervención y Repuestos */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">3. Intervención y Repuestos</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Acción Correctiva Ejecutada</label>
              <textarea rows={3} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none resize-none" placeholder="Descripción paso a paso del desmontaje y reparación..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Repuestos Utilizados (Números de Parte)</label>
              <textarea rows={2} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none resize-none" placeholder="Ej. 1x O-ring PN: 12345, 1x Válvula termostática..."></textarea>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 text-orange-600 rounded border-slate-300 dark:border-slate-600 focus:ring-orange-500 cursor-pointer" />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Se utilizó herramienta de torque / tensionado hidráulico calibrada (Si aplica).</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 4: Pruebas y Arranque */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">4. Pruebas y Arranque</h3>
        </div>
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Presión Prelubricación (Bar)</label>
              <input type="number" step="0.1" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none" placeholder="Ej. 1.2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Temp. Chaqueta Agua (°C)</label>
              <input type="number" step="0.1" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none" placeholder="HT Water > 70°C" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Prueba Virador (Turning Gear)</label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none">
                <option value="">Seleccionar...</option>
                <option value="ok">Libre, purgas abiertas (OK)</option>
                <option value="falla">Resistencia / Trabe (Falla)</option>
                <option value="na">No aplica (Falla eléctrica)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Resultado de Arranque</label>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500/50 outline-none"
              value={startupResult}
              onChange={(e) => setStartupResult(e.target.value)}
            >
              <option value="">Seleccionar...</option>
              <option value="exitoso">Arranque Exitoso (Sincronizado a Red)</option>
              <option value="observacion">Arranque con Observaciones (Fugas menores)</option>
              <option value="fallido">Arranque Fallido / No autorizado</option>
            </select>
          </div>
          {startupResult === 'fallido' && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg flex gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertOctagon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">Alerta: El motor permanece indisponible. Favor documentar la causa del fallo de arranque en las observaciones generales.</p>
            </div>
          )}
        </div>
      </section>

      {/* Sección 5: Evidencia Fotográfica */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <Camera className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">5. Evidencia Fotográfica</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MultiImageCategory label="Componente Dañado" theme="rose" />
            <MultiImageCategory label="Componente Nuevo Instalado" theme="emerald" />
            <MultiImageCategory label="Parámetros en HMI / SCADA" theme="slate" />
          </div>
        </div>
      </section>
    </div>
  );
}
