import React, { useState, useEffect } from 'react';
import BackToDashboardButton from './BackToDashboardButton';
import { Package, Filter, CheckCircle2, XCircle, Clock, Shield, Wrench, Search, MessageSquare, ArrowLeft, Send } from 'lucide-react';

export default function AdminApprovalsDashboard({ onBack }: { onBack: () => void }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'inventory' | 'hr_ppe'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_process' | 'approved' | 'rejected'>('all');
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    const fetchRequests = () => {
      const all = JSON.parse(localStorage.getItem('fsm_material_requests') || '[]');
      setRequests(all);
    };
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = (status: string) => {
    if (!selectedReq) return;
    
    const all = JSON.parse(localStorage.getItem('fsm_material_requests') || '[]');
    const updated = all.map((r: any) => {
      if (r.id === selectedReq.id) {
        const newReq = { ...r, status, adminNote };
        // Disparar evento para notificación en tiempo real
        window.dispatchEvent(new CustomEvent('requestStatusChanged', { detail: newReq }));
        return newReq;
      }
      return r;
    });
    
    localStorage.setItem('fsm_material_requests', JSON.stringify(updated));
    setRequests(updated);
    setSelectedReq(null);
    setAdminNote('');
  };

  const filtered = requests.filter(r => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans animate-in fade-in">
      <header className="bg-indigo-700 border-b border-indigo-800 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BackToDashboardButton 
                id="btn-approvals-back"
                onClick={onBack}
                variant="glass"
              />
              <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
              <h1 className="font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-300" /> Panel de Aprobaciones
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Filtros */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Tipo de Recurso</label>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full sm:w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Todas las categorías</option>
                  <option value="inventory">Herramientas / Repuestos (Inv)</option>
                  <option value="hr_ppe">EPP / Uniformes (RRHH)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Estado</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full sm:w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="in_process">En Proceso</option>
                  <option value="approved">Aprobados</option>
                  <option value="rejected">Rechazados</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold text-sm">
              <Package className="w-4 h-4" />
              {filtered.length} Solicitudes
            </div>
          </div>

          {/* Tabla de Solicitudes */}
          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">No hay solicitudes</h3>
                <p className="text-slate-500 dark:text-slate-400">No se encontraron solicitudes que coincidan con los filtros aplicados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto"><table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 uppercase border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-bold">Solicitud</th>
                    <th className="px-6 py-4 font-bold">Categoría</th>
                    <th className="px-6 py-4 font-bold">Solicitante</th>
                    <th className="px-6 py-4 font-bold">Estado</th>
                    <th className="px-6 py-4 font-bold text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filtered.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-base">{req.item}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                          Cant: {req.quantity} | Urgencia: 
                          <span className={`w-2 h-2 rounded-full inline-block ml-1 \${req.urgency === 'high' ? 'bg-red-500' : req.urgency 'medium' 'bg-amber-500' 'bg-green-500'}`}></span>
                          {req.urgency.toUpperCase()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {req.type === 'inventory' ? (
                          <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-md text-xs font-semibold">
                            <Wrench className="w-3 h-3" /> Inventario
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                            <Shield className="w-3 h-3" /> RRHH (EPP)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700 dark:text-slate-200">{req.requestedBy}</p>
                        <p className="text-xs text-slate-400">{new Date(req.date).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-bold \${ req.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'approved' 'bg-emerald-100 text-emerald-700 border-emerald-200' 'in_process' 'bg-blue-100 text-blue-700 border-blue-200' 'bg-rose-100 text-rose-700 border-rose-200' }`}>
                          {req.status === 'pending' ? 'Pendiente' : req.status === 'approved' ? 'Aprobado' : req.status === 'in_process' ? 'En Proceso' : 'Rechazado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedReq(req)}
                          className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg font-bold transition-colors text-xs"
                        >
                          Revisar & Aprobar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Revisión */}
      {selectedReq && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/50">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Revisión de Solicitud</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Gestión de recurso solicitado por técnico de campo</p>
            </div>
            
            <div className="p-6 bg-slate-50/50 space-y-4">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">Solicitante</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedReq.requestedBy}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">Ítem Solicitado</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedReq.item} (x{selectedReq.quantity})</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Justificación del Técnico</span>
                    <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-sm border border-slate-100 dark:border-slate-700/50 italic">
                      "{selectedReq.justification}"
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Nota de Retroalimentación (Visible para el técnico)</label>
                <textarea 
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Ej: Aprobado, pasar por bodega a las 3PM. / Rechazado por falta de stock..."
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none text-sm"
                ></textarea>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button 
                onClick={() => handleUpdateStatus('rejected')}
                className="px-4 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Rechazar
              </button>
              <button 
                onClick={() => handleUpdateStatus('in_process')}
                className="px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2"
              >
                <Clock className="w-4 h-4" /> En Proceso
              </button>
              <button 
                onClick={() => handleUpdateStatus('approved')}
                className="px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Aprobar
              </button>
            </div>
            
            <div className="px-6 pb-6 bg-white dark:bg-slate-800">
              <button 
                onClick={() => setSelectedReq(null)}
                className="w-full py-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 text-sm font-bold transition-colors"
              >
                Cancelar y volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
