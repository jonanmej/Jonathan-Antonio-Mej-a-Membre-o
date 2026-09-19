/// <reference types="vite/client" />
import React, { useState, useRef, useMemo, useEffect } from 'react';
import type { MapRef } from 'react-map-gl';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import { activeMapLib, maplibregl, MAP_STYLES, MAPBOX_TOKEN, isMapboxConfigured } from '../utils/mapConfig';
import BackToDashboardButton from './BackToDashboardButton';
import { 
  Building2, ArrowLeft, Search, MapPin, 
  Sun, Zap, CheckCircle2, AlertTriangle, Wrench, 
  Plus, FileText, ChevronRight, X, Wind, Factory, Layers,
  Edit, Trash2, Globe, Check, Maximize2, Minimize2,
  Calendar, CalendarDays, Clock, Play, Download, Sparkles,
  Filter, Info, Users, Briefcase
} from 'lucide-react';
import { plants as initialPlants, Plant, SERVICE_CATEGORIES, ServiceOrder, initialServiceOrders } from '../data';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { generateServiceOrderPDF } from '../utils/serviceOrderPdf';

interface ClientsPlantsModuleProps {
  onBack: () => void;
}

export default function ClientsPlantsModule({ onBack }: ClientsPlantsModuleProps) {
  const [plantsList, setPlantsList] = useState<Plant[]>(() => {
    const saved = localStorage.getItem('fsm_plants');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn("Error parsing fsm_plants", e);
      }
    }
    localStorage.setItem('fsm_plants', JSON.stringify(initialPlants));
    return initialPlants;
  });

  const [clientsList, setClientsList] = useState<any[]>(() => {
    const saved = localStorage.getItem('fsm_clients');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn("Error parsing fsm_clients", e);
      }
    }
    // Derive initial clients from initialPlants
    const initialClients = Array.from(new Set(initialPlants.map(p => p.client))).map((c, i) => ({
       id: 'cli-' + (i + 1),
       name: c,
       services: ['1. Fotovoltaico'],
       hasOM: true,
       contact: 'N/A'
    }));
    localStorage.setItem('fsm_clients', JSON.stringify(initialClients));
    return initialClients;
  });

  const [activeView, setActiveView] = useState<'clients' | 'clientDetails' | 'plantDetails'>('clients');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isAddingPlant, setIsAddingPlant] = useState(false);

  // Client Form
  const [newClientName, setNewClientName] = useState('');
  const [newClientServices, setNewClientServices] = useState<string[]>([]);
  const [newClientOM, setNewClientOM] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{type: 'client' | 'plant', id: string, name: string} | null>(null);

  // Plant Form
  const [newPlantName, setNewPlantName] = useState('');
  const [newPlantClient, setNewPlantClient] = useState('');
  const [newTypeInstall, setNewTypeInstall] = useState('Fotovoltaica');
  const [newCapacity, setNewCapacity] = useState('');
  const [newStatus, setNewStatus] = useState<'optimo' | 'mantenimiento' | 'alerta'>('optimo');
  const [newContractExp, setNewContractExp] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [newLat, setNewLat] = useState('');
  const [newLng, setNewLng] = useState('');

  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<Plant | null>(null);
  const [fullscreenMap, setFullscreenMap] = useState<'directory' | 'client' | 'plant' | null>(null);
  const [directoryMode, setDirectoryMode] = useState<'clients' | 'map'>('clients');
  const [statusFilter, setStatusFilter] = useState<'all' | 'optimo' | 'mantenimiento' | 'alerta'>('all');

  // Service Orders State
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(() => {
    const saved = localStorage.getItem('fsm_service_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn("Error parsing fsm_service_orders", e);
      }
    }
    localStorage.setItem('fsm_service_orders', JSON.stringify(initialServiceOrders));
    return initialServiceOrders;
  });

  // Schedule Service Order Modal State
  const [isSchedulingOrder, setIsSchedulingOrder] = useState(false);
  const [orderPlant, setOrderPlant] = useState<Plant | null>(null);
  const [orderClient, setOrderClient] = useState<any | null>(null);
  const [orderCategoryKey, setOrderCategoryKey] = useState<string>('fotovoltaico');
  const [orderServiceId, setOrderServiceId] = useState<string>('fv_prev');
  const [orderServiceSubType, setOrderServiceSubType] = useState<string>('');
  const [orderStartDate, setOrderStartDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [orderDurationDays, setOrderDurationDays] = useState<number>(1);
  const [orderPriority, setOrderPriority] = useState<'baja' | 'media' | 'alta' | 'urgente'>('media');
  const [orderAssignedTeam, setOrderAssignedTeam] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [showAllCatalogCategories, setShowAllCatalogCategories] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [isGeneratingPdfId, setIsGeneratingPdfId] = useState<string | null>(null);

  // Control de tecla Escape y redimensionamiento en pantalla completa
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullscreenMap(null);
        if (isSchedulingOrder) setIsSchedulingOrder(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSchedulingOrder]);

  useEffect(() => {
    if (fullscreenMap) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      mapRef.current?.resize();
    }, 200);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [fullscreenMap]);

  // Realtime Firestore listeners
  useEffect(() => {
    const unsubPlants = onSnapshot(collection(db, 'plants'), (snapshot) => {
      if (!snapshot.empty) {
        const firestorePlants: Plant[] = [];
        snapshot.forEach(docSnap => {
          firestorePlants.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        setPlantsList(prev => {
          const dict: Record<string, Plant> = {};
          prev.forEach(p => { dict[p.id] = p; });
          firestorePlants.forEach(p => { dict[p.id] = p; });
          const merged = Object.values(dict);
          localStorage.setItem('fsm_plants', JSON.stringify(merged));
          return merged;
        });
      }
    }, (err) => console.warn("Plants listener error:", err));

    const unsubOrders = onSnapshot(collection(db, 'service_orders'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreOrders: ServiceOrder[] = [];
        snapshot.forEach(docSnap => {
          firestoreOrders.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        setServiceOrders(prev => {
          const dict: Record<string, ServiceOrder> = {};
          prev.forEach(o => { dict[o.id] = o; });
          firestoreOrders.forEach(o => { dict[o.id] = o; });
          const merged = Object.values(dict);
          localStorage.setItem('fsm_service_orders', JSON.stringify(merged));
          return merged;
        });
      }
    }, (err) => console.warn("Orders listener error:", err));

    return () => {
      unsubPlants();
      unsubOrders();
    };
  }, []);

  const openScheduleOrderModal = (plant: Plant) => {
    const client = clientsList.find(c => c.name.toLowerCase().trim() === plant.client.toLowerCase().trim()) || 
                   selectedClient || 
                   { name: plant.client, services: ['1. Fotovoltaico'], hasOM: true };
    setOrderPlant(plant);
    setOrderClient(client);

    // Auto-select contracted category if available
    let defaultCatKey = 'fotovoltaico';
    const clientServices: string[] = client.services || [];
    
    const matchedCategory = Object.entries(SERVICE_CATEGORIES).find(([key, cat]) => {
      return clientServices.some(s => s.toLowerCase().includes(cat.name.toLowerCase()) || cat.name.toLowerCase().includes(s.toLowerCase()));
    });

    if (matchedCategory) {
      defaultCatKey = matchedCategory[0];
    } else if (plant.type.toLowerCase().includes('hfo') || plant.type.toLowerCase().includes('térmica')) {
      defaultCatKey = 'hfo';
    } else {
      defaultCatKey = 'fotovoltaico';
    }

    setOrderCategoryKey(defaultCatKey);
    const catObj = SERVICE_CATEGORIES[defaultCatKey];
    const firstService = catObj?.services[0];
    setOrderServiceId(firstService?.id || '');
    setOrderServiceSubType(firstService?.subTypes ? firstService.subTypes[0] : '');

    const todayStr = new Date().toISOString().split('T')[0];
    setOrderStartDate(todayStr);
    setOrderDurationDays(1);
    setOrderPriority('media');
    setOrderAssignedTeam(client.hasOM ? 'Cuadrilla O&M de Planta' : 'Cuadrilla de Turno');
    setOrderNotes('');
    setShowAllCatalogCategories(false);
    setIsSchedulingOrder(true);
  };

  const handleSaveServiceOrder = async () => {
    if (!orderPlant) return;
    if (!orderStartDate || !orderDurationDays || Number(orderDurationDays) < 1) {
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { message: 'Por favor define una fecha de inicio y la cantidad de días del trabajo.', type: 'error' } 
      }));
      return;
    }

    if (!orderCategoryKey || !orderServiceId) {
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { message: 'Por favor selecciona la categoría y el servicio a programar.', type: 'error' } 
      }));
      return;
    }

    const catObj = SERVICE_CATEGORIES[orderCategoryKey];
    const servObj = catObj?.services.find(s => s.id === orderServiceId);
    const categoryName = catObj?.name || orderCategoryKey;
    const serviceName = servObj?.name || orderServiceId;

    // Calculate End Date
    const start = new Date(orderStartDate + 'T00:00:00');
    const end = new Date(start);
    end.setDate(end.getDate() + (Number(orderDurationDays) - 1));
    const endDateStr = end.toISOString().split('T')[0];

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `OT-${new Date().getFullYear()}-${randomNum}`;
    const newOrderId = `ord_${Date.now()}`;

    const newOrder: ServiceOrder = {
      id: newOrderId,
      code,
      clientId: orderClient?.id || 'cli-gen',
      clientName: orderClient?.name || orderPlant.client,
      plantId: orderPlant.id,
      plantName: orderPlant.name,
      plantType: orderPlant.type,
      plantCapacity: orderPlant.capacity,
      plantAddress: orderPlant.address,
      plantCoords: orderPlant.coords,
      categoryKey: orderCategoryKey,
      categoryName,
      serviceId: orderServiceId,
      serviceName,
      serviceSubType: orderServiceSubType || undefined,
      startDate: orderStartDate,
      durationDays: Number(orderDurationDays),
      endDate: endDateStr,
      priority: orderPriority,
      status: 'programada',
      assignedTeam: orderAssignedTeam.trim() || undefined,
      notes: orderNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
      createdBy: 'Coordinador FSM'
    };

    try {
      setIsSavingOrder(true);
      const updatedOrders = [newOrder, ...serviceOrders];
      setServiceOrders(updatedOrders);
      localStorage.setItem('fsm_service_orders', JSON.stringify(updatedOrders));

      await setDoc(doc(db, 'service_orders', newOrderId), newOrder, { merge: true });

      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { 
          message: `¡Orden ${code} programada exitosamente para ${orderPlant.name}! (${orderDurationDays} día(s))`,
          type: 'success'
        } 
      }));

      setIsSchedulingOrder(false);
    } catch (e) {
      console.warn("Error saving order to Firestore:", e);
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { 
          message: `Orden ${code} programada localmente`, 
          type: 'info' 
        } 
      }));
      setIsSchedulingOrder(false);
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleDeleteOrder = async (orderId: string, orderCode: string) => {
    if (!window.confirm(`¿Estás seguro de cancelar y eliminar la orden ${orderCode}?`)) return;
    try {
      const updated = serviceOrders.filter(o => o.id !== orderId);
      setServiceOrders(updated);
      localStorage.setItem('fsm_service_orders', JSON.stringify(updated));
      await deleteDoc(doc(db, 'service_orders', orderId));
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { message: `Orden ${orderCode} eliminada correctamente`, type: 'info' } 
      }));
    } catch (e) {
      console.warn("Error deleting order from firestore:", e);
    }
  };

  const handleDispatchOrderToFieldOps = (order: ServiceOrder) => {
    window.dispatchEvent(new CustomEvent('app-toast', { 
      detail: { 
        message: `Despachando orden ${order.code} hacia Operaciones de Campo...`,
        type: 'success'
      } 
    }));
    window.dispatchEvent(new CustomEvent('app-change-module', { 
      detail: { 
        module: 'field_ops',
        plantId: order.plantId,
        plantName: order.plantName,
        clientName: order.clientName,
        category: order.categoryKey,
        service: order.serviceId
      } 
    }));
  };

  const handlePrintOrderPdf = async (order: ServiceOrder) => {
    try {
      setIsGeneratingPdfId(order.id);
      await generateServiceOrderPDF(order);
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { 
          message: `Ficha de Orden ${order.code} exportada conforme a ISO 9001:2015 / ISO 9001:2026`,
          type: 'success'
        } 
      }));
    } catch (err) {
      console.error("Error generating order PDF:", err);
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { message: 'Error al generar documento PDF de la orden.', type: 'error' } 
      }));
    } finally {
      setIsGeneratingPdfId(null);
    }
  };

  const filteredClients = useMemo(() => {
    return clientsList.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [clientsList, searchTerm]);

  const clientPlants = useMemo(() => {
    if (!selectedClient) return [];
    return plantsList.filter(p => p.client === selectedClient.name);
  }, [plantsList, selectedClient]);

  const selectedPlantOrders = useMemo(() => {
    if (!selectedPlant) return [];
    return serviceOrders.filter(o => o.plantId === selectedPlant.id || o.plantName === selectedPlant.name);
  }, [selectedPlant, serviceOrders]);

  const handleSaveClient = () => {
    if (!newClientName.trim()) {
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'El nombre del cliente es obligatorio', type: 'error' } }));
      return;
    }
    
    let updatedClients: any[];
    if (editingClient) {
      const oldName = editingClient.name;
      const updatedClientData = {
        ...editingClient,
        name: newClientName.trim(),
        services: newClientServices,
        hasOM: newClientOM
      };

      updatedClients = clientsList.map(c => c.id === editingClient.id ? updatedClientData : c);
      
      // If client name changed, cascade update to its plants as well
      if (oldName !== newClientName.trim()) {
        const updatedPlants = plantsList.map(p => p.client === oldName ? { ...p, client: newClientName.trim() } : p);
        setPlantsList(updatedPlants);
        localStorage.setItem('fsm_plants', JSON.stringify(updatedPlants));
      }

      setDoc(doc(db, 'clients', editingClient.id), updatedClientData, { merge: true }).catch(e => console.warn(e));
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: `Cliente "${newClientName.trim()}" actualizado exitosamente`, type: 'success' } }));
    } else {
      const newId = 'cli-' + Date.now();
      const newClient = {
        id: newId,
        name: newClientName.trim(),
        services: newClientServices,
        hasOM: newClientOM,
        contact: 'N/A'
      };
      updatedClients = [...clientsList, newClient];
      setDoc(doc(db, 'clients', newId), newClient).catch(e => console.warn(e));
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: `Cliente "${newClientName.trim()}" registrado exitosamente`, type: 'success' } }));
    }
    
    setClientsList(updatedClients);
    localStorage.setItem('fsm_clients', JSON.stringify(updatedClients));
    if (selectedClient && editingClient && selectedClient.id === editingClient.id) {
      setSelectedClient(updatedClients.find(c => c.id === editingClient.id));
    }
    setIsAddingClient(false);
    setEditingClient(null);
    setNewClientName('');
    setNewClientServices([]);
    setNewClientOM(false);
  };
  
  const handleDeleteClient = (clientId: string, clientName: string) => {
    setDeleteConfirm({ type: 'client', id: clientId, name: clientName });
  };
  
  const handleDeletePlant = (plantId: string, plantName: string) => {
    setDeleteConfirm({ type: 'plant', id: plantId, name: plantName });
  };
  
  const confirmDelete = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'client') {
      const clientId = deleteConfirm.id;
      const clientName = deleteConfirm.name;

      // 1. Remove client from state & storage
      const updatedClients = clientsList.filter(c => c.id !== clientId);
      setClientsList(updatedClients);
      localStorage.setItem('fsm_clients', JSON.stringify(updatedClients));

      // 2. Cascade remove associated plants
      const updatedPlants = plantsList.filter(p => p.client !== clientName);
      setPlantsList(updatedPlants);
      localStorage.setItem('fsm_plants', JSON.stringify(updatedPlants));

      // 3. Firestore deletion
      deleteDoc(doc(db, 'clients', clientId)).catch(err => console.warn(err));

      if (selectedClient?.id === clientId) {
        setSelectedClient(null);
        setActiveView('clients');
      }

      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { message: `Cliente "${clientName}" y sus plantas asociadas fueron eliminados.`, type: 'success' } 
      }));
    } else if (deleteConfirm.type === 'plant') {
      const plantId = deleteConfirm.id;
      const plantName = deleteConfirm.name;

      // 1. Remove plant from state & storage
      const updatedPlants = plantsList.filter(p => p.id !== plantId);
      setPlantsList(updatedPlants);
      localStorage.setItem('fsm_plants', JSON.stringify(updatedPlants));

      // 2. Firestore deletion
      deleteDoc(doc(db, 'plants', plantId)).catch(err => console.warn(err));

      // 3. Update view if currently watching this plant
      if (selectedPlant?.id === plantId) {
        setSelectedPlant(null);
        setActiveView(selectedClient ? 'clientDetails' : 'clients');
      }
      if (popupInfo?.id === plantId) {
        setPopupInfo(null);
      }

      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { message: `Planta "${plantName}" eliminada exitosamente.`, type: 'success' } 
      }));
    }

    setDeleteConfirm(null);
  };
  
  const openEditClient = (client: any) => {
    setEditingClient(client);
    setNewClientName(client.name || '');
    setNewClientServices(client.services || (client.serviceType ? [client.serviceType] : []));
    setNewClientOM(client.hasOM || false);
    setIsAddingClient(true);
  };
  
  const openEditPlant = (plant: Plant) => {
    setEditingPlant(plant);
    setNewPlantName(plant.name || '');
    setNewPlantClient(plant.client || selectedClient?.name || '');
    setNewTypeInstall(plant.type || 'Fotovoltaica');
    setNewCapacity(plant.capacity || '');
    setNewStatus((plant.status as any) || 'optimo');
    setNewContractExp(plant.contractExp || '');
    setNewAddress(plant.address || '');
    setNewContactName(plant.contacts?.[0]?.name || '');
    setNewContactRole(plant.contacts?.[0]?.role || '');
    setNewLat(plant.coords?.lat?.toString() || '');
    setNewLng(plant.coords?.lng?.toString() || '');
    if (!selectedClient && plant.client) {
      const matchClient = clientsList.find(c => c.name === plant.client);
      if (matchClient) setSelectedClient(matchClient);
    }
    setIsAddingPlant(true);
  };

  const openCreatePlant = () => {
    setEditingPlant(null);
    setNewPlantName('');
    setNewPlantClient(selectedClient?.name || (clientsList[0]?.name || ''));
    setNewTypeInstall('Fotovoltaica');
    setNewCapacity('');
    setNewStatus('optimo');
    setNewContractExp('');
    setNewAddress('');
    setNewContactName('');
    setNewContactRole('');
    setNewLat('');
    setNewLng('');
    setIsAddingPlant(true);
  };

  const handleSavePlant = () => {
    if (!newPlantName.trim() || !newLat.trim() || !newLng.trim() || isNaN(Number(newLat)) || isNaN(Number(newLng))) {
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { message: 'El nombre y coordenadas numéricas válidas son obligatorios', type: 'error' } 
      }));
      return;
    }

    const assignedClient = newPlantClient || selectedClient?.name || clientsList[0]?.name || 'Cliente General';

    let updatedPlants: Plant[];
    if (editingPlant) {
      const updatedPlant: Plant = {
        ...editingPlant,
        name: newPlantName.trim(),
        client: assignedClient,
        type: newTypeInstall || 'Fotovoltaica',
        capacity: newCapacity.trim() || 'No especificada',
        status: newStatus,
        contractExp: newContractExp.trim() || editingPlant.contractExp || 'N/A',
        address: newAddress.trim() || editingPlant.address || 'Ubicación registrada',
        coords: { lat: Number(newLat), lng: Number(newLng) },
        contacts: newContactName.trim() ? [{
          name: newContactName.trim(),
          role: newContactRole.trim() || 'Contacto en Sitio',
          initials: newContactName.trim().split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CT'
        }] : (editingPlant.contacts || [])
      };

      updatedPlants = plantsList.map(p => p.id === editingPlant.id ? updatedPlant : p);
      if (selectedPlant?.id === editingPlant.id) {
        setSelectedPlant(updatedPlant);
      }
      setDoc(doc(db, 'plants', editingPlant.id), updatedPlant, { merge: true }).catch(err => console.warn(err));
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: `Planta "${updatedPlant.name}" actualizada con éxito`, type: 'success' } }));
    } else {
      const newId = 'SOL-' + Math.floor(100 + Math.random() * 900);
      const newPlant: Plant = {
        id: newId,
        name: newPlantName.trim(),
        client: assignedClient,
        type: newTypeInstall || 'Fotovoltaica',
        capacity: newCapacity.trim() || 'No especificada',
        status: newStatus,
        contractExp: newContractExp.trim() || 'N/A',
        address: newAddress.trim() || 'Nueva Ubicación',
        lastService: 'Recién registrada',
        coords: { lat: Number(newLat), lng: Number(newLng) },
        contacts: newContactName.trim() ? [{
          name: newContactName.trim(),
          role: newContactRole.trim() || 'Contacto en Sitio',
          initials: newContactName.trim().split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CT'
        }] : []
      };

      updatedPlants = [newPlant, ...plantsList];
      setDoc(doc(db, 'plants', newId), newPlant).catch(err => console.warn(err));
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: `Planta "${newPlant.name}" registrada con éxito`, type: 'success' } }));
    }

    setPlantsList(updatedPlants);
    localStorage.setItem('fsm_plants', JSON.stringify(updatedPlants));
    setIsAddingPlant(false);
    setEditingPlant(null);
    setNewPlantName('');
    setNewPlantClient('');
    setNewTypeInstall('Fotovoltaica');
    setNewCapacity('');
    setNewStatus('optimo');
    setNewContractExp('');
    setNewAddress('');
    setNewContactName('');
    setNewContactRole('');
    setNewLat('');
    setNewLng('');
  };

  const getPlantIcon = (type: string) => {
    switch(type) {
      case 'Fotovoltaica': return <Sun className="w-5 h-5 text-orange-500" />;
      case 'Térmica (HFO)': return <Factory className="w-5 h-5 text-slate-500" />;
      default: return <Zap className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans animate-in fade-in">
      <header className="bg-emerald-600 border-b border-emerald-700 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BackToDashboardButton 
                id="btn-clients-back"
                onClick={onBack}
                variant="glass"
              />
              {activeView !== 'clients' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeView === 'plantDetails') setActiveView('clientDetails');
                    else setActiveView('clients');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer backdrop-blur-sm"
                  title={activeView === 'plantDetails' ? 'Regresar a la ficha del cliente' : 'Regresar a la lista de clientes'}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{activeView === 'plantDetails' ? 'Volver a Cliente' : 'Directorio'}</span>
                </button>
              )}
              <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <h1 className="font-bold text-lg text-white leading-tight">Clientes y Plantas</h1>
                  <p className="text-emerald-100 text-[11px] font-medium">Gestión de Directorio</p>
                </div>
              </div>
            </div>
            
            {activeView === 'clients' && (
              <button onClick={() => setIsAddingClient(true)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Añadir Cliente</span>
              </button>
            )}
            {activeView === 'clientDetails' && (
              <button onClick={() => setIsAddingPlant(true)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Añadir Planta</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        
        {activeView === 'clients' && (
          <div className="space-y-6 animate-in fade-in">
            {/* SELECTOR DE VISTA: DIRECTORIO VS MAPA GENERAL */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  id="btn-view-clients"
                  onClick={() => setDirectoryMode('clients')}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    directoryMode === 'clients'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Directorio de Clientes ({clientsList.length})</span>
                </button>
                <button
                  type="button"
                  id="btn-view-map"
                  onClick={() => setDirectoryMode('map')}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    directoryMode === 'map'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Mapa General de Plantas ({plantsList.length})</span>
                </button>
              </div>

              {directoryMode === 'clients' && (
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Buscar cliente..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              {directoryMode === 'map' && (
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <div className="flex items-center gap-1.5 bg-slate-900/90 text-white px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>🛰️ Vista Satelital</span>
                    {isMapboxConfigured && <span className="text-[10px] text-emerald-300 font-normal">HD</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => setFullscreenMap(fullscreenMap === 'directory' ? null : 'directory')}
                    className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    title={fullscreenMap === 'directory' ? "Salir de pantalla completa (Esc)" : "Ver e interactuar a pantalla completa"}
                  >
                    {fullscreenMap === 'directory' ? (
                      <>
                        <Minimize2 className="w-3.5 h-3.5 text-amber-500" />
                        <span>Salir Pantalla Completa</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Pantalla Completa</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* VISTA MAPA GENERAL */}
            {directoryMode === 'map' && (
              <div className="space-y-4">
                <div 
                  className={
                    fullscreenMap === 'directory'
                      ? "fixed inset-0 z-[100] w-screen h-screen bg-slate-950 flex flex-col p-3 sm:p-4 shadow-2xl"
                      : "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-[340px] sm:h-[380px] relative transition-all"
                  }
                >
                  {fullscreenMap === 'directory' && (
                    <div className="flex items-center justify-between pb-3 text-white border-b border-white/10 mb-2 px-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <h4 className="font-bold text-sm sm:text-base">Mapa Satelital General de Plantas</h4>
                        <span className="text-xs text-slate-400 font-medium">({plantsList.length} plantas)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFullscreenMap(null)}
                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Cerrar Pantalla Completa (Esc)</span>
                      </button>
                    </div>
                  )}

                  <div className="w-full h-full relative overflow-hidden rounded-xl">
                    <Map
                      ref={mapRef}
                      mapLib={activeMapLib}
                      mapboxAccessToken={MAPBOX_TOKEN || undefined}
                      style={{ width: "100%", height: "100%" }}
                      initialViewState={{
                        longitude: -88.8965,
                        latitude: 13.7942,
                        zoom: 8
                      }}
                      mapStyle={MAP_STYLES.satellite}
                    >
                      <NavigationControl position="top-right" />

                      {plantsList.map(plant => {
                        const isOptimo = plant.status === 'optimo' || plant.status === 'active';
                        const isAlerta = plant.status === 'alerta';
                        const pinColor = isAlerta ? 'text-rose-500' : isOptimo ? 'text-emerald-500' : 'text-amber-500';

                        return (
                          <Marker
                            key={plant.id}
                            longitude={plant.coords.lng}
                            latitude={plant.coords.lat}
                            anchor="bottom"
                            onClick={e => {
                              e.originalEvent.stopPropagation();
                              setPopupInfo(plant);
                            }}
                          >
                            <div className="cursor-pointer hover:scale-110 transition-transform flex flex-col items-center group">
                              <div className="bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md border border-slate-200 dark:border-slate-700 mb-1 whitespace-nowrap flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${isAlerta ? 'bg-rose-500' : isOptimo ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                <span>{plant.name}</span>
                                <span className="text-[9px] text-slate-400 font-normal">({plant.capacity})</span>
                              </div>
                              <MapPin className={`w-8 h-8 ${pinColor} drop-shadow-md`} />
                            </div>
                          </Marker>
                        );
                      })}

                      {popupInfo && (
                        <Popup
                          anchor="top"
                          longitude={popupInfo.coords.lng}
                          latitude={popupInfo.coords.lat}
                          onClose={() => setPopupInfo(null)}
                          closeOnClick={false}
                          className="rounded-xl overflow-hidden shadow-xl"
                        >
                          <div className="p-2 text-slate-800 min-w-[220px]">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-bold text-sm leading-tight text-slate-900">{popupInfo.name}</h4>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                                {popupInfo.type}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mb-1"><strong>Cliente:</strong> {popupInfo.client}</p>
                            <p className="text-xs text-slate-600 mb-2"><strong>Capacidad:</strong> {popupInfo.capacity}</p>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-3">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{popupInfo.coords.lat.toFixed(4)}, {popupInfo.coords.lng.toFixed(4)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                type="button"
                                onClick={() => {
                                  if (fullscreenMap) setFullscreenMap(null);
                                  setSelectedPlant(popupInfo);
                                  setActiveView('plantDetails');
                                }}
                                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors text-center cursor-pointer shadow-xs"
                              >
                                Ver Ficha
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setPopupInfo(null);
                                  openEditPlant(popupInfo);
                                }}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                                title="Editar planta"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleDeletePlant(popupInfo.id, popupInfo.name);
                                }}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-colors"
                                title="Eliminar planta"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </Popup>
                      )}
                    </Map>

                    {/* Leyenda de estados */}
                    <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-sm p-2 rounded-xl text-xs font-medium border border-white/10 shadow-sm flex items-center gap-3 pointer-events-none">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-white text-[11px]">Óptimo</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span className="text-white text-[11px]">Mantenimiento</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                        <span className="text-white text-[11px]">Alerta</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VISTA DIRECTORIO DE CLIENTES */}
            {directoryMode === 'clients' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredClients.map(client => {
                 const pCount = plantsList.filter(p => p.client === client.name).length;
                 return (
                  <div 
                    key={client.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => { setSelectedClient(client); setActiveView('clientDetails'); }}>
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white leading-tight hover:text-emerald-600 transition-colors">{client.name}</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {client.hasOM && (
                                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-200">O&M</span>
                              )}
                              {client.services && client.services.slice(0,2).map((s:string) => (
                                <span key={s} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">{s}</span>
                              ))}
                              {client.services && client.services.length > 2 && (
                                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">+{client.services.length - 2}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700/50 mt-2">
                      <span className="font-medium cursor-pointer hover:text-slate-800" onClick={() => { setSelectedClient(client); setActiveView('clientDetails'); }}>
                        {pCount} {pCount === 1 ? 'Planta' : 'Plantas'} <ChevronRight className="w-4 h-4 inline" />
                      </span>
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); openEditClient(client); }} className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                          Editar
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id, client.name); }} className="text-slate-400 hover:text-red-600 transition-colors p-1">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                 );
              })}
            </div>
            )}
          </div>
        )}

        {activeView === 'clientDetails' && selectedClient && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedClient.name}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedClient.hasOM && (
                    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold border border-indigo-200">Operación y Mantenimiento (O&M)</span>
                  )}
                  {selectedClient.services?.map((s:string) => (
                    <span key={s} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold border border-emerald-200">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditClient(selectedClient)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-sm font-semibold transition-colors">
                  Editar
                </button>
                <button onClick={() => handleDeleteClient(selectedClient.id, selectedClient.name)} className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded text-sm font-semibold transition-colors">
                  Eliminar
                </button>
              </div>
            </div>

            {/* 1. FICHAS DE LAS PLANTAS (PRIMERO) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Fichas de Plantas e Instalaciones</span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-full">
                      {clientPlants.length}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Infraestructuras técnicas registradas para {selectedClient.name}
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={openCreatePlant} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Añadir Planta
                </button>
              </div>

              {clientPlants.length === 0 ? (
                <div className="text-center py-10 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400">No hay plantas registradas para este cliente.</p>
                  <button onClick={openCreatePlant} className="mt-2 text-emerald-600 font-bold hover:underline text-sm cursor-pointer">Añadir una planta</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {clientPlants.map(plant => (
                    <div key={plant.id} onClick={() => { setSelectedPlant(plant); setActiveView('plantDetails'); }} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 cursor-pointer group relative overflow-hidden flex flex-col justify-between">
                      {plant.status === 'alerta' && <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>}
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center">
                              {getPlantIcon(plant.type)}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 dark:text-white leading-tight group-hover:text-emerald-600 transition-colors">{plant.name}</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{plant.type} • <span className="font-semibold text-slate-700 dark:text-slate-300">{plant.capacity}</span></p>
                            </div>
                          </div>
                        </div>
                        {plant.address && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                            <MapPin className="w-3 h-3 inline mr-1 text-slate-400" />
                            {plant.address}
                          </p>
                        )}
                      </div>
                      {(() => {
                        const ordersForPlant = serviceOrders.filter(o => o.plantId === plant.id || o.plantName === plant.name);
                        return (
                          <div className="flex items-center justify-between text-xs mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/40">
                            <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                              <CalendarDays className="w-3.5 h-3.5 text-indigo-500" />
                              <span>{ordersForPlant.length} {ordersForPlant.length === 1 ? 'orden' : 'órdenes'}</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openScheduleOrderModal(plant);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-2 py-0.5 rounded-md transition-colors"
                              title="Programar orden de servicio"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Nueva Orden</span>
                            </button>
                          </div>
                        );
                      })()}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50 mt-1">
                        <div>
                          {plant.status === 'optimo' && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-1 rounded">Operativa</span>}
                          {plant.status === 'mantenimiento' && <span className="text-[10px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 px-2 py-1 rounded">Mantenimiento</span>}
                          {plant.status === 'alerta' && <span className="text-[10px] font-bold text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-300 px-2 py-1 rounded">Alerta</span>}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditPlant(plant);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors"
                            title="Editar información de la planta"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePlant(plant.id, plant.name);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Eliminar planta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. MAPA DE UBICACIONES (ABAJO DE LAS FICHAS) */}
            {clientPlants.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span>Mapa Satelital de Ubicaciones</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Geolocalización de las plantas asignadas a {selectedClient.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 text-white px-2.5 py-1 rounded-xl text-[11px] font-semibold border border-white/10 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>🛰️ Satelital</span>
                      {isMapboxConfigured && <span className="text-emerald-300 font-normal">HD</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => setFullscreenMap(fullscreenMap === 'client' ? null : 'client')}
                      className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      title={fullscreenMap === 'client' ? "Salir de pantalla completa (Esc)" : "Ver e interactuar a pantalla completa"}
                    >
                      {fullscreenMap === 'client' ? (
                        <>
                          <Minimize2 className="w-3.5 h-3.5 text-amber-500" />
                          <span>Salir Pantalla Completa</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Pantalla Completa</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div 
                  className={
                    fullscreenMap === 'client'
                      ? "fixed inset-0 z-[100] w-screen h-screen bg-slate-950 flex flex-col p-3 sm:p-4 shadow-2xl"
                      : "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-[260px] sm:h-[300px] relative transition-all"
                  }
                >
                  {fullscreenMap === 'client' && (
                    <div className="flex items-center justify-between pb-3 text-white border-b border-white/10 mb-2 px-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <h4 className="font-bold text-sm sm:text-base">Mapa Satelital - Plantas de {selectedClient.name}</h4>
                        <span className="text-xs text-slate-400 font-medium">({clientPlants.length} plantas)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFullscreenMap(null)}
                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Cerrar Pantalla Completa (Esc)</span>
                      </button>
                    </div>
                  )}

                  <div className="w-full h-full relative overflow-hidden rounded-xl">
                    <Map
                      ref={mapRef}
                      mapLib={activeMapLib}
                      mapboxAccessToken={MAPBOX_TOKEN || undefined}
                      style={{ width: "100%", height: "100%" }}
                      initialViewState={{
                        longitude: clientPlants[0]?.coords.lng || -89.2,
                        latitude: clientPlants[0]?.coords.lat || 13.7,
                        zoom: clientPlants.length > 1 ? 8 : 12
                      }}
                      mapStyle={MAP_STYLES.satellite}
                    >
                      <NavigationControl position="top-right" />
                      {clientPlants.map(plant => (
                        <Marker key={plant.id} longitude={plant.coords.lng} latitude={plant.coords.lat} anchor="bottom" onClick={e => { e.originalEvent.stopPropagation(); setPopupInfo(plant); }}>
                          <div className="cursor-pointer hover:scale-110 transition-transform flex flex-col items-center">
                            <div className="bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-slate-200 dark:border-slate-700 mb-1 whitespace-nowrap">
                              {plant.name}
                            </div>
                            <MapPin className="w-8 h-8 text-emerald-600 drop-shadow-md" />
                          </div>
                        </Marker>
                      ))}
                      
                      {popupInfo && (
                        <Popup
                          anchor="top"
                          longitude={popupInfo.coords.lng}
                          latitude={popupInfo.coords.lat}
                          onClose={() => setPopupInfo(null)}
                          closeOnClick={false}
                          className="rounded-xl overflow-hidden shadow-xl"
                        >
                          <div className="p-1 text-slate-800 max-w-[200px]">
                            <h4 className="font-bold text-sm leading-tight">{popupInfo.name}</h4>
                            <p className="text-xs text-slate-500 mt-1">{popupInfo.type}</p>
                            <button 
                              type="button"
                              className="mt-2 w-full text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 py-1.5 rounded transition-colors cursor-pointer"
                              onClick={() => { 
                                if (fullscreenMap) setFullscreenMap(null);
                                setPopupInfo(null); 
                                setSelectedPlant(popupInfo); 
                                setActiveView('plantDetails'); 
                              }}
                            >
                              Ver Detalles
                            </button>
                          </div>
                        </Popup>
                      )}
                    </Map>
                    <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-sm text-[11px] text-slate-200 px-3 py-1 rounded-lg border border-white/10 shadow-sm pointer-events-none">
                      🛰️ {clientPlants.length} planta(s) geolocalizada(s)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'plantDetails' && selectedPlant && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-300">
            {/* Columna Izquierda: Ficha Técnica */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">Ficha Técnica</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Capacidad Instalada</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedPlant.capacity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Tipo de Instalación</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedPlant.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Coordenadas</p>
                    <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{selectedPlant.coords.lat}, {selectedPlant.coords.lng}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">Contactos en Sitio</h3>
                </div>
                <div className="p-5 space-y-4">
                  {selectedPlant.contacts && selectedPlant.contacts.length > 0 ? (
                    selectedPlant.contacts.map((contact, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                          {contact.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{contact.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{contact.role}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">Sin contactos registrados.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha: Mapa y Acciones */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white">{selectedPlant.name}</h3>
                    {selectedPlant.status === 'optimo' && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded">Operativa</span>}
                    {selectedPlant.status === 'mantenimiento' && <span className="text-[10px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 px-2 py-0.5 rounded">Mantenimiento</span>}
                    {selectedPlant.status === 'alerta' && <span className="text-[10px] font-bold text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-300 px-2 py-0.5 rounded">Alerta</span>}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Planta de {selectedPlant.client || selectedClient?.name}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button 
                    type="button"
                    onClick={() => openEditPlant(selectedPlant)} 
                    className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5 text-indigo-500" />
                    Editar Planta
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDeletePlant(selectedPlant.id, selectedPlant.name)} 
                    className="bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar Planta
                  </button>
                  <button 
                    type="button"
                    onClick={() => openScheduleOrderModal(selectedPlant)} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Nueva Orden
                  </button>
                </div>
              </div>

              
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Información de la Planta</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Capacidad</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">{selectedPlant.capacity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Estado</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100 mt-0.5 capitalize">{selectedPlant.status || 'Óptimo'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Vigencia Contrato</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">{selectedPlant.contractExp || 'Vigente'}</p>
                  </div>
                  <div className="sm:col-span-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Dirección</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">{selectedPlant.address || 'Ubicación registrada'}</p>
                  </div>
                  <div className="sm:col-span-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Coordenadas GPS</p>
                    <p className="font-mono text-xs text-slate-700 dark:text-slate-300 mt-0.5">{selectedPlant.coords.lat.toFixed(4)}, {selectedPlant.coords.lng.toFixed(4)}</p>
                  </div>
                </div>
              </div>

              <div 
                className={
                  fullscreenMap === 'plant'
                    ? "fixed inset-0 z-[100] w-screen h-screen bg-slate-950 flex flex-col p-3 sm:p-4 shadow-2xl"
                    : "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-[250px] relative transition-all"
                }
              >
                {fullscreenMap === 'plant' && (
                  <div className="flex items-center justify-between pb-3 text-white border-b border-white/10 mb-2 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      <h4 className="font-bold text-sm sm:text-base">Geolocalización Satelital: {selectedPlant.name}</h4>
                      <span className="text-xs text-slate-400 font-medium">({selectedPlant.capacity})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFullscreenMap(null)}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cerrar Pantalla Completa (Esc)</span>
                    </button>
                  </div>
                )}

                <div className="w-full h-full relative overflow-hidden rounded-xl">
                  <Map
                    mapLib={activeMapLib}
                    mapboxAccessToken={MAPBOX_TOKEN || undefined}
                    style={{ width: "100%", height: "100%" }}
                    initialViewState={{
                      longitude: selectedPlant.coords.lng,
                      latitude: selectedPlant.coords.lat,
                      zoom: 15
                    }}
                    mapStyle={MAP_STYLES.satellite}
                  >
                    <NavigationControl position="top-right" />
                    <Marker longitude={selectedPlant.coords.lng} latitude={selectedPlant.coords.lat} anchor="bottom">
                      <div className="flex flex-col items-center">
                        <div className="bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-slate-200 dark:border-slate-700 mb-1 whitespace-nowrap">
                          {selectedPlant.name}
                        </div>
                        <MapPin className="w-8 h-8 text-emerald-500 drop-shadow-md animate-bounce" />
                      </div>
                    </Marker>
                  </Map>
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
                    <div className="bg-slate-900/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-white/10 shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>🛰️ Vista Satelital</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFullscreenMap(fullscreenMap === 'plant' ? null : 'plant')}
                      className="bg-slate-900/85 hover:bg-slate-900 backdrop-blur-sm text-white hover:text-emerald-300 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-white/10 shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                      title={fullscreenMap === 'plant' ? "Salir de pantalla completa (Esc)" : "Ver a pantalla completa"}
                    >
                      {fullscreenMap === 'plant' ? (
                        <>
                          <Minimize2 className="w-3 h-3 text-amber-400" />
                          <span>Salir</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3 h-3 text-indigo-400" />
                          <span>Pantalla Completa</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. ÓRDENES DE SERVICIO PROGRAMADAS DE LA PLANTA */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">Órdenes de Trabajo Programadas</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                          {selectedPlantOrders.length}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Programación de servicios contratados para {selectedPlant.name}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openScheduleOrderModal(selectedPlant)}
                    className="inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Programar Nuevo Servicio</span>
                  </button>
                </div>

                {selectedPlantOrders.length === 0 ? (
                  <div className="py-8 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center mb-3">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">No hay órdenes programadas para esta planta</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-1 mb-4">
                      Programa servicios contratados por el cliente estableciendo el tipo de servicio, fecha de inicio y cantidad de días de intervención.
                    </p>
                    <button
                      type="button"
                      onClick={() => openScheduleOrderModal(selectedPlant)}
                      className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Programar Primera Orden</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPlantOrders.map(order => (
                      <div 
                        key={order.id} 
                        className="bg-slate-50/70 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700/70 p-4 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-xs"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200/50 dark:border-indigo-800/50">
                                {order.code}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {order.status}
                              </span>
                            </div>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              order.priority === 'urgente' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' :
                              order.priority === 'alta' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                              order.priority === 'media' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' :
                              'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              Prioridad {order.priority}
                            </span>
                          </div>

                          <div className="mb-2">
                            <p className="text-[11px] font-semibold text-indigo-500 dark:text-indigo-400">{order.categoryName}</p>
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                              {order.serviceName}
                            </h5>
                            {order.serviceSubType && (
                              <span className="inline-block mt-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                Alcance: {order.serviceSubType}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 my-3 bg-white dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>Inicio de trabajo:</span>
                              </span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{order.startDate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>Días programados:</span>
                              </span>
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">{order.durationDays} día(s)</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 dark:text-slate-400">Fin estimado:</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{order.endDate}</span>
                            </div>
                            {order.assignedTeam && (
                              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/40">
                                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Cuadrilla:</span>
                                </span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{order.assignedTeam}</span>
                              </div>
                            )}
                          </div>

                          {order.notes && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-100/50 dark:bg-slate-800/40 p-2 rounded mb-3">
                              "{order.notes}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-700/60 mt-2">
                          <button
                            type="button"
                            onClick={() => handleDispatchOrderToFieldOps(order)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
                            title="Iniciar ejecución en Operaciones de Campo"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Ejecutar en Campo</span>
                          </button>
                          
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handlePrintOrderPdf(order)}
                              disabled={isGeneratingPdfId === order.id}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Exportar documento oficial (ISO 9001)"
                            >
                              <Download className="w-3 h-3 text-indigo-500" />
                              <span>{isGeneratingPdfId === order.id ? 'Generando...' : 'PDF ISO'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order.id, order.code)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                              title="Cancelar y eliminar orden"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {isAddingClient && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{editingClient ? 'Editar Cliente' : 'Añadir Nuevo Cliente'}</h3>
              <button onClick={() => {setIsAddingClient(false); setEditingClient(null);}} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nombre del Cliente</label>
                <input type="text" value={newClientName} onChange={e => setNewClientName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" placeholder="Ej. Neoen" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800">
                  <input type="checkbox" checked={newClientOM} onChange={e => setNewClientOM(e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  Servicio de Operación y Mantenimiento (O&M)
                </label>
                
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Categorías de Servicios Adicionales</label>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-slate-50 dark:bg-slate-900">
                  {Object.entries(SERVICE_CATEGORIES).map(([key, cat]) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <input 
                        type="checkbox" 
                        checked={newClientServices.includes(cat.name)}
                        onChange={e => {
                          if (e.target.checked) {
                            setNewClientServices([...newClientServices, cat.name]);
                          } else {
                            setNewClientServices(newClientServices.filter(s => s !== cat.name));
                          }
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={handleSaveClient} className="mt-2 bg-emerald-600 text-white font-bold py-2 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer">
                {editingClient ? 'Guardar Cambios' : 'Guardar Cliente'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddingPlant && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">
                {editingPlant ? `Editar Planta: ${editingPlant.name}` : `Añadir Planta ${selectedClient ? `para ${selectedClient.name}` : ''}`}
              </h3>
              <button onClick={() => { setIsAddingPlant(false); setEditingPlant(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nombre de la Planta *</label>
                  <input type="text" value={newPlantName} onChange={e => setNewPlantName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 font-medium" placeholder="Ej. Planta Solar Bósforo I" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Cliente Propietario *</label>
                  <select 
                    value={newPlantClient || selectedClient?.name || ''} 
                    onChange={e => setNewPlantClient(e.target.value)} 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="">-- Seleccionar Cliente --</option>
                    {clientsList.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Estado Operativo</label>
                  <select 
                    value={newStatus} 
                    onChange={e => setNewStatus(e.target.value as any)} 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="optimo">Operativa (Óptimo)</option>
                    <option value="mantenimiento">En Mantenimiento</option>
                    <option value="alerta">En Alerta</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ficha Técnica y Capacidad</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Tipo de Instalación</label>
                    <select value={newTypeInstall} onChange={e => setNewTypeInstall(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500">
                      <option value="Fotovoltaica">Fotovoltaica</option>
                      <option value="Térmica (HFO)">Térmica (HFO)</option>
                      <option value="Comercial">Comercial</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Subestación">Subestación</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Capacidad Instalada</label>
                    <input type="text" value={newCapacity} onChange={e => setNewCapacity(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" placeholder="Ej. 140 MW o 250 kWp" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Vigencia de Contrato</label>
                    <input type="text" value={newContractExp} onChange={e => setNewContractExp(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" placeholder="Ej. Nov 2030" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Dirección / Referencia</label>
                    <input type="text" value={newAddress} onChange={e => setNewAddress(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" placeholder="Ej. Km 45 Carretera Litoral" />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Contacto en Sitio</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nombre Completo</label>
                    <input type="text" value={newContactName} onChange={e => setNewContactName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" placeholder="Ej. Roberto Martínez" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Cargo / Puesto</label>
                    <input type="text" value={newContactRole} onChange={e => setNewContactRole(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500" placeholder="Ej. Jefe de Planta" />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Geolocalización GPS *</h4>
                  <button 
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((pos) => {
                          setNewLat(pos.coords.latitude.toFixed(6));
                          setNewLng(pos.coords.longitude.toFixed(6));
                        });
                      }
                    }} 
                    className="text-[11px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg font-bold hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800"
                  >
                    Obtener GPS Actual
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Latitud</label>
                    <input type="text" value={newLat} onChange={e => setNewLat(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 font-mono" placeholder="Ej. 13.7942" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Longitud</label>
                    <input type="text" value={newLng} onChange={e => setNewLng(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 font-mono" placeholder="Ej. -88.8965" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => { setIsAddingPlant(false); setEditingPlant(null); }} 
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  onClick={handleSavePlant} 
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  {editingPlant ? 'Guardar Cambios' : 'Guardar Planta'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4 text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Confirmar Eliminación</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                ¿Está seguro que desea eliminar {deleteConfirm.type === 'client' ? 'el cliente' : 'la planta'} <strong>{deleteConfirm.name}</strong>?
                {deleteConfirm.type === 'client' && ' Se perderá la vinculación y toda la información asociada.'}
                Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirm(null)} 
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
                >
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PROGRAMAR ORDEN DE SERVICIO */}
      {isSchedulingOrder && orderPlant && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-[120] p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 my-auto">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/50 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-800/30 flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 mt-0.5">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg sm:text-xl">
                    Programar Orden de Servicio
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                      {orderPlant.name}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Cliente: <strong>{orderClient?.name || orderPlant.client}</strong>
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                      {orderPlant.type} ({orderPlant.capacity})
                    </span>
                  </div>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsSchedulingOrder(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
              
              {/* Servicios Contratados del Cliente Info Callout */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Servicios Contratados por el Cliente:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(orderClient?.services || ['1. Fotovoltaico']).map((srv: string, idx: number) => (
                      <span key={idx} className="text-[11px] font-semibold bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800/60">
                        ✓ {srv}
                      </span>
                    ))}
                    {orderClient?.hasOM && (
                      <span className="text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Contrato O&M Activo
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllCatalogCategories(!showAllCatalogCategories)}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline self-start sm:self-auto cursor-pointer"
                >
                  {showAllCatalogCategories ? 'Filtrar por contratados' : 'Ver todo el catálogo'}
                </button>
              </div>

              {/* 1. SELECCIÓN DE SERVICIO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Categoría de Servicio */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Categoría de Servicio <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={orderCategoryKey}
                    onChange={(e) => {
                      const newKey = e.target.value;
                      setOrderCategoryKey(newKey);
                      const cat = SERVICE_CATEGORIES[newKey];
                      const firstSrv = cat?.services[0];
                      setOrderServiceId(firstSrv?.id || '');
                      setOrderServiceSubType(firstSrv?.subTypes ? firstSrv.subTypes[0] : '');
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
                  >
                    {Object.entries(SERVICE_CATEGORIES)
                      .filter(([key, cat]) => {
                        if (showAllCatalogCategories) return true;
                        const clientServices: string[] = orderClient?.services || [];
                        const matches = clientServices.some(s => s.toLowerCase().includes(cat.name.toLowerCase()) || cat.name.toLowerCase().includes(s.toLowerCase()));
                        if (matches) return true;
                        return key === 'fotovoltaico';
                      })
                      .map(([key, cat]) => (
                        <option key={key} value={key}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Servicio Específico */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Servicio a Brindar <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={orderServiceId}
                    onChange={(e) => {
                      const newSrvId = e.target.value;
                      setOrderServiceId(newSrvId);
                      const currentCat = SERVICE_CATEGORIES[orderCategoryKey];
                      const srv = currentCat?.services.find(s => s.id === newSrvId);
                      setOrderServiceSubType(srv?.subTypes ? srv.subTypes[0] : '');
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
                  >
                    {SERVICE_CATEGORIES[orderCategoryKey]?.services.map(srv => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Subtipo de Servicio si aplica */}
              {(() => {
                const currentCat = SERVICE_CATEGORIES[orderCategoryKey];
                const srv = currentCat?.services.find(s => s.id === orderServiceId);
                if (!srv?.subTypes || srv.subTypes.length === 0) return null;
                return (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Alcance / Subtipo de Servicio:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {srv.subTypes.map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setOrderServiceSubType(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            orderServiceSubType === st
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* 2. PROGRAMACIÓN DE TIEMPO (FECHA Y DÍAS) */}
              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl p-4 sm:p-5 border border-indigo-100 dark:border-indigo-900/40 space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                    Cronograma de Ejecución del Trabajo
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Fecha de Inicio */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Fecha de Inicio de la Programación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={orderStartDate}
                      onChange={(e) => setOrderStartDate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
                    />
                  </div>

                  {/* Cantidad de Días */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Cantidad de Días Programados <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={orderDurationDays}
                      onChange={(e) => setOrderDurationDays(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-bold"
                      placeholder="Ej. 3"
                    />
                  </div>
                </div>

                {/* Presets rápidos de días */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">Atajos:</span>
                  {[1, 2, 3, 4, 5, 7, 10, 15].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setOrderDurationDays(days)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        orderDurationDays === days
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {days} {days === 1 ? 'día' : 'días'}
                    </button>
                  ))}
                </div>

                {/* Resumen Calculado de la Ventana */}
                {(() => {
                  const start = new Date(orderStartDate + 'T00:00:00');
                  const end = new Date(start);
                  end.setDate(end.getDate() + (Number(orderDurationDays) - 1));
                  const formattedStart = start.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
                  const formattedEnd = end.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
                  return (
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Ventana programada:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            Del {formattedStart} al {formattedEnd}
                          </span>
                        </div>
                      </div>
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-lg">
                        {orderDurationDays} {orderDurationDays === 1 ? 'Día' : 'Días'} Calendario
                      </span>
                    </div>
                  );
                })()}

              </div>

              {/* 3. DETALLES OPERATIVOS ADICIONALES */}
              <div className="space-y-4">
                
                {/* Prioridad y Cuadrilla */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Nivel de Prioridad
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'baja', label: 'Baja' },
                        { id: 'media', label: 'Media' },
                        { id: 'alta', label: 'Alta' },
                        { id: 'urgente', label: 'Urgente' }
                      ].map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setOrderPriority(p.id as any)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer border ${
                            orderPriority === p.id
                              ? p.id === 'urgente' ? 'bg-rose-600 text-white border-rose-600 shadow-xs' :
                                p.id === 'alta' ? 'bg-amber-600 text-white border-amber-600 shadow-xs' :
                                p.id === 'media' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' :
                                'bg-slate-700 text-white border-slate-700 shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Cuadrilla / Responsable Asignado
                    </label>
                    <input
                      type="text"
                      value={orderAssignedTeam}
                      onChange={(e) => setOrderAssignedTeam(e.target.value)}
                      placeholder="Ej. Cuadrilla Solar Alfa, Ing. Gómez"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                {/* Observaciones e Instrucciones Técnicas */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Instrucciones u Observaciones Técnicas (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Instrucciones especiales para el personal de campo, protocolos específicos o permisos necesarios..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
                  />
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsSchedulingOrder(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveServiceOrder}
                disabled={isSavingOrder}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSavingOrder ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Guardando Programación...</span>
                  </>
                ) : (
                  <>
                    <CalendarDays className="w-4 h-4" />
                    <span>Guardar y Programar Orden</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
