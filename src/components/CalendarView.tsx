import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

export default function CalendarView() {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  

  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // September 2026
  

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  const getWeekNumber = (d: Date) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNo = Math.ceil(( ( (d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
    return weekNo;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOfMonth(year, month);
  const startWeekNumber = getWeekNumber(new Date(year, month, 1));
  const totalWeeks = Math.ceil((daysInMonth + firstDayOffset) / 7);

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const currentMonthName = `${monthNames[month]} ${year}`;
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };


  const holidays = [
    { day: 15, name: 'Día de la Independencia (El Salvador)', type: 'national' },
  ];

  const defaultTasks = [
    { day: 4, plant: 'Planta Solar Capella', service: 'Limpieza de Paneles', category: 'solar' },
    { day: 7, plant: 'Planta Bósforo', service: 'Revisión de Inversores', category: 'solar' },
    { day: 12, plant: 'Planta HFO Acajutla', service: 'Mantenimiento Preventivo', category: 'hfo' },
    { day: 18, plant: 'Planta Solar Santa Ana', service: 'Mantenimiento Correctivo', category: 'solar' },
    { day: 24, plant: 'Techo Solar Walmart', service: 'Inspección Termográfica', category: 'visit' },
    { day: 28, plant: 'Planta HFO San Salvador', service: 'Mantenimiento Mayor', category: 'hfo' }
  ];

  // Dynamic tasks from scheduled service orders
  const [scheduledOrders, setScheduledOrders] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('fsm_service_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('fsm_service_orders');
        if (saved) setScheduledOrders(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('app-toast', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('app-toast', handleUpdate);
    };
  }, []);

  const tasks = useMemo(() => {
    const combined = [...defaultTasks];

    scheduledOrders.forEach((order: any) => {
      if (!order.startDate || !order.durationDays) return;
      const daysCount = Number(order.durationDays) || 1;
      
      let cat = 'solar';
      if (order.categoryKey === 'hfo') cat = 'hfo';
      else if (order.categoryKey === 'visitas' || order.categoryKey === 'gps') cat = 'visit';

      for (let i = 0; i < daysCount; i++) {
        const d = new Date(order.startDate + 'T00:00:00');
        d.setDate(d.getDate() + i);

        if (d.getFullYear() === year && d.getMonth() === month) {
          combined.push({
            day: d.getDate(),
            plant: order.plantName,
            service: `${order.serviceName}${daysCount > 1 ? ` (${i + 1}/${daysCount})` : ''}`,
            category: cat
          });
        }
      }
    });

    return combined;
  }, [scheduledOrders, year, month]);

  const [holidayWarning, setHolidayWarning] = useState<{ day: number, name: string } | null>(null);

  const getCategoryStyles = (category: string) => {
    switch(category) {
      case 'solar': return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800/50';
      case 'hfo': return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800/50';
      case 'visit': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800/50';
      default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const handleDayClick = (day: number) => {
    const holiday = holidays.find(h => h.day === day);
    if (holiday) {
      setHolidayWarning({ day, name: holiday.name });
    } else {
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: `Programar servicio para el ${day} de ${currentMonthName}` } }));
    }
  };

  const renderCells = () => {
    let cells = [];
    let currentDay = 1;
    
    for (let w = 0; w < totalWeeks; w++) {
      cells.push(
        <div key={`week-${w}`} className="flex items-center justify-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400">
          <div className="-rotate-90 whitespace-nowrap hidden sm:block">Semana {startWeekNumber + w}</div>
          <div className="sm:hidden">S{startWeekNumber + w}</div>
        </div>
      );
      
      for (let d = 0; d < 7; d++) {
        if (w === 0 && d < firstDayOffset) {
          cells.push(<div key={`empty-${w}-${d}`} className="p-2 min-h-[140px] bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-lg"></div>);
        } else if (currentDay <= daysInMonth) {
          const isToday = currentDay === 15; 
          const dayTasks = tasks.filter(t => t.day === currentDay);
          const holiday = holidays.find(h => h.day === currentDay);
          
          const currentDayNum = currentDay; 
          
          cells.push(
            <div 
              key={`day-${currentDay}`} 
              onClick={() => handleDayClick(currentDayNum)}
              className={`p-2 min-h-[140px] cursor-pointer border rounded-lg flex flex-col gap-1 transition-colors ${ isToday ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-sm relative' : holiday ? 'border-rose-300 bg-rose-50/50 dark:bg-rose-900/10 dark:border-rose-700/50 hover:border-rose-400' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600' }`}>
              {isToday && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 rounded-t-lg"></div>}
              <div className="flex flex-col gap-1 mb-1">
                <span className={`text-sm font-semibold self-start ${isToday ? 'text-indigo-700 bg-indigo-100 dark:bg-indigo-900 px-2 rounded-full mt-1' : 'text-slate-700 dark:text-slate-300'}`}>
                  {currentDay}
                </span>
                {holiday && (
                  <div className="text-[10px] sm:text-xs bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold px-1.5 py-0.5 rounded-sm border border-rose-200 dark:border-rose-800 w-full flex items-center gap-1 leading-tight text-left">
                    <span>🇸🇻</span> <span>{holiday.name}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto hide-scrollbar">
                {dayTasks.map((task, idx) => (
                  <div key={idx} className={`text-xs p-1.5 rounded-md shadow-sm border ${getCategoryStyles(task.category)}`}>
                    <span className="block font-bold mb-1 leading-tight">{task.plant}</span>
                    <span className="block opacity-90 leading-tight">{task.service}</span>
                  </div>
                ))}
              </div>
            </div>
          );
          currentDay++;
        } else {
          cells.push(<div key={`empty-end-${w}-${d}`} className="p-2 min-h-[140px] bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-lg"></div>);
        }
      }
    }
    return cells;
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 shadow-sm relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600" />
          Calendario de Actividades
        </h3>
        
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="font-semibold text-slate-700 dark:text-slate-200 text-lg">
            {currentMonthName}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-colors cursor-pointer">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-colors cursor-pointer">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Leyenda de colores */}
      <div className="flex flex-wrap gap-2 mb-6 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-semibold">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500"></div> Planta Solar</div>
        <div className="flex items-center gap-1.5 ml-2"><div className="w-3 h-3 rounded-full bg-orange-400 border border-orange-500"></div> Planta HFO</div>
        <div className="flex items-center gap-1.5 ml-2"><div className="w-3 h-3 rounded-full bg-blue-400 border border-blue-500"></div> Visitas / Otros</div>
      </div>
      
      <div className="grid grid-cols-[30px_repeat(7,minmax(0,1fr))] sm:grid-cols-[40px_repeat(7,minmax(0,1fr))] gap-1 sm:gap-2 mb-2">
        <div></div> {/* Empty header for week column */}
        {days.map(d => (
          <div key={d} className="text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-2">
            {d}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-[30px_repeat(7,minmax(0,1fr))] sm:grid-cols-[40px_repeat(7,minmax(0,1fr))] gap-1 sm:gap-2">
        {renderCells()}
      </div>

      {holidayWarning && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-rose-500 p-6 flex flex-col items-center text-center">
              <AlertTriangle className="w-12 h-12 text-white mb-2" />
              <h3 className="text-xl font-bold text-white">Programación Bloqueada</h3>
              <p className="text-rose-100 mt-1">El día {holidayWarning.day} coincide con un feriado oficial</p>
            </div>
            <div className="p-6">
              <p className="text-slate-700 dark:text-slate-300 font-medium text-center mb-6">
                El sistema prohíbe la creación automática de servicios para <strong>{holidayWarning.name}</strong>.
              </p>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                  ¿Es una emergencia operativa o cuenta con excepción autorizada por los administradores?
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setHolidayWarning(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Procesando autorización excepcional para el día ' + holidayWarning.day } }));
                    setHolidayWarning(null);
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors shadow-sm"
                >
                  Autorizar Excepción
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
