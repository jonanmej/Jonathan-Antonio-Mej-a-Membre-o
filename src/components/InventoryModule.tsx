import autoTable from 'jspdf-autotable';
import React, { useState } from 'react';
import BackToDashboardButton from './BackToDashboardButton';
import { exportToCSV } from '../utils/csv';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, 
  Package, ArrowLeft, Search, Filter, Camera, X, 
  Sun, Wrench, Plus, Shield, Droplets, 
  AlertTriangle, History, ArrowDownToLine, ArrowUpFromLine, FileText, Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { TOTAL_PAGES_EXP, loadCorporateLogos, drawCorporateHeader, drawCorporateFooter, addDocumentControlTable } from '../utils/pdfCorporateLayout';
import { svgEAConsulting, getLogoBase64 } from '../utils/logos';

interface InventoryModuleProps {
  onBack: () => void;
}

type Category = 'solar' | 'hfo' | 'tools' | 'consumables' | 'ppe' | 'general';
type Status = 'in_stock' | 'low_stock' | 'out_of_stock';



export interface InventoryItem {
  image?: string;
  barcode?: string;
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: "solar" | "hfo" | "tools" | "consumables" | "ppe" | "general" | string;
  subCategory: string;
  stock: number;
  unit: string;
  status: "in_stock" | "low_stock" | "out_of_stock" | string;
  location: string;
  warehouseLocation?: string;
  lastUpdated: string;
  assignments?: any[];
}

export interface InventoryAssignment {
  id: string;
  listId: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  user: string;
  cliente?: string;
  planta?: string;
  serviceCategory?: string;
  serviceType?: string;
}



export const DEFAULT_INVENTORY_ITEMS: InventoryItem[] = [
    {
      id: 'item-1',
      sku: 'SOL-PVS-01',
      name: 'PVSTOP (Extintor Solar)',
      description: 'Líquido extintor especializado para apagar paneles solares en llamas o aislar energía.',
      category: 'solar',
      subCategory: 'Seguridad',
      stock: 45,
      unit: 'unds',
      status: 'in_stock',
      assignments: [], location: 'Almacén Central', lastUpdated: new Date().toISOString()
    },
    {
      id: 'item-2',
      sku: 'HFO-FLT-88',
      name: 'Filtro de Aceite Centrífugo',
      description: 'Repuesto para motor de combustión HFO (Wärtsilä).',
      category: 'hfo',
      subCategory: 'Mecánica',
      stock: 10,
      unit: 'unds',
      status: 'low_stock',
      assignments: [], location: 'Almacén Central', lastUpdated: new Date().toISOString()
    },
    {
      id: 'item-3',
      sku: 'SOL-CHM-05',
      name: 'CHEMITEK Solar Wash Protect',
      description: 'Agente de limpieza avanzado para remover polvo y suciedad incrustada en paneles solares y repeler agua.',
      category: 'solar',
      subCategory: 'Limpieza',
      stock: 15,
      unit: 'Lts',
      status: 'low_stock',
      assignments: [], location: 'Almacén Central', lastUpdated: new Date().toISOString()
    },
    {
      id: 'item-4',
      sku: 'SOL-CHM-06',
      name: 'CHEMITEK Rust Removal',
      description: 'Removedor de óxido especializado para marcos de paneles solares y estructuras fotovoltaicas.',
      category: 'solar',
      subCategory: 'Limpieza',
      stock: 8,
      unit: 'Lts',
      status: 'low_stock',
      assignments: [], location: 'Almacén Central', lastUpdated: new Date().toISOString()
    },
    {
      id: 'item-5',
      sku: 'HFO-VLV-12',
      name: 'Válvula de Inyección',
      description: 'Válvula de alta presión para inyector principal de combustible pesado.',
      category: 'hfo',
      subCategory: 'Inyección',
      stock: 24,
      unit: 'unds',
      status: 'in_stock',
      assignments: [], location: 'Almacén Central', lastUpdated: new Date().toISOString()
    },
    {
      id: 'item-6',
      sku: 'SOL-MC4-01',
      name: 'Conectores MC4 (Pares)',
      description: 'Conectores solares estándar MC4 para crimpado de cables fotovoltaicos de 4mm y 6mm.',
      category: 'solar',
      subCategory: 'Eléctrico',
      stock: 150,
      unit: 'pares',
      status: 'in_stock',
      assignments: [], location: 'Almacén Central', lastUpdated: new Date().toISOString()
    }
  ];

export default function InventoryModule({ onBack }: InventoryModuleProps) {

  const [isAddingNew, setIsAddingNew] = useState(false);

  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('solar');
  const [newWarehouseLoc, setNewWarehouseLoc] = useState('');
  const [newItemStock, setNewItemStock] = useState('0');
  const [newItemUnit, setNewItemUnit] = useState('pz');
  const [newItemBarcode, setNewItemBarcode] = useState('');
  const [newItemImage, setNewItemImage] = useState<string | null>(null);
  const [scanContext, setScanContext] = useState<'search'|'newItem'>('search');


  const [filterType, setFilterType] = useState<'all' | 'solar' | 'hfo'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [inventoryItems, setInventoryItems] = React.useState<InventoryItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventario' | 'consumos' | 'solicitudes'>('inventario');
  
  
  const handleSaveNewItem = () => {
    if (!newItemName) {
       window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'El nombre es requerido', type: 'error' } }));
       return;
    }
    const newItem = {
      id: 'item-' + Date.now(),
      sku: newItemBarcode || ('SKU-' + Math.floor(Math.random() * 10000)),
      name: newItemName,
      category: newItemCategory as Category,
      subCategory: 'General',
      stock: parseInt(newItemStock) || 0,
      unit: newItemUnit,
      location: 'Almacén Principal',
      status: (parseInt(newItemStock) > 5 ? 'in_stock' : parseInt(newItemStock) > 0 ? 'low_stock' : 'out_of_stock') as Status,
      lastUpdated: new Date().toISOString().split('T')[0],
      description: 'Artículo añadido manualmente.',
      assignments: [],
      barcode: newItemBarcode,
      image: newItemImage
    };
    
    const updated = [newItem, ...inventoryItems];
    setInventoryItems(updated);
    localStorage.setItem('fsm_inventory_items', JSON.stringify(updated));
    
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Artículo añadido exitosamente', type: 'success' } }));
    setIsAddingNew(false);
    
    // reset
    setNewItemName('');
    setNewItemStock('0');
    setNewItemBarcode('');
    setNewItemImage(null);
    setNewWarehouseLoc('');
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItemImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner('reader', { qrbox: { width: 250, height: 250 }, fps: 10 }, false);
      scanner.render((text) => {
        if (scanContext === 'newItem') { setNewItemBarcode(text); } else { setSearchTerm(text); }
        setIsScanning(false);
        scanner.clear();
      }, (err) => {});
      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [isScanning]);

  const allConsumptions = React.useMemo(() => {
    const outs = inventoryItems.flatMap(item => 
      (item.assignments || [])
        .filter(a => a.type === 'out')
        .map(a => ({ ...a, itemName: item.name, itemUnit: item.unit }))
    );
    return outs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [inventoryItems]);
  const recentConsumptions = allConsumptions.slice(0, 5);

  const lowStockCount = inventoryItems.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock').length;

  
  React.useEffect(() => {
    const saved = localStorage.getItem('fsm_inventory_items');
    if (saved) {
      setInventoryItems(JSON.parse(saved));
    } else {
      setInventoryItems(DEFAULT_INVENTORY_ITEMS);
      localStorage.setItem('fsm_inventory_items', JSON.stringify(DEFAULT_INVENTORY_ITEMS));
    }
  }, []);



  const [materialRequests, setMaterialRequests] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchRequests = () => {
      const all = JSON.parse(localStorage.getItem('fsm_material_requests') || '[]');
      setMaterialRequests(all.filter((r: any) => r.type === 'inventory'));
    };
    fetchRequests();
    
    // Polling or event listener (simplification for same-window updates)
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateReqStatus = (id: string, newStatus: string) => {
    const all = JSON.parse(localStorage.getItem('fsm_material_requests') || '[]');
    const updated = all.map((r: any) => r.id === id ? { ...r, status: newStatus } : r);
    localStorage.setItem('fsm_material_requests', JSON.stringify(updated));
    setMaterialRequests(updated.filter((r: any) => r.type === 'inventory'));
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                          item.category === filterType;
    return matchesSearch && matchesFilter;
  });

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generateMonthlyReport = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const logos = await loadCorporateLogos();
      
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyConsumptions = allConsumptions.filter(c => new Date(c.date) >= firstDay);

      const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      const title = `Reporte Mensual de Consumo - ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
      const code = 'FOR-INV-01';

      doc.setFont("helvetica", "normal");
      let yPos = drawCorporateHeader(doc, title, code, logos);
      
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(`Resumen de inventario utilizado durante el mes.`, 15, yPos);
      yPos += 8;

      const head = [['Fecha', 'Herramienta/Equipo', 'Técnico', 'Cantidad Usada', 'Proyecto/Cliente']];
      const body = monthlyConsumptions.map(c => {
        const item = null /* items not defined this way */;
        return [
          new Date(c.date).toLocaleDateString(),
          (c as any).itemName,
          (c as any).user,
          (c as any).quantity.toString(),
          (c as any).cliente || (c as any).planta || 'Uso General'
        ];
      });

      autoTable(doc, {
        startY: yPos,
        head: head,
        body: body,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246], textColor: 255, fontSize: 9, font: 'helvetica' },
        styles: { fontSize: 8, font: 'helvetica' },
        margin: { left: 15, right: 15, top: 40, bottom: 35 },
        didDrawPage: function(data) {
          drawCorporateHeader(doc, title, code, logos);
          drawCorporateFooter(doc, data.pageNumber, logos);
        }
      });

      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(TOTAL_PAGES_EXP);
      }

      doc.save(`Reporte_Consumo_${monthNames[now.getMonth()]}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (selectedItem) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans animate-in slide-in-from-right duration-300">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 gap-4">
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedItem.category === 'solar' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-700'}`}>
                  {selectedItem.category === 'solar' ? (selectedItem.name.includes('CHEMITEK') ? <Droplets className="w-5 h-5" /> : <Sun className="w-5 h-5" />) : <Wrench className="w-5 h-5" />}
                </div>
                <div>
                  <h1 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{selectedItem.name}</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">SKU: {selectedItem.sku} • Categoría: {selectedItem.subCategory}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Stats & Actions */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">Estado de Inventario</h3>
                </div>
                <div className="p-5 space-y-5">
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Stock Actual</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-4xl font-bold ${ selectedItem.status === 'out_of_stock' ? 'text-red-600' : selectedItem.status === 'low_stock' ? 'text-amber-600' : 'text-slate-900 dark:text-white' }`}>
                        {selectedItem.stock}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">{selectedItem.unit}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Esta función está en desarrollo.' } }))}  className="flex flex-col items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-100">
                      <ArrowDownToLine className="w-5 h-5" />
                      <span className="text-xs font-semibold">Entrada (+)</span>
                    </button>
                    <button onClick={() => window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Esta función está en desarrollo.' } }))}  className="flex flex-col items-center justify-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors border border-amber-100">
                      <ArrowUpFromLine className="w-5 h-5" />
                      <span className="text-xs font-semibold">Salida (-)</span>
                    </button>
                  </div>

                  {selectedItem.status === 'out_of_stock' && (
                    <button onClick={() => window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Esta función está en desarrollo.' } }))}  className="w-full py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 flex items-center justify-center gap-2 transition-colors">
                      <AlertTriangle className="w-4 h-4" /> Solicitar Compra
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">Detalles del Producto</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Descripción</p>
                    <p className="text-sm text-slate-900 dark:text-white leading-relaxed">{selectedItem.description}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Ubicación en Almacén</p>
                    <p className="text-sm text-slate-900 dark:text-white font-medium">Estante B - Nivel 3</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Punto de Reorden</p>
                    <p className="text-sm text-slate-900 dark:text-white font-medium">
                      {selectedItem.category === 'solar' && selectedItem.unit === 'Lts' ? '20 Lts' : '10 unds'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: History */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Historial de Movimientos</h3>
                  </div>
                  <button onClick={() => exportToCSV(inventoryItems, 'inventario_easerviceconnect')} className="text-sm text-amber-600 font-semibold hover:text-amber-700 cursor-pointer">Exportar CSV</button>
                </div>
                
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  <div className="p-5 flex items-center justify-between hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <ArrowUpFromLine className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Salida a Campo</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Retirado por: Carlos Mendoza • Orden: FSM-2918</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-600">- 2 {selectedItem.unit}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Ayer, 08:30 AM</p>
                    </div>
                  </div>

                  <div className="p-5 flex items-center justify-between hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <ArrowDownToLine className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Entrada por Compra</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Ingresado por: Admin • Ref: PO-8832</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">+ 10 {selectedItem.unit}</p>
                      <p className="text-xs text-slate-400 mt-0.5">12 Oct 2026</p>
                    </div>
                  </div>
                  
                  <div className="p-5 flex items-center justify-between hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <ArrowUpFromLine className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Salida a Campo</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Retirado por: Equipo 3 • Orden: FSM-2844</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-600">- 5 {selectedItem.unit}</p>
                      <p className="text-xs text-slate-400 mt-0.5">05 Oct 2026</p>
                    </div>
                  </div>
                </div>
                
                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 text-center">
                  <button onClick={() => window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Esta función está en desarrollo.' } }))}  className="text-sm font-semibold text-amber-600 hover:text-amber-800">Ver movimientos anteriores</button>
                </div>
              </div>
            </div>
            
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans animate-in fade-in">
      {/* Header */}
      <header className="bg-amber-600 border-b border-amber-700 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BackToDashboardButton 
                id="btn-inventory-back"
                onClick={onBack}
                variant="glass"
              />
              <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
              <h1 className="font-bold text-lg sm:text-xl text-white">Control de Inventarios</h1>
              <div className="hidden md:flex items-center gap-2 bg-amber-700/50 px-3 py-1.5 rounded-lg border border-amber-500/30">
                <Package className="w-4 h-4 text-amber-200" />
                <span className="text-xs text-amber-100 font-medium">Gestión de Almacén</span>
              </div>
            </div>
            <button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10 shadow-sm cursor-pointer">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Artículo</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total de SKUs</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{inventoryItems.length}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-red-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-2 h-full bg-red-500"></div>
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Quiebres de Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {inventoryItems.filter(i => i.status === 'out_of_stock').length}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-2 h-full bg-amber-500"></div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Punto de Reorden (Bajo)</p>
              <p className="text-2xl font-bold text-amber-600">
                {inventoryItems.filter(i => i.status === 'low_stock').length}
              </p>
            </div>
          </div>
        </div>

        

                {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 mb-6 pb-1">
          <button 
            onClick={() => setActiveTab('inventario')}
            className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${activeTab === 'inventario' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
          >
            Inventario General
          </button>
          <button 
            onClick={() => setActiveTab('consumos')}
            className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${activeTab === 'consumos' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
          >
            Consumos Recientes
          </button>
          <button 
            onClick={() => setActiveTab('solicitudes')}
            className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${activeTab === 'solicitudes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
          >
            Solicitudes de Campo
            {materialRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                {materialRequests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'inventario' ? (
          <>
            {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex flex-1 w-full sm:max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar repuesto, SKU o categoría..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm"
            />
            <button 
              onClick={() => { setScanContext('search'); setIsScanning(true); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Escanear Código (QR o Barras)"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex w-full sm:w-auto items-center gap-3 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar scroll-wheel-horizontal">
            <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
              <button 
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterType === 'all' ? 'bg-white dark:bg-slate-800 text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-white'}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setFilterType('solar')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${filterType === 'solar' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-white'}`}
              >
                <Sun className="w-4 h-4" /> Solar / Químicos
              </button>
              <button 
                onClick={() => setFilterType('hfo')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${filterType === 'hfo' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-white'}`}
              >
                <Wrench className="w-4 h-4" /> Repuestos HFO
              </button>
            </div>
          </div>
        </div>

        {/* Inventory List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className={`bg-white dark:bg-slate-800 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden ${ item.status === 'out_of_stock' ? 'border-red-200' : item.status === 'low_stock' ? 'border-amber-200' : 'border-slate-200 dark:border-slate-700' }`}
            >
              {item.status === 'out_of_stock' && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-500 flex items-center justify-center translate-x-8 -translate-y-8 rotate-45">
                  <span className="text-white text-[10px] font-bold mt-8">VACÍO</span>
                </div>
              )}
              {item.status === 'low_stock' && (
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
              )}

              <div className="flex justify-between items-start mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${ item.category === 'solar' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-700' }`}>
                  {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" /> : (item.category === 'solar' ? (item.name.includes('CHEMITEK') ? <Droplets className="w-6 h-6" /> : <Sun className="w-6 h-6" />) : <Wrench className="w-6 h-6" />)}
                </div>
                <div className={`flex flex-col items-end ${item.status === 'out_of_stock' ? 'mr-6' : ''}`}>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${ item.status === 'out_of_stock' ? 'bg-red-50 text-red-700 border-red-200' : item.status === 'low_stock' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200' }`}>
                    Stock: {item.stock} {item.unit}
                  </span>
                  {item.status === 'low_stock' && (
                    <span className="text-[10px] font-medium text-amber-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Punto de reorden
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mb-4 flex-1">
                <p className="text-xs text-slate-400 font-medium mb-1">SKU: {item.sku} {item.barcode && `(Cód: ${item.barcode})`} • {item.subCategory}</p>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{item.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{item.description}</p>
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <button 
                  onClick={() => setSelectedItem(item)}
                  className={`w-full text-center text-sm font-semibold py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 ${ item.status === 'out_of_stock' ? 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-100' : 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-100' }`}
                >
                  {item.status === 'out_of_stock' ? (
                    <><AlertTriangle className="w-4 h-4" /> Solicitar Compra</>
                  ) : (
                    'Gestionar Inventario'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
          </>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 animate-in fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <History className="w-5 h-5 text-amber-500" /> Historial de Consumos
              </h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={generateMonthlyReport}
                  disabled={isGeneratingPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  {isGeneratingPDF ? 'Generando...' : 'Reporte Mensual ISO'}
                </button>
                <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400">
                  {allConsumptions.length} registros
                </div>
              </div>
            </div>
            {allConsumptions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-lg font-bold text-slate-700 dark:text-slate-200">No hay registros</h4>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Aún no se han retirado ítems del inventario.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 uppercase">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Ítem</th>
                      <th className="px-4 py-3">Cantidad</th>
                      <th className="px-4 py-3">Destino</th>
                      <th className="px-4 py-3">Técnico</th>
                      <th className="px-4 py-3 rounded-r-lg">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {allConsumptions.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-4 font-medium text-slate-800 dark:text-slate-200">{(c as any).itemName}</td>
                        <td className="px-4 py-4 font-bold text-amber-600">-{c.quantity} {c.itemUnit}</td>
                        <td className="px-4 py-4">
                          <span className="block font-medium text-slate-700 dark:text-slate-300">{(c as any).planta || 'N/A'}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{c.serviceCategory || 'Operación'}</span>
                        </td>
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">{(c as any).user.charAt(0).toUpperCase()}</div>
                          {(c as any).user}
                        </td>
                        <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{new Date(c.date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeTab === 'solicitudes' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 animate-in fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-indigo-500" /> Solicitudes de Campo
              </h3>
            </div>
            
            {materialRequests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">No hay solicitudes de repuestos/consumibles pendientes.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 uppercase">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Estado</th>
                      <th className="px-4 py-3">Ítem / Urgencia</th>
                      <th className="px-4 py-3">Técnico</th>
                      <th className="px-4 py-3">Justificación</th>
                      <th className="px-4 py-3 rounded-r-lg">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {materialRequests.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${ r.status === 'pending' ? 'bg-amber-100 text-amber-700' : r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : r.status === 'in_process' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700' }`}>
                            {r.status === 'pending' ? 'Pendiente' : r.status === 'approved' ? 'Aprobado' : r.status === 'in_process' ? 'En Proceso' : 'Rechazado'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-bold text-slate-800 dark:text-slate-200">{r.item}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                            <span className={`w-2 h-2 rounded-full ${r.urgency === 'high' ? 'bg-red-500' : r.urgency === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                            {r.quantity} unidad(es) - {r.urgency.toUpperCase()}
                          </p>
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-600 dark:text-slate-300">
                          {r.requestedBy}
                          <p className="text-xs text-slate-400 font-normal">{new Date(r.date).toLocaleDateString()}</p>
                        </td>
                        <td className="px-4 py-4 text-slate-500 dark:text-slate-400 italic max-w-xs truncate">
                          "{r.justification}"
                        </td>
                        <td className="px-4 py-4">
                          {r.status === 'pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdateReqStatus(r.id, 'approved')} className="px-3 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors">Aprobar</button>
                              <button onClick={() => handleUpdateReqStatus(r.id, 'rejected')} className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors">Rechazar</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* QR Scanner Modal */}
      
      {isAddingNew && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Añadir Nuevo Artículo</h3>
              <button onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Fotografía del Artículo</label>
                <div className="flex items-center gap-4">
                  {newItemImage ? (
                     <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                       <img src={newItemImage} className="w-full h-full object-cover" />
                       <button onClick={() => setNewItemImage(null)} className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-1"><X className="w-3 h-3" /></button>
                     </div>
                  ) : (
                     <label className="flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                       <Camera className="w-6 h-6 text-slate-400" />
                       <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                     </label>
                  )}
                  <div className="text-xs text-slate-500">Toma una foto o selecciona una imagen para rápida identificación.</div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nombre del Artículo / Repuesto</label>
                <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" placeholder="Ej. Inversor 50kW" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Código de Barras / QR</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={newItemBarcode} onChange={e => setNewItemBarcode(e.target.value)} className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" placeholder="Código..." />
                  <button onClick={() => { setScanContext('newItem'); setIsScanning(true); }} className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-200">
                    <QrCode className="w-4 h-4" /> Escanear
                  </button>
                </div>
                <button onClick={() => setNewItemBarcode('EAS-' + Math.random().toString(36).substring(2,8).toUpperCase())} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  ¿No tiene código? Generar uno nuevo
                </button>
              </div>

              
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Ubicación Física en Bodega</label>
                  <input type="text" value={newWarehouseLoc} onChange={e => setNewWarehouseLoc(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" placeholder="Ej. Pasillo 3, Estante B" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Categoría</label>
                  <select value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500">
                    <option value="solar">Equipos Solares</option>
                    <option value="hfo">Repuestos HFO</option>
                    <option value="tools">Herramientas y Equipos</option>
                    <option value="consumables">Consumibles y Lubricantes</option>
                    <option value="ppe">EPP / Seguridad</option>
                    <option value="general">Uso General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Unidad</label>
                  <select value={newItemUnit} onChange={e => setNewItemUnit(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500">
                    <option value="pz">Pieza (pz)</option>
                    <option value="caja">Caja</option>
                    <option value="l">Litros (L)</option>
                    <option value="kg">Kilos (kg)</option>
                    <option value="m">Metros (m)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Stock Inicial</label>
                <input type="number" value={newItemStock} onChange={e => setNewItemStock(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" />
              </div>
              
              <button onClick={handleSaveNewItem} className="mt-2 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
                Guardar Artículo
              </button>
            </div>
          </div>
        </div>
      )}

      {isScanning && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Escanear Código</h3>
              <button onClick={() => setIsScanning(false)} className="text-slate-400 hover:text-slate-600 p-1 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-black">
              <div id="reader" className="w-full"></div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 text-center text-sm text-slate-500 dark:text-slate-400">
              Apunta la cámara al código de barras o QR del ítem.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
