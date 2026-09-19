import React, { useState } from 'react';
import CalendarView from './CalendarView';
import BackToDashboardButton from './BackToDashboardButton';
import { ArrowLeft, Plus, X } from 'lucide-react';

interface CalendarModuleProps {
  onBack: () => void;
  userRole: string; // 'admin' or 'tech'
}

export default function CalendarModule({ onBack, userRole }: CalendarModuleProps) {
  
  const [calendarType, setCalendarType] = useState<'operativo' | 'administrativo'>('operativo');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityDate, setNewActivityDate] = useState('');


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
      <header className="bg-indigo-600 border-b border-indigo-700 sticky top-0 z-20 shadow-md px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <BackToDashboardButton 
              id="btn-calendar-back"
              onClick={onBack}
              variant="glass"
            />
            <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
            <h1 className="font-bold text-lg sm:text-xl text-white flex-1 truncate">Calendario Global</h1>
          </div>
          
          {userRole === 'admin' && (
            <div className="flex items-center gap-6 mt-2 overflow-x-auto hide-scrollbar scroll-wheel-horizontal">
              <button 
                onClick={() => setCalendarType('operativo')}
                className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${calendarType === 'operativo' ? 'border-white text-white' : 'border-transparent text-indigo-200 hover:text-indigo-50'}`}
              >
                Calendario Operativo
              </button>
              <button 
                onClick={() => setCalendarType('administrativo')}
                className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${calendarType === 'administrativo' ? 'border-white text-white' : 'border-transparent text-indigo-200 hover:text-indigo-50'}`}
              >
                Actividades Administrativas
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {calendarType === 'operativo' ? (
          <CalendarView />
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Calendario Administrativo</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Módulo exclusivo para programación de actividades internas de la empresa.</p>
            
            <button onClick={() => setIsAddingNew(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer">
              <Plus className="w-5 h-5" />
              Programar Nueva Actividad
            </button>

          </div>
        )}
      </main>

      {isAddingNew && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Programar Nueva Actividad</h3>
              <button onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Título de la Actividad</label>
                <input type="text" value={newActivityTitle} onChange={e => setNewActivityTitle(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" placeholder="Ej. Reunión Mensual" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Fecha</label>
                <input type="date" value={newActivityDate} onChange={e => setNewActivityDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" />
              </div>
              <button onClick={() => {
                 if (!newActivityTitle || !newActivityDate) {
                   window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Completa todos los campos', type: 'error' } }));
                   return;
                 }
                 window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Actividad administrativa programada exitosamente', type: 'success' } }));
                 setIsAddingNew(false);
                 setNewActivityTitle('');
                 setNewActivityDate('');
              }} className="mt-2 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
                Guardar Actividad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
