import React, { useState } from 'react';
import BackToDashboardButton from './BackToDashboardButton';
import { exportToCSV } from '../utils/csv';
import D3TrendChart from './D3TrendChart';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  ArrowLeft, BarChart3, Target, Activity, Box, Clock, 
  TrendingUp, AlertTriangle, ChevronDown, Download, Calendar,
  CheckCircle, Zap, Sun, Wrench, ShieldCheck
} from 'lucide-react';

interface KPIsModuleProps {
  onBack: () => void;
}

type KpiContext = 'global' | 'solar' | 'hfo';

export default function KPIsModule({ onBack }: KPIsModuleProps) {
  const [dateRange, setDateRange] = useState('Este Mes');
  const [kpiContext, setKpiContext] = useState<KpiContext>('global');

  // Datos dinámicos según el contexto operativo
  const kpiData = {
    global: [
      { id: 1, title: 'Cumplimiento Preventivo', value: '94.2%', trend: '+2.1%', trendType: 'positive', icon: CheckCircle, color: 'emerald' },
      { id: 2, title: 'First-Time Fix Rate (Resolución)', value: '88.5%', trend: '+1.5%', trendType: 'positive', icon: Activity, color: 'blue' },
      { id: 3, title: 'Rotura de Stock', value: '2.1%', trend: '3 críticos', trendType: 'negative', icon: Box, color: 'amber' },
      { id: 4, title: 'Horas Hombre (YTD)', value: '8,450', trend: 'Eficiencia +5%', trendType: 'positive', icon: Clock, color: 'indigo' }
    ],
    solar: [
      { id: 1, title: 'Potencia Recuperada (Limpieza)', value: '+14.5 MW', trend: '+1.2 MW', trendType: 'positive', icon: Zap, color: 'orange' },
      { id: 2, title: 'Performance Ratio (PR)', value: '81.2%', trend: '+0.8%', trendType: 'positive', icon: Sun, color: 'amber' },
      { id: 3, title: 'Cobertura Lavado (Mes)', value: '45,200', trend: 'Paneles limpios', trendType: 'neutral', icon: Target, color: 'blue' },
      { id: 4, title: 'SLA Resp. Inversores', value: '< 4 hrs', trend: '98% éxito', trendType: 'positive', icon: Clock, color: 'emerald' }
    ],
    hfo: [
      { id: 1, title: 'Disponibilidad Motores', value: '98.8%', trend: '+0.5%', trendType: 'positive', icon: Activity, color: 'emerald' },
      { id: 2, title: 'MTBF (Tpo. Medio Entre Fallas)', value: '3,240 h', trend: '+120 h', trendType: 'positive', icon: ShieldCheck, color: 'slate' },
      { id: 3, title: 'MTTR (Tpo. Medio Reparación)', value: '6.5 h', trend: '-1.2 h (Mejora)', trendType: 'positive', icon: Clock, color: 'indigo' },
      { id: 4, title: 'Cumplimiento Overhaul', value: '100%', trend: 'Al día', trendType: 'positive', icon: Wrench, color: 'amber' }
    ]
  };

  const currentKpis = kpiData[kpiContext];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans animate-in fade-in">
      {/* Navbar Superior KPIs */}
      <header className="bg-violet-600 border-b border-violet-700 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BackToDashboardButton 
                id="btn-kpis-back"
                onClick={onBack}
                variant="glass"
              />
              <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
              <h1 className="font-bold text-lg sm:text-xl text-white flex-1 truncate">Dashboard Gerencial</h1>
              <div className="hidden md:flex items-center gap-2 bg-violet-700/50 px-3 py-1.5 rounded-lg border border-violet-500/30">
                <BarChart3 className="w-4 h-4 text-violet-200" />
                <span className="text-xs text-violet-100 font-medium">Métricas y Reportes</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => exportToCSV([currentKpis], 'kpis_report')} className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10 cursor-pointer">
                <Download className="w-4 h-4" />
                Exportar Reporte
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
            <button 
              onClick={() => setKpiContext('global')}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${kpiContext === 'global' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              General FSM
            </button>
            <button 
              onClick={() => setKpiContext('solar')}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${kpiContext === 'solar' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Sun className="w-4 h-4" /> Solar
            </button>
            <button 
              onClick={() => setKpiContext('hfo')}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${kpiContext === 'hfo' ? 'bg-white text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Wrench className="w-4 h-4" /> HFO
            </button>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button onClick={() => window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Esta función está en desarrollo.' } }))}  className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Calendar className="w-4 h-4 text-slate-400" />
              {dateRange}
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>
          </div>
        </div>

        {/* Fila 1: KPIs Principales (Bento Grid) Dinámicos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-bottom-2 duration-300">
          
          {currentKpis.map((kpi) => {
            const Icon = kpi.icon;
            
            // Map color string to Tailwind classes
            const colorConfig: Record<string, { bg: string, text: string, lightBg: string, border: string }> = {
              emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', lightBg: 'bg-emerald-100', border: 'border-emerald-200' },
              blue: { bg: 'bg-blue-50', text: 'text-blue-600', lightBg: 'bg-blue-100', border: 'border-blue-200' },
              amber: { bg: 'bg-amber-50', text: 'text-amber-600', lightBg: 'bg-amber-100', border: 'border-amber-200' },
              indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', lightBg: 'bg-indigo-100', border: 'border-indigo-200' },
              orange: { bg: 'bg-orange-50', text: 'text-orange-600', lightBg: 'bg-orange-100', border: 'border-orange-200' },
              slate: { bg: 'bg-slate-100', text: 'text-slate-700', lightBg: 'bg-slate-200', border: 'border-slate-300' },
            };
            
            const conf = colorConfig[kpi.color] || colorConfig.blue;

            return (
              <div key={kpi.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${conf.bg} ${conf.text} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${ kpi.trendType === 'positive' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : kpi.trendType === 'negative' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-slate-100 text-slate-700 dark:text-slate-200 border-slate-200' }`}>
                    {kpi.trend}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{kpi.title}</p>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{kpi.value}</h2>
              </div>
            );
          })}

        </div>

        {/* Fila 2: Gráficos (Simulados con Tailwind) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Gráfico 1: Distribución de Servicios (Recharts) */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" /> Distribución de Servicios (30 días)
              </h3>
            </div>
            <div className="flex-1 w-full h-64 mt-4">
              
                <PieChart width={400} height={256}>
                  <Pie
                    data={[
                      { name: 'Preventivo', value: 45 },
                      { name: 'Correctivo', value: 20 },
                      { name: 'Instalaciones', value: 15 },
                      { name: 'Inspección', value: 10 },
                      { name: 'Emergencia', value: 10 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      '#10b981', // emerald
                      '#f59e0b', // amber
                      '#3b82f6', // blue
                      '#8b5cf6', // violet
                      '#ef4444', // red
                    ].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              
            </div>
          </div>

          {/* Gráfico 2: Alertas Críticas por Planta */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Índice de Criticidad por Planta
              </h3>
            </div>

            <div className="flex-1 flex flex-col gap-6 justify-center">
              
              <div className="group cursor-pointer">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 transition-colors">Solar Bósforo</span>
                  <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-md text-xs">82 alertas</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-3 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-red-400 to-red-600 h-full rounded-full w-[90%] transition-all"></div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 transition-colors">Térmica Nejapa (HFO)</span>
                  <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md text-xs">45 alertas</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-3 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full w-[65%] transition-all"></div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 transition-colors">Valle Solar</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-xs">28 alertas</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-3 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full w-[30%] transition-all"></div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 transition-colors">Solar Capella</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-xs">12 alertas</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-3 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full w-[15%] transition-all"></div>
                </div>
              </div>

            </div>
          </div>

        </div>
        {/* Fila 3: D3.js Trend Chart */}
        <div className="mt-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" /> Tendencias de Generación de Energía Solar y Eficiencia
            </h3>
          </div>
          
          <D3TrendChart />
        </div>
      </main>
    </div>
  );
}
