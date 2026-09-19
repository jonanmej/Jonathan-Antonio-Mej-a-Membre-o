import autoTable from 'jspdf-autotable';
import React, { useState, useEffect, useRef } from 'react';
import { TOTAL_PAGES_EXP, loadCorporateLogos, drawCorporateHeader, drawCorporateFooter, addDocumentControlTable } from '../utils/pdfCorporateLayout';
import { Plus, Edit2, FileText, Trash2, Printer, MapPin, Building2, User as UserIcon, Calendar, ArrowLeft, Save, PlusCircle, X } from 'lucide-react';
import jsPDF from 'jspdf';
import { svgEAConsulting, getLogoBase64 } from '../utils/logos';
import { plants, SERVICE_CATEGORIES } from '../data'; // Assuming we have plants from data

interface EquipmentItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  inventoryItemId?: string;
}

interface EquipmentList {
  id: string;
  cliente: string;
  planta: string;
  date: string;
  createdBy: string;
  serviceCategory?: string;
  serviceType?: string;
  entryDate?: string;
  items: EquipmentItem[];
}

const CATEGORIES = [
  'Herramienta',
  'Equipo',
  'Insumo',
  'Equipo de protección personal',
  'Repuesto',
  'Adicional'
];

interface EquipmentListModuleProps {
  currentUser: string;
}

export default function EquipmentListModule({ currentUser }: EquipmentListModuleProps) {
  const [lists, setLists] = useState<EquipmentList[]>([]);
  const [viewState, setViewState] = useState<'list' | 'edit' | 'view'>('list');
  const [currentList, setCurrentList] = useState<EquipmentList | null>(null);

  // New form fields
  const [serviceCategory, setServiceCategory] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Inventory
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [selectedInventoryId, setSelectedInventoryId] = useState('');

  // For form
  const [cliente, setCliente] = useState('');
  const [planta, setPlanta] = useState('');
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [newItemCat, setNewItemCat] = useState(CATEGORIES[0]);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('Unidad');
  const [showValidation, setShowValidation] = useState(false);

  const uniqueClients = Array.from(new Set(plants.map(p => p.client))).sort();
  const availablePlants = cliente ? plants.filter(p => p.client === cliente).map(p => p.name).sort() : [];

  useEffect(() => {
    // Load inventory
    const inv = localStorage.getItem('fsm_inventory_items');
    if (inv) {
      setInventoryItems(JSON.parse(inv));
    }

    const saved = localStorage.getItem('fsm_equipment_lists');
    if (saved) {
      try {
        let parsedLists = JSON.parse(saved);
        // Migrate legacy category
        parsedLists = parsedLists.map((list) => ({
          ...list,
          items: list.items.map(item => ({
            ...item,
            category: item.category === 'Insumo varios' ? 'Insumo' : 
                      item.category === 'Adicionales' ? 'Adicional' : 
                      item.category
          }))
        }));
        setLists(parsedLists);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveLists = (newLists: EquipmentList[]) => {
    setLists(newLists);
    localStorage.setItem('fsm_equipment_lists', JSON.stringify(newLists));
  };

  const handleCreateNew = () => {
    setCliente('');
    setPlanta('');
    setServiceCategory('');
    setServiceType('');
    setEntryDate(new Date().toISOString().split('T')[0]);
    setItems([]);
    setCurrentList(null);
    setShowValidation(false);
    setViewState('edit');
  };

  const handleEdit = (list: EquipmentList) => {
    setCliente(list.cliente);
    setPlanta(list.planta);
    setServiceCategory(list.serviceCategory || '');
    setServiceType(list.serviceType || '');
    setEntryDate(list.entryDate || new Date().toISOString().split('T')[0]);
    setItems(list.items);
    setCurrentList(list);
    setViewState('edit');
    setShowValidation(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro que desea eliminar este listado?')) {
      saveLists(lists.filter(l => l.id !== id));
    }
  };

  const addItem = () => {
    if (!newItemDesc) return;
    const item: EquipmentItem = {
      id: Date.now().toString(),
      category: newItemCat,
      description: newItemDesc,
      quantity: newItemQty,
      unit: newItemUnit,
      inventoryItemId: selectedInventoryId || undefined
    };
    setItems([...items, item]);
    setNewItemDesc('');
    setNewItemQty(1);
    setSelectedInventoryId('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleSaveList = () => {
    if (!cliente || !planta || !serviceCategory || !serviceType) {
      setShowValidation(true);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Por favor, complete todos los campos obligatorios antes de generar el documento.' } }));
      return;
    }
    const newListId = currentList ? currentList.id : Date.now().toString();
    const newList: EquipmentList = {
      id: newListId,
      cliente,
      planta,
      serviceCategory,
      serviceType,
      entryDate,
      date: currentList ? currentList.date : new Date().toISOString(),
      createdBy: currentList ? currentList.createdBy : currentUser || 'Usuario Local',
      items
    };

    if (currentList) {
      saveLists(lists.map(l => l.id === currentList.id ? newList : l));
    } else {
      saveLists([...lists, newList]);
      
      // Deduct from inventory for NEW lists
      if (items.length > 0) {
        const currentInvRaw = localStorage.getItem('fsm_inventory_items');
        if (currentInvRaw) {
          try {
            let invItems = JSON.parse(currentInvRaw);
            let updated = false;
            
            items.forEach(reqItem => {
              if (reqItem.inventoryItemId) {
                const invIdx = invItems.findIndex((i: any) => i.id === reqItem.inventoryItemId);
                if (invIdx !== -1) {
                  // Deduct stock
                  invItems[invIdx].stock = Math.max(0, invItems[invIdx].stock - reqItem.quantity);
                  if (invItems[invIdx].stock === 0) invItems[invIdx].status = 'out_of_stock';
                  else if (invItems[invIdx].stock < 10) invItems[invIdx].status = 'low_stock';
                  
                  // Add history
                  if (!invItems[invIdx].assignments) invItems[invIdx].assignments = [];
                  invItems[invIdx].assignments.push({
                    id: Date.now().toString() + Math.random().toString(),
                    listId: newListId,
                    type: 'out',
                    quantity: reqItem.quantity,
                    date: entryDate,
                    user: currentUser || 'Usuario Local',
                    cliente,
                    planta,
                    serviceCategory,
                    serviceType
                  });
                  updated = true;
                }
              }
            });
            
            if (updated) {
              localStorage.setItem('fsm_inventory_items', JSON.stringify(invItems));
              setInventoryItems(invItems); // update local state
            }
          } catch(e) { console.error("Error updating inventory", e); }
        }
      }
    }
    setViewState('list');
  };

  const handlePrint = async (list: EquipmentList) => {
    // setIsPrinting(list.id);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const logos = await loadCorporateLogos();
      
      const title = 'LISTADO DE HERRAMIENTAS Y EQUIPO';
      const code = 'FOR-OPE-02';

      doc.setFont("helvetica", "normal");
      
      // First page initial content
      let yPos = drawCorporateHeader(doc, title, code, logos);
      
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(`Cliente: ${list.cliente}`, 15, yPos);
      doc.text(`Ubicación: ${list.planta}`, 105, yPos);
      yPos += 8;
      
      const head = [['Item', 'Descripción de Herramienta o Equipo', 'Marca', 'Modelo', 'Serie', 'Estado', 'Cantidad']];
      const body = list.items.map((item, index) => [
        (index + 1).toString(),
        item.description,
        '' /* no brand */,
        '' /* no model */,
        '' /* no serial */,
        '' /* no status */,
        item.quantity.toString(),
      ]);

      autoTable(doc, {
        startY: yPos,
        head: head,
        body: body,
        theme: 'grid',
        headStyles: { fillColor: [15, 118, 110], textColor: 255, fontSize: 9, font: 'helvetica', halign: 'center' },
        styles: { fontSize: 8, font: 'helvetica', cellPadding: 2 },
        margin: { left: 15, right: 15, top: 40, bottom: 35 },
        didDrawPage: function(data) {
          // Draw header and footer on every page
          drawCorporateHeader(doc, title, code, logos);
          drawCorporateFooter(doc, data.pageNumber, logos);
        }
      });

      // Total Pages Replacement
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(TOTAL_PAGES_EXP);
      }

      const fileName = `Listado_Equipo_${list.cliente.replace(/\s+/g, '_')}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF", error);
    } finally {
      // setIsPrinting(null);
    }
  };

  if (viewState === 'edit') {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setViewState('list')} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {currentList ? 'Editar Listado de Ingreso' : 'Nuevo Listado de Ingreso'}
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form row 1 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Cliente</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select 
                  value={cliente}
                  onChange={e => {
                    setCliente(e.target.value);
                    setPlanta(''); // Reset planta on client change
                  }}
                  className={`w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border ${!cliente ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none`}
                >
                  <option value="">Seleccione un cliente</option>
                  {uniqueClients.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Planta / Ubicación</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select 
                  value={planta}
                  onChange={e => setPlanta(e.target.value)}
                  disabled={!cliente}
                  className={`w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border ${!planta ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none disabled:opacity-50 disabled:bg-slate-100`}
                >
                  <option value="">{cliente ? 'Seleccione una planta' : 'Seleccione primero un cliente'}</option>
                  {availablePlants.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            
            {/* Form row 2 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Categoría del Servicio</label>
              <select 
                value={serviceCategory}
                onChange={e => {
                  setServiceCategory(e.target.value);
                  setServiceType(''); // reset type when category changes
                }}
                className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border ${!serviceCategory ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none`}
              >
                <option value="">Seleccione Categoría</option>
                {Object.entries(SERVICE_CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Tipo de Servicio</label>
              <select 
                value={serviceType}
                onChange={e => setServiceType(e.target.value)}
                disabled={!serviceCategory}
                className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border ${!serviceType ? "border-red-500" : "border-slate-200"} rounded-lg focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none disabled:opacity-50 disabled:bg-slate-100`}
              >
                <option value="">{serviceCategory ? 'Seleccione Tipo de Servicio' : 'Seleccione primero una categoría'}</option>
                {serviceCategory && SERVICE_CATEGORIES[serviceCategory]?.services.map(svc => (
                  <option key={svc.id} value={svc.name}>{svc.name}</option>
                ))}
              </select>
            </div>
            
            {/* Form row 3 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Fecha de Ingreso</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="date" 
                  value={entryDate}
                  onChange={e => setEntryDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Agregar Ítems</h3>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start lg:items-end">
              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Categoría del Ítem</label>
                <select 
                  value={newItemCat}
                  onChange={e => setNewItemCat(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Cantidad</label>
                <input 
                  type="number" min="1"
                  value={newItemQty}
                  onChange={e => setNewItemQty(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Unidad</label>
                <input 
                  type="text"
                  value={newItemUnit}
                  onChange={e => setNewItemUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Ej: Und, Caja"
                />
              </div>
              <div className="lg:col-span-5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Descripción (Vincular a Inventario)</label>
                <div className="flex flex-col gap-2">
                  <select
                    value={selectedInventoryId}
                    onChange={e => {
                      const id = e.target.value;
                      setSelectedInventoryId(id);
                      if (id) {
                        const invItem = inventoryItems.find(i => i.id === id);
                        if (invItem) {
                          setNewItemDesc(invItem.name);
                          setNewItemUnit(invItem.unit);
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                  >
                    <option value="">-- Escribir manualmente --</option>
                    {inventoryItems.filter(i => i.stock > 0).map(i => (
                      <option key={i.id} value={i.id}>{i.name} (Stock: {i.stock})</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                    value={newItemDesc}
                    onChange={e => setNewItemDesc(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addItem()}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/50"
                    placeholder="Ej: Taladro percutor Bosch"
                  />
                  <button 
                    onClick={addItem}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex-shrink-0"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                </div>
              </div>
            </div>
          </div>

          {items.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Ítems Registrados ({items.length})</h3>
              
              <div className="space-y-6">
                {CATEGORIES.map(cat => {
                  const catItems = items.filter(i => i.category === cat);
                  if (catItems.length === 0) return null;
                  return (
                    <div key={cat}>
                      <h4 className="font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-t-lg border border-slate-200 dark:border-slate-700 border-b-0">{cat}</h4>
                      <div className="border border-slate-200 dark:border-slate-700 rounded-b-lg overflow-hidden overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {catItems.map(item => (
                              <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-4 py-2 w-16 text-center font-medium">{item.quantity}</td>
                                <td className="px-4 py-2 w-24 text-slate-500 dark:text-slate-400">{item.unit}</td>
                                <td className="px-4 py-2">{item.description}</td>
                                <td className="px-4 py-2 w-16 text-right">
                                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-6 flex justify-end gap-3">
            <button 
              onClick={() => setViewState('list')}
              className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSaveList}
              disabled={!cliente || !planta || !serviceCategory || !serviceType}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-5 h-5" /> Guardar y Generar PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto animate-in fade-in duration-300 pb-24">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Listados de Ingreso</h2>
          <p className="text-slate-500 dark:text-slate-400">Gestione los listados de herramientas y equipo por cliente.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-5 h-5" /> Nuevo Listado
        </button>
      </div>

      {lists.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Sin listados registrados</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">Aún no se han elaborado listados de herramientas o equipo para ingresos. Haga clic en Nuevo Listado para comenzar.</p>
          <button 
            onClick={handleCreateNew}
            className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-lg font-bold hover:bg-emerald-200 transition-colors"
          >
            Crear mi primer listado
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map(list => (
            <div key={list.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all overflow-hidden flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                    {list.items.length} ítems
                  </div>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(list.date).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" /> {list.cliente}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-slate-400" /> {list.planta}
                </p>
                {list.serviceCategory && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 bg-slate-100 dark:bg-slate-800/50 p-2 rounded">
                    <strong>Servicio:</strong> {SERVICE_CATEGORIES[list.serviceCategory]?.name || list.serviceCategory} 
                    {list.serviceType ? ` - ${list.serviceType}` : ''}
                  </p>
                )}
                
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <UserIcon className="w-3 h-3" /> Creado por: <span className="font-semibold">{list.createdBy}</span>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900 px-5 py-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(list)}
                    className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    title="Editar Listado"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(list.id)}
                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    title="Eliminar Listado"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={() => handlePrint(list)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-900 transition-colors"
                >
                  <Printer className="w-4 h-4" /> Imprimir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
