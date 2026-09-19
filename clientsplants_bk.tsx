import React, { useState } from 'react';
import { 
  Building2, ArrowLeft, Search, Filter, MapPin, 
  Sun, Zap, CheckCircle2, AlertTriangle, Wrench, 
  Plus, Users, FileText, Activity
} from 'lucide-react';

interface ClientsPlantsModuleProps {
  onBack: () => void;
}

type PlantStatus = 'optimo' | 'mantenimiento' | 'alerta';

interface Plant {
  id: string;
  name: string;
  client: string;
  type: string;
  capacity: string;
  contractExp: string;
  status: PlantStatus;
  coords: { top: string; left: string };
  lastService?: string;
}

export default function ClientsPlantsModule({ onBack }: ClientsPlantsModuleProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'solar' | 'hfo'>('all');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const plants: Plant[] = [
    {
      id: 'SOL-001',
      name: 'Planta Solar Choluteca',
      client: 'EcoEnergy S.A.',
      type: 'Fotovoltaica',
      capacity: '10 MW',
      contractExp: 'Nov 2026',
      status: 'optimo',
      lastService: 'Hace 2 semanas',
      coords: { top: '30%', left: '40%' }
    },
    {
      id: 'HFO-042',
      name: 'Planta Pavana',
      client: 'Lufussa',
      type: 'Motor HFO',
      capacity: '150 MW',
      contractExp: 'Ene 2025',
      status: 'mantenimiento',
      lastService: 'En curso',
      coords: { top: '60%', left: '65%' }
    },
    {
      id: 'SOL-088',
      name: 'Planta Nacaome 2',
      client: 'Energía del Sur',
      type: 'Fotovoltaica',
      capacity: '20 MW',
      contractExp: 'En Revisión (Vencido)',
      status: 'alerta',
      lastService: 'Hace 4 meses',
      coords: { top: '45%', left: '30%' }
    },
    {
      id: 'SOL-102',
      name: 'Techos Mall Multiplaza',
      client: 'Grupo Roble',
      type: 'Fotovoltaica',
      capacity: '1.5 MW',
      contractExp: 'Dic 2025',
      status: 'optimo',
      lastService: 'Hace 1 mes',
      coords: { top: '25%', left: '55%' }
    },
    {
      id: 'SOL-105',
      name: 'Planta Marcovia',
      client: 'EcoEnergy S.A.',
      type: 'Fotovoltaica',
      capacity: '35 MW',
      contractExp: 'Oct 2027',
      status: 'optimo',
      lastService: 'Hace 5 días',
      coords: { top: '35%', left: '45%' }
    }
  ];

  const filteredPlants = plants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                          (filterType === 'solar' && p.type === 'Fotovoltaica') ||
                          (filterType === 'hfo' && p.type === 'Motor HFO');
    return matchesSearch && matchesFilter;
  });


  if (selectedPlant) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans animate-in slide-in-from-right duration-300">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 gap-4">
              <button 
                onClick={() => setSelectedPlant(null)}
                className="text-slate-500 hover:text-slate-900 p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedPlant.type === 'Fotovoltaica' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-700'}`}>
                  {selectedPlant.type === 'Fotovoltaica' ? <Sun className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                </div>
                <div>
                  <h1 className="font-bold text-lg text-slate-900 leading-tight">{selectedPlant.name}</h1>
                  <p className="text-xs text-slate-500">{selectedPlant.id} • {selectedPlant.client}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Columna Izquierda: Detalles del Contrato y Contacto */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-bold text-slate-800">Ficha Técnica</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Estado General</p>
                    <div className="mt-1">
                      {selectedPlant.status === 'optimo' && (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Operativa
                        </span>
                      )}
                      {selectedPlant.status === 'mantenimiento' && (
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-amber-200">
                          <Wrench className="w-3.5 h-3.5" /> En Mantenimiento
                        </span>
                      )}
                      {selectedPlant.status === 'alerta' && (
                        <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-red-200">
                          <AlertTriangle className="w-3.5 h-3.5" /> Requiere Atención
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">Capacidad Instalada</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedPlant.capacity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">Tipo de Instalación</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedPlant.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">Vigencia Contrato O&M</p>
                    <p className={`text-sm font-semibold ${selectedPlant.status === 'alerta' ? 'text-red-600' : 'text-slate-900'}`}>
                      {selectedPlant.contractExp}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-bold text-slate-800">Contactos en Sitio</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      RM
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Roberto Martínez</p>
                      <p className="text-xs text-slate-500">Jefe de Planta</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold">
                      CS
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Carlos Sánchez</p>
                      <p className="text-xs text-slate-500">Supervisión Eléctrica</p>
                    </div>
                  </div>
                  <button className="w-full mt-2 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    Ver Directorio Completo
                  </button>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Historial y Visitas */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">Acciones Rápidas</h3>
                  <p className="text-xs text-slate-500 mt-1">Generar nueva orden o visita para esta planta</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nueva Orden FSM
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-bold text-slate-800">Historial Reciente de Servicios</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="p-5 flex gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex flex-shrink-0 items-center justify-center text-emerald-600 mt-1">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-slate-900 text-sm">Limpieza Fotovoltaica Completa</h4>
                        <span className="text-xs text-slate-400">Hace 2 semanas</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">Realizado por: Cuadrilla Alfa. Consumo: 450 Galones (Agua Osmotizada). Sin incidencias.</p>
                      <button className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800">Ver Reporte FSM</button>
                    </div>
                  </div>

                  <div className="p-5 flex gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex flex-shrink-0 items-center justify-center text-indigo-600 mt-1">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-slate-900 text-sm">Mantenimiento Preventivo (Inversores)</h4>
                        <span className="text-xs text-slate-400">Hace 1 mes</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">Realizado por: Ing. Jorge Luis. Cambio de filtros y limpieza de disipadores.</p>
                      <button className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800">Ver Reporte FSM</button>
                    </div>
                  </div>

                  <div className="p-5 flex gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex flex-shrink-0 items-center justify-center text-rose-600 mt-1">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-slate-900 text-sm">Visita Técnica (Falla String 4)</h4>
                        <span className="text-xs text-slate-400">Hace 3 meses</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">Realizado por: Soporte Técnico. Reemplazo de 2 conectores MC4 fundidos.</p>
                      <button className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800">Ver Reporte FSM</button>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-center">
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">Cargar más historial</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans animate-in fade-in">
      {/* Header */}
      <header className="bg-blue-600 border-b border-blue-700 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="text-blue-50 hover:text-white p-2 -ml-2 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="font-bold text-xl text-white">Clientes y Plantas</h1>
              <div className="hidden sm:flex items-center gap-2 bg-blue-700/50 px-3 py-1.5 rounded-lg border border-blue-500/30">
                <Building2 className="w-4 h-4 text-blue-200" />
                <span className="text-sm text-blue-100 font-medium">Gestión de Activos</span>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Cliente/Planta</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Clientes</p>
              <p className="text-2xl font-bold text-slate-900">24</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Plantas Activas</p>
              <p className="text-2xl font-bold text-slate-900">42</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Capacidad O&M</p>
              <p className="text-2xl font-bold text-slate-900">850<span className="text-base font-medium text-slate-500 ml-1">MW</span></p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Contratos por Expirar</p>
              <p className="text-2xl font-bold text-red-600">3</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-1 w-full sm:max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar planta, cliente o ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          
          <div className="flex w-full sm:w-auto items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button 
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterType === 'all' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setFilterType('solar')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${filterType === 'solar' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Sun className="w-4 h-4" /> Solar
              </button>
              <button 
                onClick={() => setFilterType('hfo')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${filterType === 'hfo' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Zap className="w-4 h-4" /> HFO
              </button>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button 
                onClick={() => setActiveTab('list')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'list' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Lista
              </button>
              <button 
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'map' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Mapa
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlants.map((plant) => (
              <div key={plant.id} className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border ${plant.status === 'alerta' ? 'border-red-200 relative overflow-hidden' : 'border-slate-200'}`}>
                {plant.status === 'alerta' && <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>}
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${plant.type === 'Fotovoltaica' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-700'}`}>
                      {plant.type === 'Fotovoltaica' ? <Sun className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{plant.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{plant.id} • {plant.client}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-5">
                  {plant.status === 'optimo' && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Operativa
                    </span>
                  )}
                  {plant.status === 'mantenimiento' && (
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-amber-200">
                      <Wrench className="w-3.5 h-3.5" /> En Mantenimiento
                    </span>
                  )}
                  {plant.status === 'alerta' && (
                    <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-red-200">
                      <AlertTriangle className="w-3.5 h-3.5" /> Revisión Contrato
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200">
                    <Activity className="w-3.5 h-3.5" /> {plant.capacity}
                  </span>
                </div>
                
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm items-center border-b border-slate-50 pb-2">
                    <span className="text-slate-500 flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> Cliente</span>
                    <span className="font-medium text-slate-900">{plant.client}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center border-b border-slate-50 pb-2">
                    <span className="text-slate-500 flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400" /> Vencimiento O&M</span>
                    <span className={`font-medium ${plant.status === 'alerta' ? 'text-red-600' : 'text-slate-900'}`}>{plant.contractExp}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-500 flex items-center gap-2"><Wrench className="w-4 h-4 text-slate-400" /> Último Servicio</span>
                    <span className="font-medium text-slate-700">{plant.lastService}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <button onClick={() => setSelectedPlant(plant)} className="flex-1 bg-blue-50 text-blue-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors cursor-pointer text-center">
                    Ver Expediente
                  </button>
                  <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-center shadow-sm hover:shadow">
                    Historial FSM
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 w-full min-h-[500px] bg-slate-100 border border-slate-200 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner">
            {/* Fake Grid Pattern for Map */}
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
            
            {/* Fake Map Pins */}
            {filteredPlants.map(plant => (
              <div key={plant.id} className="absolute group cursor-pointer z-10" style={plant.coords}>
                <MapPin className={`w-10 h-10 drop-shadow-md -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform ${
                  plant.status === 'optimo' ? 'text-emerald-500' : 
                  plant.status === 'mantenimiento' ? 'text-amber-500' : 'text-red-500'
                } ${plant.status === 'alerta' ? 'animate-bounce' : ''}`} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-xl text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none -mt-14 border border-slate-100 flex flex-col items-center">
                  <span className="text-slate-900">{plant.name}</span>
                  <span className={`text-[10px] mt-0.5 ${
                    plant.status === 'optimo' ? 'text-emerald-600' : 
                    plant.status === 'mantenimiento' ? 'text-amber-600' : 'text-red-600'
                  }`}>{plant.client}</span>
                </div>
              </div>
            ))}
            
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-3 rounded-xl shadow-sm border border-slate-200 text-xs font-medium space-y-2">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Operativa</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> En Mantenimiento</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Alerta / Revisión</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
