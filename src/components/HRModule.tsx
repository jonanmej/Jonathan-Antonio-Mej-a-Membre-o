import React, { useState, useEffect } from 'react';
import BackToDashboardButton from './BackToDashboardButton';
import { exportToCSV } from '../utils/csv';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { initAuth, googleSignIn, logout, getAccessToken } from '../lib/firebase';
import { AlertTriangle, Shield } from 'lucide-react';
import { createSheetWithPivot } from '../lib/sheets';
import { User } from 'firebase/auth';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import { activeMapLib, maplibregl, MAP_STYLES, MAPBOX_TOKEN } from '../utils/mapConfig';
import { X, Map as MapIcon } from 'lucide-react';


import {
  Users, Download, MessageSquare, ArrowLeft, Clock, MapPin, 
  Briefcase, Plus, Filter, Search, BarChart3,
  Wrench, Sun, FileText, CalendarDays,
  ShieldCheck, AlertCircle
} from 'lucide-react';

interface HRModuleProps {
  onBack: () => void;
}

export default function HRModule({ onBack }: HRModuleProps) {

  const [isAddingNew, setIsAddingNew] = useState(false);

  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Técnico de Campo');
  const [newEmpStartTime, setNewEmpStartTime] = useState('08:00');
  const [newEmpEndTime, setNewEmpEndTime] = useState('17:00');
  const [newEmpId, setNewEmpId] = useState('');
  
  const [crewsList, setCrewsList] = useState<any[]>([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'crews'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCrewsList(data);
    });
    return () => unsubscribe();
  }, []);
  const [isAddingCrew, setIsAddingCrew] = useState(false);
  const [editingCrew, setEditingCrew] = useState<any>(null);
  const [newCrewName, setNewCrewName] = useState('');
  const [newCrewType, setNewCrewType] = useState('');
  const [newCrewStatus, setNewCrewStatus] = useState('Activa');
  const [newCrewMembers, setNewCrewMembers] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{type: 'crew', id: string, name: string} | null>(null);
  
  const handleSaveCrew = () => {
    if(!newCrewName) return;
    const newItem = editingCrew 
      ? { ...editingCrew, name: newCrewName, type: newCrewType, status: newCrewStatus, members: newCrewMembers, color: newCrewStatus === 'Activa' ? 'emerald' : 'slate' }
      : { id: 'crew-'+Date.now(), name: newCrewName, type: newCrewType, status: newCrewStatus, members: newCrewMembers, location: 'Base Central', icon: 'users', color: newCrewStatus === 'Activa' ? 'emerald' : 'slate' };
    setDoc(doc(db, 'crews', newItem.id), newItem);
    setIsAddingCrew(false);
    setEditingCrew(null);
  };
  
  const handleDeleteCrew = (id: string, name: string) => {
    setDeleteConfirm({ type: 'crew', id, name });
  };
  
  const confirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'crew') {
      deleteDoc(doc(db, 'crews', deleteConfirm.id));
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Cuadrilla eliminada', type: 'success' } }));
    }
    setDeleteConfirm(null);
  };
  
  const openEditCrew = (crew: any) => {
    setEditingCrew(crew);
    setNewCrewName(crew.name);
    setNewCrewType(crew.type);
    setNewCrewStatus(crew.status);
    setNewCrewMembers(crew.members);
    setIsAddingCrew(true);
  };


  
  
  const [hrTab, setHrTab] = useState<'crews' | 'timesheets' | 'solicitudes' | 'hours'>('crews');
  const [hrRequests, setHrRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = () => {
      const all = JSON.parse(localStorage.getItem('fsm_material_requests') || '[]');
      setHrRequests(all.filter((r: any) => r.type === 'hr_ppe'));
    };
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateReqStatus = (id: string, newStatus: string) => {
    setDoc(doc(db, 'requests', id), { status: newStatus }, { merge: true });
  };

  const [viewMode, setViewMode] = useState<'detailed' | 'pivot'>('detailed');
  const [dynamicTimesheets, setDynamicTimesheets] = useState<any[]>([]);
  const [selectedMapRecord, setSelectedMapRecord] = useState<any>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setNeedsAuth(false);
        setToken(token);
        setUser(user);
      },
      () => setNeedsAuth(true)
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'La ventana de inicio de sesión se cerró o fue bloqueada. \n\nPor favor, asegúrate de permitir las ventanas emergentes (pop-ups). Si el problema persiste, abre la aplicación en una NUEVA PESTAÑA utilizando el botón de la esquina superior derecha del panel de vista previa.' } }));
      } else {
        window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Error al iniciar sesión con Google: ' + err.message } }));
      }
    }
  };


  const getPivotData = () => {
    const records = JSON.parse(localStorage.getItem('timesheet_records') || '[]');
    const pivot: Record<string, any> = {};

    records.forEach((record: any) => {
      let startTime = new Date(record.startTime);
      let endTime = record.endTime ? new Date(record.endTime) : null;
      let horasTotales = 0;
      let horasExtras = 0;

      if (endTime) {
        let diffMs = endTime.getTime() - startTime.getTime();
        horasTotales = diffMs / (1000 * 60 * 60);
        if (horasTotales > 8) {
          horasExtras = horasTotales - 8;
        }
      }

      if (!pivot[record.user]) {
        pivot[record.user] = {
          user: record.user,
          role: record.role,
          totalHoras: 0,
          totalExtras: 0,
          turnos: 0,
        };
      }
      pivot[record.user].turnos += 1;
      pivot[record.user].totalHoras += horasTotales;
      pivot[record.user].totalExtras += horasExtras;
    });

    return Object.values(pivot);
  };


  const exportToGoogleSheets = async () => {
    if (needsAuth || !token) {
      await handleGoogleLogin();
      return;
    }

    setIsExporting(true);
    try {
      const records = JSON.parse(localStorage.getItem('timesheet_records') || '[]');
      
      const detailedData = records.map((record: any) => {
        let startTime = new Date(record.startTime);
        let endTime = record.endTime ? new Date(record.endTime) : null;
        let horasTotales = 0;
        let horasExtras = 0;

        if (endTime) {
          let diffMs = endTime.getTime() - startTime.getTime();
          horasTotales = diffMs / (1000 * 60 * 60);
          if (horasTotales > 8) {
            horasExtras = horasTotales - 8;
          }
        }

        return {
          user: record.user,
          role: record.role,
          horaEntrada: startTime.toLocaleString(),
          horaSalida: endTime ? endTime.toLocaleString() : 'En curso',
          horasTotales: parseFloat(horasTotales.toFixed(2)),
          horasExtras: parseFloat(horasExtras.toFixed(2)),
          status: record.status,
          comment: ((record.comment || '') + ' ' + (record.endComment || '')).trim()
        };
      });

      const sheetUrl = await createSheetWithPivot(token, detailedData);
      window.open(sheetUrl, '_blank');
      
    } catch (error: any) {
      console.error('Error exporting to Google Sheets:', error);
      if (error.code === 'auth/popup-closed-by-user') {
         window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Inicio de sesión bloqueado. Si estás en la vista previa, intenta abrir la aplicación en una NUEVA PESTAÑA.' } }));
      } else {
         window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Hubo un error exportando a Google Sheets. Es posible que debas iniciar sesión nuevamente.' } }));
      }
      setNeedsAuth(true); // Token might be expired
    } finally {
      setIsExporting(false);
    }
  };


  useEffect(() => {
    if (hrTab === 'timesheets') {
      const records = JSON.parse(localStorage.getItem('timesheet_records') || '[]');
      setDynamicTimesheets(records.reverse()); // Show newest first
    }
  }, [hrTab]);

  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans animate-in fade-in">
      {/* Navbar Superior HR */}
      <header className="bg-indigo-600 border-b border-indigo-700 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BackToDashboardButton 
                id="btn-hr-back"
                onClick={onBack}
                variant="glass"
              />
              <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
              <h1 className="font-bold text-lg sm:text-xl text-white">Recursos Humanos</h1>
              <div className="hidden md:flex items-center gap-2 bg-indigo-700/50 px-3 py-1.5 rounded-lg border border-indigo-500/30">
                <Users className="w-4 h-4 text-indigo-200" />
                <span className="text-xs text-indigo-100 font-medium">Personal y Cuadrillas</span>
              </div>
            </div>
            
            <button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Registro</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        
        {/* Tarjetas de Resumen KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Personal</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">42</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Cuadrillas Activas</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">5</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-amber-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Horas Extra (Mes)</p>
              <p className="text-2xl font-bold text-amber-600">124 hrs</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-red-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Ausencias Hoy</p>
              <p className="text-2xl font-bold text-red-600">2</p>
            </div>
          </div>
        </div>

        {/* Controles de Navegación HR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
            <button 
              onClick={() => setHrTab('crews')}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${hrTab === 'crews' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Users className="w-4 h-4" /> Cuadrillas FSM
            </button>
                        <button 
              onClick={() => setHrTab('timesheets')}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${hrTab === 'timesheets' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Clock className="w-4 h-4" /> Asistencia
            </button>
            
            <button 
              onClick={() => setHrTab('solicitudes')}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${hrTab === 'solicitudes' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Shield className="w-4 h-4" /> Solicitudes EPP
              {hrRequests.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-1 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  {hrRequests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder={hrTab === 'crews' ? "Buscar cuadrilla..." : "Buscar empleado..."}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              />
            </div>
            <button onClick={() => window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Esta función está en desarrollo.' } }))}  className="p-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 transition-colors shrink-0">
              <Filter className="w-4 h-4" />
            </button>
            {hrTab === 'crews' && (
              <button onClick={() => { setEditingCrew(null); setIsAddingCrew(true); }} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shrink-0 flex items-center gap-2 px-3 text-sm font-bold">
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Añadir</span>
              </button>
            )}
          </div>
        </div>

        {/* Contenido: Cuadrillas */}
        {hrTab === 'crews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in slide-in-from-bottom-2 duration-300">
            {crewsList.map(crew => (
              <div key={crew.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className={`absolute top-0 left-0 w-1 h-full bg-${crew.color}-500`}></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0`}>
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{crew.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{crew.type}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border ${crew.status === 'Activa' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {crew.status}
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3.5 mb-4 border border-slate-100 dark:border-slate-700/50 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Destino Actual:</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{crew.location || 'Base Central'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50 mt-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{crew.members} miembros</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEditCrew(crew)} className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                      Gestionar
                    </button>
                    <button onClick={() => handleDeleteCrew(crew.id, crew.name)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contenido: Horarios / Timesheets */}
        {hrTab === 'timesheets' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <h2 className="font-bold text-slate-800 dark:text-slate-100 hidden sm:block">Asistencia</h2>
                
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => {
                  const records = JSON.parse(localStorage.getItem('timesheet_records') || '[]');
                  exportToCSV(records, 'reporte_rrhh');
                }} className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 border px-3 py-1.5 rounded-lg transition-colors shadow-sm cursor-pointer">
                  <Download className="w-4 h-4" /> 
                  Exportar CSV
                </button>
              </div>
            </div>
            
            
              {viewMode === 'detailed' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                    <th className="px-6 py-4">Empleado / Cargo</th>
                    <th className="px-6 py-4">Entrada</th>
                    <th className="px-6 py-4">Salida</th>
                    <th className="px-6 py-4">Horas Efectivas</th>
                    <th className="px-6 py-4">Extras</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">

                  {(dynamicTimesheets || []).map((record: any) => (
                    <tr key={record.id} className="hover:bg-slate-50/80 transition-colors bg-emerald-50/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                            {record.user.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white leading-tight">{record.user}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{record.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        {new Date(record.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">GPS Ok</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {record.endTime ? new Date(record.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                      </td>
                      <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">
                        {(() => {
                           if (!record.endTime) return '--';
                           const start = new Date(record.startTime).getTime();
                           const end = new Date(record.endTime).getTime();
                           const totalHours = (end - start) / 3600000;
                           // Subtract 1 hour for lunch
                           const effectiveHours = Math.max(0, totalHours - 1);
                           return effectiveHours.toFixed(1) + 'h';
                        })()}
                      </td>
                      <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                        {(() => {
                           if (!record.endTime) return '--';
                           const start = new Date(record.startTime).getTime();
                           const end = new Date(record.endTime).getTime();
                           const totalHours = (end - start) / 3600000;
                           const effectiveHours = Math.max(0, totalHours - 1);
                           const overtime = Math.max(0, effectiveHours - 8);
                           return overtime > 0 ? '+' + overtime.toFixed(1) + 'h' : '--';
                        })()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${ record.status === 'En Turno' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : record.status === 'En Almuerzo' ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-slate-600 bg-slate-100 dark:bg-slate-800/50 border-slate-200' }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ record.status === 'En Turno' ? 'bg-emerald-500' : record.status === 'En Almuerzo' ? 'bg-amber-500' : 'bg-slate-400' }`}></span> {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {(record.comment || record.endComment) && (
                            <button onClick={() => window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Esta función está en desarrollo.' } }))}  
                              title={`Comentario: ${record.comment || ''} ${record.endComment || ''}`}
                              className="text-amber-500 hover:text-amber-700 transition-colors cursor-help"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              const loc = record.startLocation;
                              if (loc) {
                                setSelectedMapRecord(record);
                              } else {
                                window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Sin ubicación GPS' } }));
                              }
                            }}
                            className={`${record.startLocation ? 'text-indigo-600 hover:text-indigo-800' : 'text-slate-400'} font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1`}
                          >
                            <MapPin className="w-3 h-3" /> Ubicación
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  </tbody>
              </table>
            </div>
            )}
          </div>
        )}
        
        {hrTab === 'timesheets' && viewMode === 'pivot' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                  <thead className="bg-indigo-50/50 text-xs uppercase font-semibold text-indigo-800 border-b border-indigo-100">
                    <tr>
                      <th className="px-6 py-4">Empleado / Cargo</th>
                      <th className="px-6 py-4 text-center">Total Turnos</th>
                      <th className="px-6 py-4 text-center">Suma Horas Totales</th>
                      <th className="px-6 py-4 text-center">Suma Horas Extras</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {getPivotData().length === 0 && (
                      <tr><td colSpan={4} className="text-center py-8 text-slate-400">No hay datos dinámicos registrados. Inicie un turno en Operaciones.</td></tr>
                    )}
                    {getPivotData().map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                              {row.user.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white leading-tight">{row.user}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{row.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-200">{row.turnos}</td>
                        <td className="px-6 py-4 text-center font-bold text-indigo-700">{row.totalHoras.toFixed(2)}h</td>
                        <td className="px-6 py-4 text-center font-bold text-amber-600">{row.totalExtras > 0 ? `+${row.totalExtras.toFixed(2)}h` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


          </div>
        )}
      </main>

      
      {/* Modal Añadir/Editar Cuadrilla */}
      {isAddingCrew && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{editingCrew ? 'Editar Cuadrilla' : 'Añadir Cuadrilla'}</h3>
              <button onClick={() => { setIsAddingCrew(false); setEditingCrew(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nombre de Cuadrilla</label>
                <input type="text" value={newCrewName} onChange={e => setNewCrewName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="Ej. Cuadrilla Bravo" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Especialidad</label>
                <input type="text" value={newCrewType} onChange={e => setNewCrewType(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="Ej. Mantenimiento Eléctrico" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Estado</label>
                  <select value={newCrewStatus} onChange={e => setNewCrewStatus(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500">
                    <option value="Activa">Activa</option>
                    <option value="Standby">Standby</option>
                    <option value="Inactiva">Inactiva</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nº de Miembros</label>
                  <input type="number" min="1" value={newCrewMembers} onChange={e => setNewCrewMembers(parseInt(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                </div>
              </div>
              <button onClick={handleSaveCrew} className="mt-2 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
                {editingCrew ? 'Guardar Cambios' : 'Añadir Cuadrilla'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Mapa */}
      {selectedMapRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <MapIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">Ubicación de Marcación</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedMapRecord.user}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMapRecord(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-900 relative">
              <div className="w-full h-96 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600 relative shadow-inner">
                <Map
                  mapLib={activeMapLib}
                  mapboxAccessToken={MAPBOX_TOKEN || undefined}
                  style={{ width: "100%", height: "100%" }}
                  initialViewState={{
                    longitude: selectedMapRecord.startLocation.lng,
                    latitude: selectedMapRecord.startLocation.lat,
                    zoom: 15
                  }}
                  mapStyle={MAP_STYLES.satellite}
                  interactive={true}
                >
                  <NavigationControl position="top-right" />
                  <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow-xs border border-white/10 z-10 pointer-events-none">
                    🛰️ Vista Satelital
                  </div>
                  <Marker longitude={selectedMapRecord.startLocation.lng} latitude={selectedMapRecord.startLocation.lat} anchor="bottom">
                    <div className="flex flex-col items-center animate-bounce-short">
                      <div className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md mb-1 whitespace-nowrap">
                        Entrada
                      </div>
                      <MapPin className="w-8 h-8 text-emerald-600 drop-shadow-md" />
                    </div>
                  </Marker>
                  
                  {selectedMapRecord.endLocation && (
                    <Marker longitude={selectedMapRecord.endLocation.lng} latitude={selectedMapRecord.endLocation.lat} anchor="bottom">
                      <div className="flex flex-col items-center">
                        <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md mb-1 whitespace-nowrap">
                          Salida
                        </div>
                        <MapPin className="w-8 h-8 text-amber-500 drop-shadow-md" />
                      </div>
                    </Marker>
                  )}
                </Map>
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <div className="bg-white/90 backdrop-blur text-slate-700 dark:text-slate-200 text-xs px-3 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex-1">
                    <span className="font-bold text-emerald-700 block mb-1">Entrada</span>
                    Lat: {selectedMapRecord.startLocation.lat.toFixed(5)}<br/>
                    Lng: {selectedMapRecord.startLocation.lng.toFixed(5)}
                  </div>
                  {selectedMapRecord.endLocation && (
                    <div className="bg-white/90 backdrop-blur text-slate-700 dark:text-slate-200 text-xs px-3 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex-1">
                      <span className="font-bold text-amber-600 block mb-1">Salida</span>
                      Lat: {selectedMapRecord.endLocation.lat.toFixed(5)}<br/>
                      Lng: {selectedMapRecord.endLocation.lng.toFixed(5)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    
      {isAddingNew && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">
                Nuevo Registro de Horario
              </h3>
              <button onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nombre Completo</label>
                <input type="text" value={newEmpName} onChange={e => setNewEmpName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" placeholder="Ej. Carlos Mendoza" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Cargo / Puesto</label>
                  <select value={newEmpRole} onChange={e => setNewEmpRole(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500">
                    <option>Técnico de Campo</option>
                    <option>Supervisor</option>
                    <option>Administrador</option>
                    <option>Logística</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">ID Empleado</label>
                  <input type="text" value={newEmpId} onChange={e => setNewEmpId(e.target.value)} placeholder="EMP-XXX" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Hora de Entrada</label>
                  <input type="time" value={newEmpStartTime} onChange={e => setNewEmpStartTime(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Hora de Salida</label>
                  <input type="time" value={newEmpEndTime} onChange={e => setNewEmpEndTime(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" />
                </div>
              </div>
              <button onClick={() => {
                  if (!newEmpName || !newEmpId) {
                     window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'El nombre y el ID son obligatorios', type: 'error' } }));
                     return;
                  }
                  const records = JSON.parse(localStorage.getItem('timesheet_records') || '[]');
                  
                  const today = new Date().toISOString().split('T')[0];
                  
                  const newRecord = {
                     id: 'emp-' + Date.now(),
                     user: newEmpName,
                     role: newEmpRole,
                     date: today,
                     startTime: `${today}T${newEmpStartTime}:00Z`,
                     endTime: `${today}T${newEmpEndTime}:00Z`,
                     status: 'active',
                     startLocation: { lat: 13.6929, lng: -89.2182 },
                     endLocation: { lat: 13.6929, lng: -89.2182 }
                  };
                  const updated = [newRecord, ...records];
                  localStorage.setItem('timesheet_records', JSON.stringify(updated));
                  setDynamicTimesheets(updated);
                  window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Registro de tiempo guardado exitosamente', type: 'success' } }));
                  setIsAddingNew(false);
                  setNewEmpName('');
                  setNewEmpId('');
                  setHrTab('timesheets');
              }} className="mt-2 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
                Guardar Registro
              </button>
            </div>
          </div>
        </div>
      )}
</div>
  );
};

