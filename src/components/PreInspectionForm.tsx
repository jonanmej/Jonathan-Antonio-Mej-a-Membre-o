import { useState } from 'react';
import { ShieldCheck, AlertTriangle, ClipboardCheck, Lock, Camera } from 'lucide-react';
import MultiImageCategory from './MultiImageCategory';

interface Props {
  isUnlocked: boolean;
  onUnlock: () => void;
  onLock: () => void;
}

export default function PreInspectionForm({ isUnlocked, onUnlock, onLock }: Props) {
  const [isReady, setIsReady] = useState(true);

  if (isUnlocked) {
    return (
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 shadow-sm overflow-hidden mb-6 transition-colors duration-300">
        <div className="px-5 py-4 border-b border-emerald-100 bg-emerald-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="font-semibold text-emerald-800">Estado previo a trabajos</h2>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded text-emerald-700 bg-emerald-100">
            Completado y Desbloqueado
          </span>
        </div>
        <div className="px-5 py-3 bg-white dark:bg-slate-800 flex justify-between items-center">
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">La inspección física, del entorno y seguridad ha sido registrada.</p>
          <button 
            type="button" 
            onClick={onLock}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 px-3 py-1.5 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
          >
            Editar Inspección
          </button>
        </div>
      </section>
    );
  }

  const StatusGroup = ({ label, name }: { label: string, name: string }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">{label}</label>
      <div className="flex gap-2">
        {['Bueno', 'Regular', 'Malo', 'Crítico'].map(status => (
          <label key={status} className="flex-1 text-center cursor-pointer">
            <input type="radio" name={name} value={status.toLowerCase()} className="peer sr-only" />
            <div className="py-2 px-1 text-[11px] sm:text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg peer-checked:bg-slate-800 peer-checked:text-white peer-checked:border-slate-800 hover:bg-slate-50 transition-colors">
              {status}
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  const CheckboxItem = ({ label }: { label: string }) => (
    <label className="flex items-start gap-2 cursor-pointer">
      <input type="checkbox" className="w-4 h-4 mt-0.5 text-blue-600 rounded-full border-slate-300 dark:border-slate-600 focus:ring-blue-500" />
      <span className="text-sm text-slate-700 dark:text-slate-200 leading-tight">{label}</span>
    </label>
  );

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 shadow-sm overflow-hidden mb-6 transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <ClipboardCheck className="w-6 h-6 text-slate-800 dark:text-slate-100" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Estado previo a trabajos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Fecha de inspección</label>
            <input type="date" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Tipo de cubierta / montaje</label>
            <select className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none">
              <option value="">Seleccionar...</option>
              <option value="chapa_trapezoidal">Chapa trapezoidal</option>
              <option value="chapa_engargolada">Chapa engargolada (KR-18)</option>
              <option value="losa_concreto">Losa de concreto</option>
              <option value="teja_asfaltica">Teja asfáltica / Shingle</option>
              <option value="teja_barro">Teja de barro / Árabe</option>
              <option value="suelo">Estructura en suelo</option>
              <option value="carport">Carport / Estacionamiento</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatusGroup label="Techo / cubierta" name="status_techo" />
          <StatusGroup label="Estructura de montaje" name="status_estructura" />
          <StatusGroup label="Accesos y seguridad" name="status_accesos" />
          <StatusGroup label="Sectores circundantes" name="status_sectores" />
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mb-6">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">Riesgos y condiciones detectadas</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Techo / Cubierta</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CheckboxItem label="Filtraciones o humedad" />
                <CheckboxItem label="Láminas dobladas o perforadas" />
                <CheckboxItem label="Óxido o corrosión" />
                <CheckboxItem label="Deformaciones / hundimientos" />
                <CheckboxItem label="Tornillería suelta o faltante" />
                <CheckboxItem label="Sellos o impermeabilizante vencido" />
                <CheckboxItem label="Zonas donde no se puede caminar" />
                <CheckboxItem label="Tragaluces frágiles o sin protección" />
                <CheckboxItem label="Tragaluces sucios / opacos" />
                <CheckboxItem label="Pasos de gato / seguridad dañados" />
                <CheckboxItem label="Ausencia de pasos de gato / seguridad" />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Accesos y Seguridad</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CheckboxItem label="Sin puntos de anclaje para arnés" />
                <CheckboxItem label="Escalera o acceso inseguro" />
                <CheckboxItem label="Bordes sin baranda ni protección" />
                <CheckboxItem label="Líneas eléctricas cercanas" />
                <CheckboxItem label="Superficie resbalosa" />
                <CheckboxItem label="Obstáculos en la ruta de trabajo" />
                <CheckboxItem label="Sin líneas de vida / anclajes" />
                <CheckboxItem label="Líneas de vida en mal estado" />
                <CheckboxItem label="Sin escalera de marinero / acceso fijo" />
                <CheckboxItem label="Escalera de marinero dañada / con óxido" />
                <CheckboxItem label="Falta de jaula guarda-cuerpos en escalera" />
                <CheckboxItem label="Iluminación insuficiente" />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Sector Circundante</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CheckboxItem label="Vegetación o ramas invasivas" />
                <CheckboxItem label="Sombras de estructuras vecinas" />
                <CheckboxItem label="Canaletas o bajadas obstruidas" />
                <CheckboxItem label="Drenaje deficiente / encharcamiento" />
                <CheckboxItem label="Polvo o emisiones industriales" />
                <CheckboxItem label="Obra o trabajos de terceros" />
                <CheckboxItem label="Acumulación de material o escombros" />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Eléctrico</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CheckboxItem label="Cableado expuesto o dañado" />
                <CheckboxItem label="Conectores sueltos" />
                <CheckboxItem label="Puntos calientes visibles" />
                <CheckboxItem label="Tableros sin señalización" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Detalle del techo / cubierta</label>
            <textarea rows={2} placeholder="Estado de láminas, sellos, tornillería, daños preexistentes..." className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Accesos y seguridad</label>
            <textarea rows={2} placeholder="Rutas de acceso, anclajes, protecciones, iluminación..." className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Sectores circundantes</label>
            <textarea rows={2} placeholder="Vegetación, canaletas, drenajes, obras vecinas..." className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"></textarea>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mb-8">
          <label className="flex items-center justify-between cursor-pointer mb-4">
            <div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Área apta para iniciar trabajos</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Si no es apta, describe la acción correctiva requerida.</p>
            </div>
            <div className="relative">
              <input type="checkbox" className="sr-only peer" checked={isReady} onChange={(e) => setIsReady(e.target.checked)} />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </label>
          
          <div className="space-y-4">
            {!isReady && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <textarea rows={2} placeholder="Restricciones o condiciones para ejecutar el trabajo" className="w-full bg-white dark:bg-slate-800 border border-amber-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500/50 outline-none resize-none"></textarea>
              </div>
            )}
            <div>
              <textarea rows={2} placeholder="Observaciones generales" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"></textarea>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">Registro fotográfico del estado previo</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Condición del techo, accesos y sectores circundantes antes de iniciar.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MultiImageCategory label="Panorámica 1" theme="slate" />
            <MultiImageCategory label="Panorámica 2" theme="slate" />
            <MultiImageCategory label="Detalle Daños" theme="rose" />
            <MultiImageCategory label="Accesos/Seguridad" theme="amber" />
          </div>
        </div>

        <button 
          onClick={onUnlock}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all shadow-md"
        >
          <Lock className="w-5 h-5" />
          Guardar Inspección y Desbloquear Reporte
        </button>
      </div>
    </section>
  );
}
