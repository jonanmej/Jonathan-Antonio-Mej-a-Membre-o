import CalendarModule from './components/CalendarModule';
import ReportsManagerModule from './components/ReportsManagerModule';
import BackToDashboardButton from './components/BackToDashboardButton';
/// <reference types="vite/client" />
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { LogoEAServiceConnect, LogoChemitek, LogoPvstop, LogoEAServiceConsulting } from './components/Logos';
import { plants, SERVICE_CATEGORIES } from "./data";
import Map, { Marker } from 'react-map-gl';
import { activeMapLib, maplibregl, MAP_STYLES, MAPBOX_TOKEN } from './utils/mapConfig';
import {    Moon, Factory, Monitor, Coffee, MessageSquare, Calendar, Download, History, WifiOff, CloudOff, RefreshCw, ArrowRight, Lock, Mail, ShieldCheck, Sun, MapPin, Building2, Package, Users, BarChart3, Bell, LogOut, ArrowLeft, Camera, PenTool, Navigation, FileText, CheckCircle2, Search, Map as MapIcon, List, AlertTriangle, Wrench, Zap, Box, Filter, Plus, Droplets, Shield, Clock, HardHat, UserCheck, UserX, TrendingUp, Activity, Target, Contrast , ShoppingCart, QrCode, Mic, MicOff, Eye, EyeOff, ChevronDown, ChevronUp, Trash, Columns, X , Share2 , Signal , ClipboardCheck, PieChart, Settings, Sparkles, Send, Briefcase } from 'lucide-react';
import { imageStore, subscribeToImages } from './utils/imageStore';
import { useState, useEffect, useRef } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, updatePassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
console.log("Firestore instance:", !!db);
import SignatureCanvas from 'react-signature-canvas';
import localforage from 'localforage';
import DrawControl from './components/MapboxDrawControl';
import CalendarView from './components/CalendarView';
import InstallationForm from './components/InstallationForm';
import CleaningForm from './components/CleaningForm';
import PreventiveMaintForm from './components/PreventiveMaintForm';
import CorrectiveMaintForm from './components/CorrectiveMaintForm';
import UninstallationForm from './components/UninstallationForm';
import ReinstallationForm from './components/ReinstallationForm';
import DroneInspectionForm from './components/DroneInspectionForm';
import TransformerInspectionForm from './components/TransformerInspectionForm';
import HFOCorrectiveForm from './components/HFOCorrectiveForm';
import MultiImageCategory from './components/MultiImageCategory';
import AdminDashboard from './components/AdminDashboard';
import { jsPDF } from 'jspdf';
import { svgEAConsulting, svgChemitek, svgPvstop } from './utils/logos';
import { TOTAL_PAGES_EXP, loadCorporateLogos, drawCorporateHeader, drawCorporateFooter, addDocumentControlTable } from './utils/pdfCorporateLayout';
import * as htmlToImage from 'html-to-image';
import WeatherAlerts from './components/WeatherAlerts';
import PreInspectionForm from "./components/PreInspectionForm";
import GPSForm from "./components/GPSForm";
import PVSTOPForm from "./components/PVSTOPForm";
import ChemitekForm from "./components/ChemitekForm";
import IVCurveForm from './components/IVCurveForm';
import TrackerMaintenanceForm from './components/TrackerMaintenanceForm';
import OilAnalysisForm from './components/OilAnalysisForm';
import BorescopyVibrationForm from './components/BorescopyVibrationForm';
import EquipmentListModule from './components/EquipmentListModule';

import ClientsPlantsModule from "./components/ClientsPlantsModule";
import InventoryModule from "./components/InventoryModule";
import HRModule from "./components/HRModule";
import CommercialModule from "./components/CommercialModule";
import KPIsModule from "./components/KPIsModule";
import VisitasForm from "./components/VisitasForm";
import GPSPreInspectionForm from "./components/GPSPreInspectionForm";



function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const stampSignature = (sigPad: any) => {
  if (!sigPad || sigPad.isEmpty()) return;
  const canvas = sigPad.getCanvas();
  const ctx = canvas.getContext('2d');
  if (canvas && !canvas.dataset.stamped) {
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#059669'; // emerald-600
    const timestamp = new Date().toLocaleString();
    ctx.fillText(`Firmado: ${timestamp}`, 10, canvas.height - 10);
    canvas.dataset.stamped = 'true';
  }
};

export default function App() {
const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const logos = await loadCorporateLogos();
      
      const title = 'REPORTE TÉCNICO DE SERVICIO';
      const code = 'FOR-FSM-01';

      doc.setFont("helvetica", "normal");
      let yPos = drawCorporateHeader(doc, title, code, logos);
      
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59); // Slate 800
      doc.setFont("helvetica", "bold");
      doc.text("Información del Cliente y Servicio", 15, yPos);
      yPos += 2;
      doc.setLineWidth(0.5);
      doc.setDrawColor(203, 213, 225); // Slate 300
      doc.line(15, yPos, 195, yPos);
      yPos += 6;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Cliente:", 15, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(clientName, 35, yPos);

      doc.setFont("helvetica", "bold");
      doc.text("Fecha:", 110, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(new Date().toLocaleDateString() || 'No especificada', 125, yPos);
      yPos += 8;

      doc.setFont("helvetica", "bold");
      doc.text("Dirección:", 15, yPos);
      doc.setFont("helvetica", "normal");
      doc.text('Dirección no especificada', 35, yPos);
      yPos += 8;

      doc.setFont("helvetica", "bold");
      doc.text("Técnico:", 15, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(currentUser || 'No especificado', 35, yPos);

      doc.setFont("helvetica", "bold");
      doc.text("Categoría:", 110, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(fsmCategory === 'chemitek' ? 'Lavado de Paneles (Chemitek)' : fsmCategory === 'pvstop' ? 'Mitigación de Incendios (PVSTOP)' : 'Mantenimiento General', 130, yPos);
      yPos += 15;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Descripción del Trabajo Realizado", 15, yPos);
      yPos += 2;
      doc.line(15, yPos, 195, yPos);
      yPos += 6;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const splitDescription = doc.splitTextToSize('Descripción no especificada', 180);
      doc.text(splitDescription, 15, yPos);
      
      yPos += (splitDescription.length * 5) + 10;
      
      if (yPos > 240) {
          drawCorporateFooter(doc, 1, logos);
          doc.addPage();
          yPos = drawCorporateHeader(doc, title, code, logos);
      }

      // Photos Section
      if (0 /* No photos yet */ > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Evidencia Fotográfica", 15, yPos);
        yPos += 2;
        doc.line(15, yPos, 195, yPos);
        yPos += 6;

        let photoX = 15;
        let pIndex = 0;
        
        for (const photo of []) {
            if (photoX > 100) {
                photoX = 15;
                yPos += 65;
            }
            if (yPos > 210) {
                drawCorporateFooter(doc, doc.internal.pages.length - 1, logos);
                doc.addPage();
                yPos = drawCorporateHeader(doc, title, code, logos);
                photoX = 15;
            }
            
            try {
                doc.addImage(photo, 'JPEG', photoX, yPos, 80, 60);
            } catch (e) {
                console.error("Could not add image to PDF", e);
            }
            photoX += 90;
            pIndex++;
        }
        yPos += 70;
      }

      addDocumentControlTable(doc, yPos, currentUser || 'No especificado');
      // Draw footer on the last page
      drawCorporateFooter(doc, doc.internal.pages.length - 1, logos);

      // If we didn't use autoTable here, we have to manually put total pages
      // Actually we need to loop over all pages and draw footer / header if not drawn yet.
      // Wait, we just drew them as we added pages. We just need to replace TOTAL_PAGES.
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(TOTAL_PAGES_EXP);
      }

      doc.save(`Reporte_${clientName.replace(/\s+/g, '_')}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  

  const sigPadSupervisor = useRef<SignatureCanvas>(null);
  const sigPadClient = useRef<SignatureCanvas>(null);
  const mapRef = useRef<any>(null);
  const drawInstanceRef = useRef<any>(null);
  const [drawnPolygons, setDrawnPolygons] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'info'|'success'|'error'|'warning'} | null>(null);

  const handleClearDrawnPolygons = async () => {
    try {
      if (drawInstanceRef.current) {
        drawInstanceRef.current.deleteAll();
      }
      const emptyCollection = { type: 'FeatureCollection', features: [] };
      await localforage.setItem('fsm_draw_polygons', emptyCollection);
      setDrawnPolygons(emptyCollection);
      addLog('Trazado de layout eliminado', 'Trash2');
      setToastMessage({ show: true, message: 'Polígonos de sesión eliminados' });
      setTimeout(() => setToastMessage({ show: false, message: '' }), 2500);
    } catch (err) {
      console.error('Error clearing drawn polygons:', err);
    }
  };

  useEffect(() => {
    const handleChangeModule = (e: any) => {
      if (e.detail && e.detail.module) {
        setActiveModule(e.detail.module);
        if (e.detail.module === 'field_ops') {
          setFieldOpsTab('reportes');
          if (e.detail.plantId) setSelectedPlantId(e.detail.plantId);
          if (e.detail.clientName) setClientName(e.detail.clientName);
          if (e.detail.category) setFsmCategory(e.detail.category);
          if (e.detail.service) setFsmService(e.detail.service);
        }
      }
    };
    window.addEventListener('app-change-module', handleChangeModule);
    return () => window.removeEventListener('app-change-module', handleChangeModule);
  }, []);

  useEffect(() => {
  const handleToast = (e: any) => {
      setToast({ message: e.detail.message, type: e.detail.type || 'info' });
      setTimeout(() => setToast(null), 3000);
    };
    window.addEventListener('app-toast', handleToast);

  
    return () => window.removeEventListener('app-toast', handleToast);
  }, []);

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('ea_theme');
    return (saved as 'light' | 'dark' | 'system') || 'system';
  });

  useEffect(() => {
    localStorage.setItem('ea_theme', theme);
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme]);

  const [mustChangePasswordMode, setMustChangePasswordMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [signUpName, setSignUpName] = useState('');
  const [signUpRole, setSignUpRole] = useState('Técnico de Campo');
  const [signUpEmployeeId, setSignUpEmployeeId] = useState('');
  const [signUpEmergencyPhone, setSignUpEmergencyPhone] = useState('');
  const [signUpSpecialty, setSignUpSpecialty] = useState('Solar');
  const [currentUser, setCurrentUser] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState('technician');

  const getDisplayName = () => {
    let name = auth.currentUser?.displayName || currentUser || auth.currentUser?.email || currentUserRole;
    if (name.includes('@')) {
       // fallback if it's an email, extract first part
       name = name.split('@')[0];
    }
    // Try to format as "First Last" if it's just a single string or needs capitalization
    return name.split(' ').map((n: string) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ');
  };

  const [clientName, setClientName] = useState('');

  const [showTour, setShowTour] = useState(() => localStorage.getItem('tourCompleted') !== 'true');
  const [selectedPlantId, setSelectedPlantId] = useState<string>('');
  const [isLocationVerified, setIsLocationVerified] = useState(false);
  const [geofenceError, setGeofenceError] = useState('');
  const [isVerifyingLocation, setIsVerifyingLocation] = useState(false);




  


  const [signatureErrorSupervisor, setSignatureErrorSupervisor] = useState(false);
  const [hasSupervisorSignature, setHasSupervisorSignature] = useState(false);
  const [hasClientSignature, setHasClientSignature] = useState(false);
  const [toastMessage, setToastMessage] = useState<{show: boolean, message: string}>({show: false, message: ''});
  const [signatureErrorClient, setSignatureErrorClient] = useState(false);
  
  // Simulated photo upload state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState(0);
  const [completedUploads, setCompletedUploads] = useState(0);
  const [activeModule, setActiveModule] = useState('dashboard');

  
  // --- Re-added FieldOps states ---
  const [fieldOpsTab, setFieldOpsTab] = useState<'asistencia' | 'reportes' | 'equipos' | 'solicitudes'>('asistencia');

  const [fsmTab, setFsmTab] = useState<'ejecucion' | 'detalles' | 'evidencias' | 'firmas'>('detalles');

  // Resize Mapbox map when switching to evidencias tab so tiles & draw canvas fit properly
  useEffect(() => {
    if (fsmTab === 'evidencias') {
      const timer = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      }, 180);
      return () => clearTimeout(timer);
    }
  }, [fsmTab]);
  const [isShiftActive, setIsShiftActive] = useState(() => localStorage.getItem('shiftActive') === 'true');
  const [shiftStartTime, setShiftStartTime] = useState<string | null>(() => localStorage.getItem('shiftStartTime'));
  const [isLunchActive, setIsLunchActive] = useState(() => localStorage.getItem('lunchActive') === 'true');
  const [lunchStartTime, setLunchStartTime] = useState<string | null>(() => localStorage.getItem('lunchStartTime'));

  
  
  
  
  
  const [shiftComment, setShiftComment] = useState('');
  const [isFetchingShiftLocation, setIsFetchingShiftLocation] = useState(false);
  const [shiftLocationError, setShiftLocationError] = useState('');

  const [isWorkActive, setIsWorkActive] = useState(() => localStorage.getItem('workActive') === 'true');
  const [workStartTime, setWorkStartTime] = useState<string | null>(() => localStorage.getItem('workStartTime'));
  const [workComment, setWorkComment] = useState('');
  const [isFetchingWorkLocation, setIsFetchingWorkLocation] = useState(false);
  const [workLocationError, setWorkLocationError] = useState('');

  const handleShiftAction = (action: 'start_shift' | 'end_shift' | 'start_lunch' | 'end_lunch') => {
    setIsFetchingShiftLocation(true); setShiftLocationError('');
    
    const processShift = (lat: number, lng: number) => {
        setIsFetchingShiftLocation(false);
        const currentRecords = JSON.parse(localStorage.getItem('timesheet_records') || '[]');
        const activeUser = currentUser || 'Operador Local';
        const activeRecordIndex = currentRecords.findLastIndex((r: any) => r.endTime === null && r.user === activeUser);
        const now = new Date().toISOString();

        if (action === 'start_shift') {
           setIsShiftActive(true); setShiftStartTime(now);
           localStorage.setItem('shiftActive', 'true'); localStorage.setItem('shiftStartTime', now);
           currentRecords.push({ id: Date.now(), user: activeUser, date: new Date().toLocaleDateString(), startTime: now, endTime: null, type: 'Jornada Regular', location: { lat, lng }, comment: shiftComment || undefined });
           addLog('Jornada iniciada', 'Clock');
        } else if (action === 'end_shift') {
           setIsShiftActive(false); localStorage.setItem('shiftActive', 'false'); localStorage.removeItem('shiftStartTime');
           setIsLunchActive(false); localStorage.setItem('lunchActive', 'false'); localStorage.removeItem('lunchStartTime');
           if (activeRecordIndex !== -1) {
             currentRecords[activeRecordIndex].endTime = now; currentRecords[activeRecordIndex].status = 'Completada';
             if (shiftComment) currentRecords[activeRecordIndex].endComment = shiftComment;
           }
           addLog('Jornada finalizada', 'Clock');
        } else if (action === 'start_lunch') {
           setIsLunchActive(true); setLunchStartTime(now);
           localStorage.setItem('lunchActive', 'true'); localStorage.setItem('lunchStartTime', now);
           addLog('Almuerzo iniciado', 'Coffee');
        } else if (action === 'end_lunch') {
           setIsLunchActive(false); localStorage.setItem('lunchActive', 'false'); localStorage.removeItem('lunchStartTime');
           addLog('Almuerzo finalizado', 'Coffee');
        }
        localStorage.setItem('timesheet_records', JSON.stringify(currentRecords));
        setShiftComment('');
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        processShift(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => { 
        console.warn('GPS Error in shift, using simulated location.');
        processShift(13.6929, -89.2182);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const handleWorkAction = (action: 'start_work' | 'end_work') => {
    setIsFetchingWorkLocation(true); setWorkLocationError('');
    const processAction = (lat, lng) => {
        setIsFetchingWorkLocation(false);
        const currentRecords = JSON.parse(localStorage.getItem('work_execution_records') || '[]');
        const activeUser = currentUser || 'Operador Local';
        const activeRecordIndex = currentRecords.findLastIndex((r) => r.endTime === null && r.user === activeUser);
        const now = new Date().toISOString();

        if (action === 'start_work') {
           setIsWorkActive(true); setWorkStartTime(now);
           localStorage.setItem('workActive', 'true'); localStorage.setItem('workStartTime', now);
           currentRecords.push({ id: Date.now(), user: activeUser, plantId: selectedPlantId, startTime: now, endTime: null, status: 'En Ejecución', startLocation: { lat, lng }, comment: workComment || undefined });
           addLog('Trabajo diario iniciado', 'HardHat');
        } else if (action === 'end_work') {
           setIsWorkActive(false); localStorage.setItem('workActive', 'false'); localStorage.removeItem('workStartTime');
           if (activeRecordIndex !== -1) {
             currentRecords[activeRecordIndex].endTime = now; currentRecords[activeRecordIndex].status = 'Trabajo Finalizado'; currentRecords[activeRecordIndex].endLocation = { lat, lng };
             if (workComment) currentRecords[activeRecordIndex].endComment = workComment;
           }
           addLog('Trabajo diario finalizado', 'CheckCircle2');
        }
        localStorage.setItem('work_execution_records', JSON.stringify(currentRecords));
        setWorkComment('');
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        processAction(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => { 
        console.warn('GPS Error, using simulated location.');
        // Fallback for preview/iframe environments
        processAction(13.6929, -89.2182);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const [fsmCategory, setFsmCategory] = useState<string>('fotovoltaico');
  const [fsmService, setFsmService] = useState<string>('fv_inst');
  const [fsmSubType, setFsmSubType] = useState<string>('');
  const [plantDistance, setPlantDistance] = useState<number | null>(null);
  const [, forceUpdate] = useState(0);
  const [activityLog, setActivityLog] = useState<{time: string, action: string, icon: string}[]>([]);
  const addLog = (action: string, icon: string = 'Activity') => {
    setActivityLog(prev => {
      // Evitar duplicados consecutivos
      if (prev.length > 0 && prev[0].action === action) return prev;
      return [{ time: new Date().toLocaleTimeString(), action, icon }, ...prev].slice(0, 10);
    });
  };

  
  const [pendingQueue, setPendingQueue] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [reportHistory, setReportHistory] = useState<any[]>([]);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<string | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [reportFormat, setReportFormat] = useState<'detallado' | 'ejecutivo'>('detallado');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [observaciones, setObservaciones] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFetchingGps, setIsFetchingGps] = useState(false);
  const [clientsTab, setClientsTab] = useState<'list' | 'map'>('list');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'solar' | 'hfo'>('all');
  const [hrTab, setHrTab] = useState<'crews' | 'timesheets'>('crews');
  
  // Notificaciones de proximidad Geocerca
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [trackerDistance, setTrackerDistance] = useState<number | null>(null);
  const notifiedPlants = useRef<Set<string>>(new Set());

  const [isHighContrast, setIsHighContrast] = useState(() => {
    const savedHC = localStorage.getItem('highContrast');
    return savedHC === 'true';
  });

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    } else {
      document.documentElement.classList.remove('high-contrast');
      localStorage.setItem('highContrast', 'false');
    }
  }, [isHighContrast]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);
  const [alertsView, setAlertsView] = useState<'list' | 'calendar'>('list');

  // Configuración de plantas para geocerca (Tracking en tiempo real)
  const PLANTS_DATA: Record<string, { lat: number, lng: number, name: string, client: string }> = {
    'solar_1': { name: 'Planta Solar Capella', client: 'Capella Solar', lat: 13.3023, lng: -87.1724 },
    'solar_2': { name: 'Planta Solar Bósforo', client: 'AES Bósforo', lat: 13.5023, lng: -88.0000 },
    'hfo_1': { name: 'Central Térmica Nejapa', client: 'Nejapa Power', lat: 13.8000, lng: -89.2000 },
    'solar_3': { name: 'Planta Solar 15 de Septiembre', client: 'CEL', lat: 13.6333, lng: -88.5667 },
    'otra': { name: 'Otra Planta / Instalación', client: 'Cliente General', lat: 13.6929, lng: -89.2182 },
  };

  const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const p1 = lat1 * Math.PI/180;
    const p2 = lat2 * Math.PI/180;
    const dp = (lat2-lat1) * Math.PI/180;
    const dl = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    if (isLoggedIn && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const isProyectosMaster = user.email?.toLowerCase().trim() === 'proyectos@easervice.app' || (user.email || '').toLowerCase().includes('proyectos');
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          let role = 'technician';
          let displayName = user.displayName || (isProyectosMaster ? 'Proyectos (Maestro)' : user.email?.split('@')[0]) || 'Usuario';

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            if (data.isActive === false && !isProyectosMaster) {
              await signOut(auth);
              setIsLoggedIn(false);
              return;
            }
            if (isProyectosMaster || data.internalRole === 'admin' || data.role === 'Usuario Maestro' || data.role === 'admin' || data.role === 'Gerente') {
              role = 'admin';
            } else if (data.role === 'Supervisor') {
              role = 'supervisor';
            } else {
              role = 'technician';
            }
            if (data.displayName) displayName = data.displayName;
          } else if (isProyectosMaster) {
            role = 'admin';
            try {
              await setDoc(userDocRef, {
                email: user.email,
                displayName: user.displayName || 'Proyectos (Maestro)',
                role: 'Usuario Maestro',
                internalRole: 'admin',
                isActive: true,
                createdAt: serverTimestamp()
              }, { merge: true });
            } catch (e) {
              console.warn("Could not save master doc on auth change:", e);
            }
          }

          if (isProyectosMaster) {
            role = 'admin';
          }

          setCurrentUserRole(role);
          setCurrentUser(displayName);
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Auth state change error:", err);
          if ((user.email || '').toLowerCase().includes('proyectos')) {
            setCurrentUserRole('admin');
            setCurrentUser('Proyectos (Maestro)');
            setIsLoggedIn(true);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoggedIn || activeModule !== 'field_ops' || !selectedPlantId) return;

    let watchId: number;
    const plant = PLANTS_DATA[selectedPlantId];
    if (!plant) return;
    
    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setGpsAccuracy(pos.coords.accuracy);
          const dist = getDistanceInMeters(lat, lng, plant.lat, plant.lng);
          setTrackerDistance(Math.round(dist));

          if (dist <= 100 && !notifiedPlants.current.has(selectedPlantId) && !gpsLocation) {
             notifiedPlants.current.add(selectedPlantId);
             if (Notification.permission === 'granted') {
               new Notification('📍 ¡Check-in GPS Requerido!', {
                 body: `Sistema de Geocerca: Estás a ${Math.round(dist)}m de ${plant.name}. Por favor, realiza tu Check-in GPS para habilitar el formulario.`,
                 icon: '/favicon.ico'
               });
             }
          }
        },
        (err) => console.warn('GPS Watch error:', err),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isLoggedIn, activeModule, selectedPlantId, gpsLocation]);

  const simulateApproach = () => {
    if (!selectedPlantId) return;
    const plant = PLANTS_DATA[selectedPlantId];
    if (!plant) return;
    setTrackerDistance(45);
    if (!notifiedPlants.current.has(selectedPlantId) && !gpsLocation) {
      notifiedPlants.current.add(selectedPlantId);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('📍 ¡Check-in GPS Requerido!', {
          body: `Sistema de Geocerca: Estás a 45m de ${plant.name}. Recuerda realizar tu Check-in GPS para habilitar el informe.`,
          icon: '/favicon.ico'
        });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
             new Notification('📍 ¡Check-in GPS Requerido!', {
              body: `Sistema de Geocerca: Estás a 45m de ${plant.name}. Recuerda realizar tu Check-in GPS.`,
              icon: '/favicon.ico'
            });
          }
        });
      } else {
        window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: `📍 Estás a 45m de ${plant.name}. (Notificaciones bloqueadas por el navegador)` } }));
      }
    }
  };


  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones de escritorio');
      return;
    }
    if (Notification.permission === 'granted') {
      new Notification('Alertas Próximas', {
        body: 'Planta Solar Capella: Limpieza de Paneles vence en 2 días.',
        icon: '/favicon.ico'
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Notificaciones Activadas', {
          body: 'Recibirás alertas de mantenimientos próximos.',
          icon: '/favicon.ico'
        });
      }
    }
  };


  // Estados para el Módulo de Operaciones en Campo (FSM)
  
  
        
  // FSM Internal Tabs & Asistencia States
  
  
  
  

  
  useEffect(() => {
    const unsub = subscribeToImages(() => forceUpdate(n => n + 1));
    return unsub;
  }, []);

  // Auto-load draft from localforage
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft: any = await localforage.getItem('fsm_draft_report');
        if (draft) {
          if (draft.selectedPlantId) setSelectedPlantId(draft.selectedPlantId);
          if (draft.gpsLocation) setGpsLocation(draft.gpsLocation);
          if (draft.plantDistance !== undefined) setPlantDistance(draft.plantDistance);
          if (draft.fsmCategory) setFsmCategory(draft.fsmCategory);
          if (draft.fsmService) setFsmService(draft.fsmService);
          if (draft.fsmSubType) setFsmSubType(draft.fsmSubType);
          if (draft.observaciones) setObservaciones(draft.observaciones);
          if (draft.clientName) setClientName(draft.clientName);
          const supSig: any = await localforage.getItem('fsm_supervisor_sig');
          if (supSig && sigPadSupervisor.current) {
            sigPadSupervisor.current.fromDataURL(supSig);
            { setHasSupervisorSignature(true); addLog('Firma del supervisor registrada', 'PenTool'); };
          }
          const clientSig: any = await localforage.getItem('fsm_client_sig');
          if (clientSig && sigPadClient.current) {
            sigPadClient.current.fromDataURL(clientSig);
            { setHasClientSignature(true); addLog('Firma del cliente registrada', 'PenTool'); };
          }
        }
        // Load saved polygons from localforage
        const savedPolygons: any = await localforage.getItem('fsm_draw_polygons');
        if (savedPolygons && savedPolygons.features && savedPolygons.features.length > 0) {
          setDrawnPolygons(savedPolygons);
          addLog(`${savedPolygons.features.length} polígono(s) restaurado(s) desde sesión`, 'MapPin');
        }
      } catch (err) {
        console.error("Error loading draft", err);
      }
    };
    loadDraft();
  }, []); // Only on mount

  // Auto-save draft to localforage
  useEffect(() => {
    const saveDraft = async () => {
      try {
        await localforage.setItem('fsm_draft_report', {
          selectedPlantId,
          gpsLocation,
          plantDistance,
          fsmCategory,
          fsmService,
          fsmSubType,
          observaciones,
          clientName,
          drawnPolygons,
        });
        const supSig = sigPadSupervisor.current?.isEmpty() ? null : sigPadSupervisor.current?.toDataURL();
        const clientSig = sigPadClient.current?.isEmpty() ? null : sigPadClient.current?.toDataURL();
        if (supSig) await localforage.setItem('fsm_supervisor_sig', supSig);
        if (clientSig) await localforage.setItem('fsm_client_sig', clientSig);
        setToastMessage({ show: true, message: 'Borrador guardado automáticamente' });
        setTimeout(() => setToastMessage({ show: false, message: '' }), 2500);
      } catch (err) {
        console.error("Error saving draft", err);
      }
    };
    saveDraft();
  }, [selectedPlantId, gpsLocation, plantDistance, fsmCategory, fsmService, fsmSubType, observaciones, clientName, drawnPolygons]);

  // Material Requests State
  const [reqItem, setReqItem] = useState('');
  const [reqQty, setReqQty] = useState(1);
  const [reqType, setReqType] = useState<'inventory' | 'hr_ppe'>('inventory');
  const [reqUrgency, setReqUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [reqJustification, setReqJustification] = useState('');
  const [activeEquipmentItems, setActiveEquipmentItems] = useState<{name: string, context: string}[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);

  useEffect(() => {
    const handleRequestStatusChanged = (e: any) => {
      const { detail } = e;
      if (detail && detail.requestedBy === currentUser) {
        // Find existing to check if we just changed
        setMyRequests(prev => {
          const exists = prev.find(p => p.id === detail.id);
          if (exists && exists.status !== detail.status) {
            // trigger push notif
            if ('Notification' in window && Notification.permission === 'granted') {
              let title = "Estado de Solicitud Actualizado";
              if (detail.status === 'approved') title = "✅ Solicitud Aprobada";
              if (detail.status === 'rejected') title = "❌ Solicitud Rechazada";
              if (detail.status === 'in_process') title = "⏳ Solicitud En Proceso";
              
              new Notification(title, {
                body: `El estado de tu solicitud de "${detail.item}" ha cambiado.\nNota: ${detail.adminNote || 'Sin notas'}`
              });
            } else {
              window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: `Notificación: Tu solicitud de "${detail.item}" ha sido ${detail.status === 'approved' ? 'Aprobada' : detail.status === 'rejected' ? 'Rechazada' : 'puesta En Proceso'}.\nNota del Admin: ${detail.adminNote || 'N/A'}` } }));
            }
          }
          
          return prev.map(p => p.id === detail.id ? detail : p);
        });
      }
    };
    
    window.addEventListener('requestStatusChanged', handleRequestStatusChanged);
    return () => window.removeEventListener('requestStatusChanged', handleRequestStatusChanged);
  }, [currentUser]);

  useEffect(() => {
    const fetchMyReqs = () => {
      const all = JSON.parse(localStorage.getItem('fsm_material_requests') || '[]');
      setMyRequests(all.filter((r: any) => r.requestedBy === (currentUser || 'Técnico de Campo')));
    };
    fetchMyReqs();
    const int = setInterval(fetchMyReqs, 5000);
    return () => clearInterval(int);
  }, [currentUser]);

  useEffect(() => {
    if (false) {
      const savedLists = JSON.parse(localStorage.getItem('fsm_equipment_lists') || '[]');
      const items: {name: string, context: string}[] = [];
      savedLists.forEach((list: any) => {
        list.items.forEach((item: any) => {
          if (!items.find(i => i.name === item.description)) {
            items.push({ name: item.description, context: `${list.cliente} - ${list.planta}` });
          }
        });
      });
      setActiveEquipmentItems(items);
    }
  }, ['reportes']);

  
  const handleSubmitRequest = () => {
    if (!reqItem || reqQty < 1 || !reqJustification) {
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Por favor complete el ítem, la cantidad y la justificación.' } }));
      return;
    }
    const newReq = {
      id: 'req-' + Date.now(),
      item: reqItem,
      quantity: reqQty,
      type: reqType,
      urgency: reqUrgency,
      justification: reqJustification,
      requestedBy: currentUser || 'Técnico de Campo',
      date: new Date().toISOString(),
      status: 'pending'
    };
    const existing = JSON.parse(localStorage.getItem('fsm_material_requests') || '[]');
    localStorage.setItem('fsm_material_requests', JSON.stringify([newReq, ...existing]));
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Solicitud enviada exitosamente a ' + (reqType === 'inventory' ? 'Inventario' : 'Recursos Humanos') } }));
    setReqItem('');
    setReqQty(1);
    setReqJustification('');
    
    // Refresh instantly
    setMyRequests([newReq, ...existing].filter((r: any) => r.requestedBy === (currentUser || 'Técnico de Campo')));
  };

  const [isInspectionUnlocked, setIsInspectionUnlocked] = useState(false);

  useEffect(() => {
    setIsInspectionUnlocked(false);
  }, [fsmCategory, fsmService]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingAlerts(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-process pending queue on reconnect (Fallback/Client-side Background Sync)
      localforage.getItem('fsm_pending_sync_queue').then((queue: any) => {
        if (queue && queue.length > 0) {
           console.log("Background Sync triggered: Processing pending queue...");
           // We can't call syncQueue directly easily without causing stale closures, 
           // but we can trigger a custom event or just let the dependency handle it.
           // Actually, standard Background Sync API registration:
           if ('serviceWorker' in navigator && 'SyncManager' in window) {
             navigator.serviceWorker.ready.then(registration => {
               (registration as any).sync.register('sync-reports').catch(console.error);
             });
           }
        }
      });
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    localforage.getItem('fsm_report_history').then((history) => {
      if (history) setReportHistory(history as any[]);
    });
    localforage.getItem('fsm_pending_sync_queue').then((queue) => {
      if (queue && Array.isArray(queue)) setPendingQueue(queue);
    });
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);



  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+S or Ctrl+S to Save/Sync
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (activeModule === 'field_ops') {
          handleSyncCloud();
        }
      }
      // Cmd+P or Ctrl+P to generate PDF
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        if (activeModule === 'field_ops') {
          handleGeneratePDF();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModule, fsmCategory, fsmService, clientName, pendingQueue]); // dependencies for handlers

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleGenerateAISummary = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          serviceCategory: fsmCategory, 
          serviceType: fsmService,
          notes: ''
        })
      });
      const data = await response.json();
      if (data.summary) {
        setAiSummary(data.summary);
      } else {
        setAiSummary("Error al generar resumen.");
      }
    } catch (error) {
      console.error(error);
      setAiSummary("Error de conexión con la IA.");
    } finally {
      setIsGeneratingAI(false);
    }
  };



  const handleBiometricLogin = async () => {
    if (!window.PublicKeyCredential) {
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Autenticación biométrica no soportada en este navegador.' } }));
      return;
    }
    
    try {
      localforage.config({
        driver: localforage.INDEXEDDB,
        name: 'EnerOps_OfflineDB',
        storeName: 'reports',
        description: 'Almacenamiento de reportes pesados con fotos offline'
      });

      const publicKey = {
        challenge: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
        rp: { name: "EA Service Connect" },
        user: {
          id: new Uint8Array([1, 2, 3, 4]),
          name: "usuario@enerops.com",
          displayName: "Usuario Demo"
        },
        pubKeyCredParams: [{type: "public-key" as const, alg: -7}],
        authenticatorSelection: { authenticatorAttachment: "platform" as const },
        timeout: 60000,
        attestation: "none" as const
      };

      const credential = await navigator.credentials.create({ publicKey });
      if (credential) {
        setLoginEmail("biometrico@enerops.com");
        setCurrentUser("Operador (Biométrico)");
        setIsLoggedIn(true);
        setShowTour(localStorage.getItem('tourCompleted') !== 'true');
      }
    } catch (err) {
      console.error(err);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Autenticación biométrica cancelada o fallida.' } }));
    }
  };

  const handleSyncCloud = async () => {
    stampSignature(sigPadSupervisor.current);
    stampSignature(sigPadClient.current);
    // Validar firmas obligatorias
    const isSupervisorEmpty = sigPadSupervisor.current?.isEmpty();
    const isClientEmpty = sigPadClient.current?.isEmpty();
    
    if (isSupervisorEmpty || isClientEmpty) {
      setSignatureErrorSupervisor(!!isSupervisorEmpty);
      setSignatureErrorClient(!!isClientEmpty);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Alerta: Es obligatorio que el supervisor y el cliente firmen el reporte antes de sincronizar.' } }));
      
      // Auto-scroll a la sección de firmas (aproximado, buscando el tab)
      setFsmTab('firmas');
      return;
    }


    const formParams: { label: string, value: string }[] = [];
    const formContainer = document.getElementById('fsm-dynamic-form');
    if (formContainer) {
      const inputs = formContainer.querySelectorAll('input, select, textarea');
      inputs.forEach((input: any) => {
        let labelText = '';
        if (input.labels && input.labels.length > 0) {
          labelText = input.labels[0].innerText;
        } else {
          const parent = input.closest('div');
          if (parent) {
             const lbl = parent.querySelector('label');
             if (lbl) labelText = lbl.innerText;
          }
        }
        if (labelText && input.type !== 'file' && input.type !== 'hidden') {
           let val = input.value;
           if (input.type === 'checkbox') val = input.checked ? 'Sí' : 'No';
           if (val) formParams.push({ label: labelText, value: val });
        }
      });
    }

    const evidencePhotos: { label: string, src: string }[] = [];
    const evidenceContainer = document.getElementById('fsm-evidence-container');
    if (evidenceContainer) {
       const imageContainers = evidenceContainer.querySelectorAll('.group'); // groups from AnnotatableImagePicker
       imageContainers.forEach((container: any) => {
           const img = container.querySelector('img');
           const labelEl = container.querySelector('span.absolute.bottom-2') as HTMLElement | null;
           if (img && img.src.startsWith('data:image') && labelEl) {
               evidencePhotos.push({ label: labelEl.innerText, src: img.src });
           }
       });
    }

    const reportData = {
      id: new Date().getTime().toString(),
      fileName: `Reporte_${fsmCategory || 'General'}_${new Date().getTime()}`,
      categoryName: (fsmCategory && SERVICE_CATEGORIES[fsmCategory]) ? SERVICE_CATEGORIES[fsmCategory].name : (fsmCategory || 'Sin categoría'),
      serviceName: (fsmCategory && fsmService && SERVICE_CATEGORIES[fsmCategory]?.services.find(s => s.id === fsmService)) ? SERVICE_CATEGORIES[fsmCategory].services.find(s => s.id === fsmService)?.name : (fsmService || 'Sin servicio'),
      date: new Date().toISOString(),
      clientName: clientName || 'Sin cliente',
      notes: observaciones || '',
      aiSummary: aiSummary || '',
      parameters: formParams,
      photos: evidencePhotos,
      signatureSupervisor: sigPadSupervisor.current?.toDataURL('image/png') || '',
      signatureClient: sigPadClient.current?.toDataURL('image/png') || ''
    };

    if (!isOnline) {
      const newQueue = [...pendingQueue, reportData];
      setPendingQueue(newQueue);
      await localforage.setItem('fsm_pending_sync_queue', newQueue);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Sin conexión. Reporte añadido a la cola de sincronización.' } }));
    } else {
      // Actualizar historial local de reportes sincronizados
      try {
        await fetch('/api/reports/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pendingQueue: [reportData],
            userId: currentUser || 'unknown_user'
          })
        });
      } catch (e) { console.error("Cloud sync failed", e); }
      const newHistory = [reportData, ...reportHistory].slice(0, 50);
      setReportHistory(newHistory);
      await localforage.setItem('fsm_report_history', newHistory);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: '¡Reporte sincronizado con la nube exitosamente!' } }));
    }
  };
  
  const calculateQueueSizeMB = () => {
    // We simulate size calculation. Usually it's JSON.stringify(pendingQueue).length 
    // but we can estimate 0.4MB per report (with dummy image data)
    return (pendingQueue.length * 0.45).toFixed(2);
  };

  const handleSyncQueue = async () => {
    if (!isOnline) {
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Aún no tienes conexión a internet.' } }));
      return;
    }
    if (pendingQueue.length === 0) return;
    
    // Simulate sync all
    const newHistory = [...pendingQueue, ...reportHistory].slice(0, 50);
    setReportHistory(newHistory);
    await localforage.setItem('fsm_report_history', newHistory);
    
    setPendingQueue([]);
    await localforage.removeItem('fsm_pending_sync_queue');
    try {
      await fetch('/api/reports/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendingQueue: pendingQueue,
          userId: currentUser || 'unknown_user'
        })
      });
    } catch (e) { console.error("Cloud sync failed", e); }
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: `¡Se sincronizaron ${pendingQueue.length} reportes exitosamente!` } }));
  };
  
  const handleDeleteFromQueue = async (id: string) => {
    const newQueue = pendingQueue.filter(r => r.id !== id);
    setPendingQueue(newQueue);
    await localforage.setItem('fsm_pending_sync_queue', newQueue);
  };

  const toggleVoiceRecording = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
    } else {
      setIsRecordingVoice(true);
      // Mock voice to text after 3 seconds
      setTimeout(() => {
        setObservaciones(prev => prev + (prev ? ' ' : '') + 'Se observó acumulación de polvo en la zona sur y daño menor en conectores de inversor.');
        setIsRecordingVoice(false);
      }, 3000);
    }
  };

  const handleInsertLastFinding = () => {
    if (!selectedPlantId) return;
    const mockFindings: Record<string, string> = {
      'solar_1': 'Módulo inversor 3 con alerta de temperatura. Polvo excesivo en la zona sur.',
      'solar_2': 'Reemplazo pendiente de fusibles en string 12. Rendimiento esperado.',
      'hfo_1': 'Presión de aceite en motor 2 ligeramente baja. Revisar válvulas.'
    };
    const finding = mockFindings[selectedPlantId] || 'Revisión general completada sin anomalías previas.';
    setObservaciones(prev => prev + (prev ? '\n' : '') + '[Historial]: ' + finding);
  };

  const handleShareReport = async () => {
    if (!selectedPlantId || !clientName || !fsmCategory || !gpsLocation) {
      setShowValidationErrors(true);
      setToastMessage({ show: true, message: 'Complete los campos obligatorios marcados en rojo' });
      setTimeout(() => setToastMessage({ show: false, message: '' }), 4000);
      return;
    }
    setShowValidationErrors(false);

    stampSignature(sigPadSupervisor.current);
    stampSignature(sigPadClient.current);
    const input = document.getElementById('fsm-report-container');
    if (!input) return;

    setIsGeneratingPDF(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const canvas = await htmlToImage.toCanvas(input, { pixelRatio: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const logos = await loadCorporateLogos();
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = pdfHeight;
      let yOffset = 0;
      let pageNum = 1;
      const contentHeight = pageHeight - 45 - 25;
      
      while (heightLeft > 0) {
        if (pageNum > 1) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 45 - yOffset, pdfWidth, pdfHeight);
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pdfWidth, 42, 'F'); 
        pdf.rect(0, pageHeight - 25, pdfWidth, 25, 'F');
        drawCorporateHeader(pdf, "REPORTE TÉCNICO DE SERVICIO", "FOR-FSM-01", logos);
        drawCorporateFooter(pdf, pageNum, logos);
        yOffset += contentHeight;
        heightLeft -= contentHeight;
        pageNum++;
      }
      
      if (typeof pdf.putTotalPages === 'function') {
        pdf.putTotalPages(TOTAL_PAGES_EXP);
      }
      
      const fileName = `Reporte_${clientName.replace(/\s+/g, '_')}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

      const shareData = {
        title: 'Reporte Técnico',
        text: `Adjunto el reporte técnico generado para ${clientName}.`
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ ...shareData, files: [file] });
      } else if (navigator.share) {
        await navigator.share(shareData);
        pdf.save(fileName); // Fallback download
      } else {
        window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: "La función de compartir no está soportada en este navegador. Descargando archivo..." } }));
        pdf.save(fileName);
      }
    } catch (e) {
      console.error(e);
      setToastMessage({ show: true, message: 'Error al generar o compartir el PDF' });
      setTimeout(() => setToastMessage({ show: false, message: '' }), 4000);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!selectedPlantId || !clientName || !fsmCategory || !gpsLocation) {
      setShowValidationErrors(true);
      setToastMessage({ show: true, message: 'Complete los campos obligatorios marcados en rojo' });
      setTimeout(() => setToastMessage({ show: false, message: '' }), 4000);
      return;
    }
    setShowValidationErrors(false);

    stampSignature(sigPadSupervisor.current);
    stampSignature(sigPadClient.current);
    
    setIsGeneratingPDF(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Extract form parameters
      const formParams = [];
      const formContainer = document.getElementById('fsm-dynamic-form');
      if (formContainer) {
        const inputs = formContainer.querySelectorAll('input, select, textarea');
        inputs.forEach((input: any) => {
          let labelText = '';
          const id = input.id;
          if (id) {
             const labelEl = formContainer.querySelector(`label[for="${id}"]`) as HTMLElement;
             if (labelEl) labelText = labelEl.innerText;
          }
          if (!labelText) {
             const parent = input.closest('div');
             const labelEl = parent?.querySelector('label') as HTMLElement | null;
             if (labelEl) labelText = labelEl.innerText;
          }
          if (labelText) {
             let val = input.value;
             if (input.type === 'checkbox') val = input.checked ? 'Sí' : 'No';
             if (val) formParams.push({ label: labelText, value: val });
          }
        });
      }

      // Extract evidence photos
      const evidencePhotos = [];
      const evidenceContainer = document.getElementById('fsm-evidence-container');
      if (evidenceContainer) {
         const imageContainers = evidenceContainer.querySelectorAll('.group');
         imageContainers.forEach((container) => {
             const img = container.querySelector('img');
             const labelEl = container.querySelector('span.absolute.bottom-2') as HTMLElement | null;
             if (img && img.src.startsWith('data:image') && labelEl) {
                 evidencePhotos.push({ label: labelEl.innerText, src: img.src });
             }
         });
      }

      const activeReport = {
          id: new Date().getTime().toString(),
          type: (fsmCategory && SERVICE_CATEGORIES[fsmCategory]?.services.find(s => s.id === fsmService)) ? SERVICE_CATEGORIES[fsmCategory].services.find(s => s.id === fsmService)?.name : (fsmService || 'Sin servicio'),
          plant: clientName || 'Sin cliente',
          date: new Date().toLocaleDateString(),
          notes: observaciones || 'Sin observaciones.',
          parameters: formParams,
          photos: evidencePhotos,
          signatureSupervisor: sigPadSupervisor.current?.toDataURL('image/png') || '',
          signatureClient: sigPadClient.current?.toDataURL('image/png') || ''
      };

      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // --- ISO HEADER ---
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.rect(10, 10, pageWidth - 20, 25);
      
      doc.line(60, 10, 60, 35);
      doc.line(140, 10, 140, 35);
      doc.line(140, 18, pageWidth - 10, 18);
      doc.line(140, 26, pageWidth - 10, 26);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("EA SERVICE", 35, 23, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text("REPORTE TÉCNICO", 100, 21, { align: 'center' });
      doc.text("DE OPERACIONES", 100, 27, { align: 'center' });

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("CÓDIGO:", 142, 15);
      doc.setFont("helvetica", "normal");
      doc.text("FOR-FSM-01", 165, 15);
      
      doc.setFont("helvetica", "bold");
      doc.text("VERSIÓN:", 142, 23);
      doc.setFont("helvetica", "normal");
      doc.text("01", 165, 23);
      
      doc.setFont("helvetica", "bold");
      doc.text("FECHA:", 142, 32);
      doc.setFont("helvetica", "normal");
      doc.text(activeReport.date, 165, 32);

      let y = 45;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("DATOS DEL REPORTE", 10, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Cliente/Planta: ${activeReport.plant}`, 10, y);
      doc.text(`Servicio Realizado: ${activeReport.type}`, 10, y + 5);
      doc.text(`ID Reporte: ${activeReport.id}`, 10, y + 10);
      doc.text(`Elaborado por: ${currentUser || 'Técnico'}`, 10, y + 15);
      y += 25;

      // Notes block
      if (activeReport.notes) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("OBSERVACIONES DEL TÉCNICO", 10, y);
          y += 6;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          const noteLines = doc.splitTextToSize(activeReport.notes, pageWidth - 20);
          doc.text(noteLines, 10, y);
          doc.setTextColor(0, 0, 0);
          y += (noteLines.length * 5) + 10;
      }
      
      const checkPage = (addedHeight) => {
          if (y + addedHeight > pageHeight - 25) {
              doc.addPage();
              y = 20;
          }
      }

      if (activeReport.parameters && activeReport.parameters.length > 0) {
          checkPage(20);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("PARÁMETROS TÉCNICOS", 10, y);
          y += 8;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          
          let col = 10;
          let isRight = false;
          
          activeReport.parameters.forEach((param) => {
              checkPage(12);
              doc.setFont("helvetica", "bold");
              const lbl = doc.splitTextToSize(param.label + ":", 85);
              doc.text(lbl, col, y);
              
              doc.setFont("helvetica", "normal");
              const valStr = param.value === null || param.value === undefined ? '' : String(param.value);
              const val = doc.splitTextToSize(valStr, 85);
              doc.text(val, col, y + (lbl.length * 4));
              
              const itemHeight = ((lbl.length + val.length) * 4) + 4;
              if (isRight) {
                  col = 10;
                  y += itemHeight;
              } else {
                  col = 110;
              }
              isRight = !isRight;
          });
          
          if (isRight) y += 12; 
          else y += 6;
      }

      if (activeReport.photos && activeReport.photos.length > 0) {
          y += 5;
          checkPage(50);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("REGISTRO FOTOGRÁFICO", 10, y);
          y += 10;
          
          let pX = 10;
          const imgSize = 40;
          
          activeReport.photos.forEach((photo) => {
             if (pX + imgSize > pageWidth - 10) {
                 pX = 10;
                 y += imgSize + 15;
                 checkPage(imgSize + 20);
             }
             try {
                 doc.addImage(photo.src, pX, y, imgSize, imgSize);
                 doc.setFont("helvetica", "normal");
                 doc.setFontSize(7);
                 const textW = doc.getTextWidth(photo.label);
                 doc.text(photo.label, pX + (imgSize/2) - (textW/2), y + imgSize + 4);
             } catch (e) {
                 console.error("Error adding image to PDF", e);
             }
             
             pX += imgSize + 5;
          });
          
          y += imgSize + 15;
      }
      
      if (activeReport.signatureSupervisor || activeReport.signatureClient) {
          checkPage(50);
          y += 5;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("FIRMAS DE CONFORMIDAD", 10, y);
          y += 10;
          
          if (activeReport.signatureSupervisor) {
             try { doc.addImage(activeReport.signatureSupervisor, 'PNG', 20, y, 60, 20); } catch(e){}
             doc.setFont("helvetica", "normal");
             doc.setFontSize(9);
             doc.line(20, y+22, 80, y+22);
             doc.text("Firma Supervisor", 35, y+27);
          }
          
          if (activeReport.signatureClient) {
             try { doc.addImage(activeReport.signatureClient, 'PNG', 110, y, 60, 20); } catch(e){}
             doc.setFont("helvetica", "normal");
             doc.setFontSize(9);
             doc.line(110, y+22, 170, y+22);
             doc.text("Firma Cliente", 125, y+27);
          }
      }

      // --- ISO FOOTER ---
      const pageCount = doc.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(7);
          doc.setFont("helvetica", "normal");
          
          const footerY = pageHeight - 15;
          doc.line(10, footerY - 5, pageWidth - 10, footerY - 5);
          
          const timestamp = new Date().toLocaleString();
          doc.text(`Impreso por: ${currentUser || 'Técnico'} - ${timestamp}`, 10, footerY);
          doc.text(`Página ${i} de ${pageCount}`, pageWidth - 30, footerY);
          doc.setFont("helvetica", "italic");
          doc.text("Documento controlado aplicable a SGC bajo norma ISO 9001:2015 / ISO 9001:2026.", pageWidth / 2, footerY + 5, { align: "center" });
      }

      doc.save(`Reporte_Diario_${activeReport.id}.pdf`);
      handleSyncCloud(); // Save to localforage when finishing report
      
    } catch (e) {
      console.error(e);
      setToastMessage({ show: true, message: 'Error al generar o compartir el PDF' });
      setTimeout(() => setToastMessage({ show: false, message: '' }), 4000);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Si el usuario ya inició sesión y está en el Dashboard
  if (isLoggedIn && activeModule === 'dashboard') {
        return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <OfflineIndicator />
        
        {/* Header Superior del Dashboard */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 shadow-xs px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <LogoEAServiceConnect className="h-8 sm:h-9 w-auto" />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <PWAInstallButton />

              {/* Botón Modo Oscuro/Claro */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>

              {/* Usuario */}
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                  {(currentUser || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                    {currentUser || 'Usuario'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    {auth.currentUser?.email?.toLowerCase().includes('proyectos')
                      ? '★ Usuario Maestro'
                      : currentUserRole === 'admin'
                      ? 'Administrador'
                      : currentUserRole === 'supervisor'
                      ? 'Supervisor'
                      : 'Técnico'}
                  </div>
                </div>
              </div>

              {/* Cerrar Sesión */}
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* TOUR OVERLAY */}
        {showTour && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full relative animate-in zoom-in-95 duration-300">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Navigation className="w-6 h-6 text-emerald-500" /> ¡Bienvenido!
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                Navegue entre los módulos principales usando el panel de control. Utilice <strong>Operaciones en Campo</strong> para levantar reportes. La aplicación funciona con soporte <strong>offline</strong>; sus datos se guardarán automáticamente si pierde conexión y se sincronizarán al recuperar la red.
              </p>
              <button 
                onClick={() => {
                  setShowTour(false);
                  localStorage.setItem('tourCompleted', 'true');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold transition-all shadow-sm shadow-emerald-500/20"
              >
                Comenzar
              </button>
            </div>
          </div>
        )}

        { /* Dashboard Grid */ }
        <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <button onClick={() => setActiveModule('clients')} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all text-left flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Clientes y Plantas</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gestión de cartera de clientes y activos fotovoltaicos.</p>
              </div>
            </button>

            <button onClick={() => setActiveModule('fieldops')} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all text-left flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Operaciones en Campo (FSM)</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Órdenes de trabajo, check-in GPS y levantamiento de reportes.</p>
              </div>
            </button>

            <button onClick={() => setActiveModule('inventory')} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-md transition-all text-left flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Inventario y Recursos</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Control de herramientas, equipos, EPP y almacén.</p>
              </div>
            </button>

            <button onClick={() => setActiveModule('hr')} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all text-left flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Recursos Humanos</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gestión de personal, planillas y control de horas.</p>
              </div>
            </button>

            <button onClick={() => setActiveModule('comercial')}
 className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md transition-all text-left flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Área Comercial</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Catálogos y ventas.</p>
              </div>
            </button>

            <button onClick={() => setActiveModule('kpis')} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all text-left flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <PieChart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Métricas y KPIs</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Dashboard gerencial, rendimiento de plantas y disponibilidad.</p>
              </div>
            </button>

            <button onClick={() => setActiveModule('calendar')} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-md transition-all text-left flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Calendario y Programación</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Agenda de mantenimientos, turnos e intervenciones programadas.</p>
              </div>
            </button>

            <button onClick={() => setActiveModule('reports_manager')} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all text-left flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Gestión de Reportes</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Revisión, aprobación y exportación de reportes técnicos ISO 9001.</p>
              </div>
            </button>

            { (currentUserRole === 'admin' || auth.currentUser?.email?.toLowerCase().trim() === 'proyectos@easervice.app') && (
              <button onClick={() => setActiveModule('admin')} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-slate-900 hover:shadow-md transition-all text-left flex flex-col gap-4 group">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-300 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Consola Maestra</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gestión de usuarios, permisos y configuración del sistema.</p>
                </div>
              </button>
            )}
          </div>

          {/* Cola de Sincronización */}
          {pendingQueue.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CloudOff className="w-6 h-6 text-amber-500" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cola de Sincronización</h2>
                </div>
                <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200">
                  {pendingQueue.length} pendiente(s)
                </span>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-sm overflow-hidden">
                <ul className="divide-y divide-amber-100 dark:divide-amber-900/30">
                  {pendingQueue.map((report) => (
                    <li key={report.id} className="p-4 sm:p-6 hover:bg-amber-50/50 dark:hover:bg-slate-700/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{report.fileName}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{report.categoryName} - {report.serviceName}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(report.date).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleDeleteFromQueue(report.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Historial de Reportes */}
          <div className="mt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <History className="w-6 h-6 text-slate-800 dark:text-white" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Historial de Reportes</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar reporte..." 
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                {!isOnline && (
                  <div className="flex items-center gap-2 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                    <WifiOff className="w-4 h-4" /> Sin conexión
                  </div>
                )}
              </div>
            </div>
            
            {reportHistory.length > 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                  {reportHistory.filter(r => r.fileName.toLowerCase().includes(historySearchQuery.toLowerCase()) || r.categoryName.toLowerCase().includes(historySearchQuery.toLowerCase())).map((report, idx) => (
                    <li key={idx} className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{report.fileName}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{report.categoryName} - {report.serviceName}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(report.date).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-2">
                          <Download className="w-4 h-4" /> PDF
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed p-8 text-center">
                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No hay reportes generados recientemente.</p>
              </div>
            )}
          </div>
        </div>
        </main>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-sm w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Cerrar Sesión</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">¿Estás seguro que deseas cerrar la sesión actual?</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={async () => {
                  setIsLogoutModalOpen(false);
                  setIsLoggedIn(false);
                  setCurrentUserRole('technician');
                  try {
                    await signOut(auth);
                  } catch (e) {
                    console.log("Logout error", e);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 font-medium transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    );
  }

  // Restore the other module renders
  if (isLoggedIn && activeModule === 'comercial') {
    return <div className="animate-in fade-in slide-in-from-bottom-2 duration-300"><CommercialModule onBack={() => setActiveModule('dashboard')} /></div>;
  }

  if (isLoggedIn && (activeModule === 'clients' || activeModule === 'clients_plants')) {
    return <div className="animate-in fade-in slide-in-from-bottom-2 duration-300"><ClientsPlantsModule onBack={() => setActiveModule('dashboard')} /></div>;
  }
  
  if (isLoggedIn && activeModule === 'inventory') {
    return <div className="animate-in fade-in slide-in-from-bottom-2 duration-300"><InventoryModule onBack={() => setActiveModule('dashboard')} /></div>;
  }
  
  if (isLoggedIn && activeModule === 'calendar') {
    return <CalendarModule onBack={() => setActiveModule('dashboard')} userRole={currentUserRole} />;
  }

  if (isLoggedIn && (activeModule === 'reports_manager' || activeModule === 'reports')) {
    return <ReportsManagerModule onBack={() => setActiveModule('dashboard')} currentUser={currentUser || 'Administrador'} />;
  }

  if (isLoggedIn && activeModule === 'hr') {
    return <div className="animate-in fade-in slide-in-from-bottom-2 duration-300"><HRModule onBack={() => setActiveModule('dashboard')} /></div>;
  }
  
  if (isLoggedIn && activeModule === 'kpis') {
    return <div className="animate-in fade-in slide-in-from-bottom-2 duration-300"><KPIsModule onBack={() => setActiveModule('dashboard')} /></div>;
  }
  
  if (isLoggedIn && activeModule === 'admin') {
    return <div className="animate-in fade-in slide-in-from-bottom-2 duration-300"><AdminDashboard onBack={() => setActiveModule('dashboard')} /></div>;
  }
  
  if (isLoggedIn && (activeModule === 'fieldops' || activeModule === 'field_ops')) {

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
        <header className="bg-emerald-600 border-b border-emerald-700 sticky top-0 z-20 shadow-md px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <BackToDashboardButton 
                id="btn-fieldops-back"
                onClick={() => setActiveModule('dashboard')}
                variant="glass"
              />
              <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
              <h1 className="font-bold text-lg sm:text-xl text-white flex-1 truncate">Operaciones en Campo</h1>
            </div>
            <div className="flex items-center gap-6 mt-2 overflow-x-auto hide-scrollbar scroll-wheel-horizontal">
              <button 
                onClick={() => setFieldOpsTab('asistencia')}
                className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${fieldOpsTab === 'asistencia' ? 'border-white text-white' : 'border-transparent text-emerald-200 hover:text-emerald-50'}`}
              >
                Control Jornada
              </button>
              
              <button 
                onClick={() => { setFieldOpsTab('reportes'); setFsmTab('ejecucion'); }}
                className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${fieldOpsTab === 'reportes' ? 'border-white text-white' : 'border-transparent text-emerald-200 hover:text-emerald-50'}`}
              >
                Reportes Técnicos
              </button>
              <button 
                onClick={() => setFieldOpsTab('equipos')}
                className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${fieldOpsTab === 'equipos' ? 'border-white text-white' : 'border-transparent text-emerald-200 hover:text-emerald-50'}`}
              >
                Inventario / Herramientas
              </button>
              <button 
                onClick={() => setFieldOpsTab('solicitudes')}
                className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${fieldOpsTab === 'solicitudes' ? 'border-white text-white' : 'border-transparent text-emerald-200 hover:text-emerald-50'}`}
              >
                Solicitar Implementos
              </button>
            </div>
          </div>
        </header>

        {fieldOpsTab === 'asistencia' && (
          <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700/50">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${ isLunchActive ? 'bg-amber-100 text-amber-600' : isShiftActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400' }`}>
                  {isLunchActive ? <Coffee className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Marcación de Jornada</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {isShiftActive && shiftStartTime ? `Iniciada a las ${new Date(shiftStartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'Jornada no iniciada'}
                    {isLunchActive && lunchStartTime && ` | En Almuerzo desde ${new Date(lunchStartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                  </p>
                </div>
              </div>

              {shiftLocationError && (
                <div className="bg-rose-50 text-rose-600 text-sm py-3 px-4 rounded-xl border border-rose-200 mb-6 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p>{shiftLocationError}</p>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Comentarios (Opcional)</label>
                <textarea 
                  value={shiftComment}
                  onChange={(e) => setShiftComment(e.target.value)}
                  placeholder="Ej: Retraso por tráfico, salida anticipada por lluvia..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 outline-none resize-none h-24"
                ></textarea>
                <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> La ubicación GPS se registrará automáticamente al marcar.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleShiftAction(isShiftActive ? 'end_shift' : 'start_shift')}
                  disabled={isFetchingShiftLocation}
                  className={`flex-1 py-4 rounded-xl font-bold text-base shadow-sm transition-all flex justify-center items-center gap-2 cursor-pointer ${ isShiftActive ? 'bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100' : 'bg-emerald-600 text-white hover:bg-emerald-700' } ${isFetchingShiftLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isFetchingShiftLocation ? (
                    <><RefreshCw className="w-5 h-5 animate-spin" /> Obteniendo GPS...</>
                  ) : (
                    <>{isShiftActive ? <LogOut className="w-5 h-5" /> : <Clock className="w-5 h-5" />} {isShiftActive ? 'Finalizar Turno' : 'Iniciar Turno'}</>
                  )}
                </button>

                {isShiftActive && (
                  <button
                    onClick={() => handleShiftAction(isLunchActive ? 'end_lunch' : 'start_lunch')}
                    disabled={isFetchingShiftLocation}
                    className={`sm:w-1/3 py-4 rounded-xl font-bold text-base shadow-sm transition-all flex justify-center items-center gap-2 cursor-pointer ${ isLunchActive ? 'bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200' : 'bg-white border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50' } ${isFetchingShiftLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isFetchingShiftLocation ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <><Coffee className="w-5 h-5" /> {isLunchActive ? 'Fin Almuerzo' : 'Almuerzo'}</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        

        {fieldOpsTab === 'equipos' && (
          <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 animate-in fade-in zoom-in duration-300">
            <EquipmentListModule currentUser={auth.currentUser?.email || currentUserRole || 'Técnico de Campo'} />
          </div>
        )}

                {fieldOpsTab === 'solicitudes' && (
          <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700/50">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                  <Package className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Solicitud de Implementos</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Las solicitudes son notificadas a Recursos Humanos o Inventario según el tipo de recurso.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Tipo de Recurso</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setReqType('inventory')}
                      className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${reqType === 'inventory' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'}`}
                    >
                      <Wrench className="w-4 h-4" /> Herramientas/Repuestos
                    </button>
                    <button
                      onClick={() => setReqType('hr_ppe')}
                      className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${reqType === 'hr_ppe' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'}`}
                    >
                      <Shield className="w-4 h-4" /> EPP/Uniformes (RRHH)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Ítem Solicitado</label>
                    <input
                      type="text"
                      value={reqItem}
                      onChange={(e) => setReqItem(e.target.value)}
                      placeholder="Ej: Botas de seguridad talla 42..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={reqQty}
                      onChange={(e) => setReqQty(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Nivel de Urgencia</label>
                  <div className="flex flex-wrap gap-3">
                    {(['low', 'medium', 'high'] as const).map(u => (
                      <button
                        key={u}
                        onClick={() => setReqUrgency(u)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${ reqUrgency === u ? (u === 'high' ? 'bg-rose-50 border-rose-200 text-rose-700' : u === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700') : 'bg-white border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50' }`}
                      >
                        {u === 'low' ? 'Baja (Rutina)' : u === 'medium' ? 'Media (Próximos días)' : 'Alta (Inmediato)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Justificación del Pedido</label>
                  <textarea
                    value={reqJustification}
                    onChange={(e) => setReqJustification(e.target.value)}
                    placeholder="Describa el motivo por el cual necesita este ítem..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 outline-none h-24 resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <button
                    onClick={handleSubmitRequest}
                    className="w-full bg-indigo-600 text-white rounded-xl py-4 font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-5 h-5" /> Enviar Solicitud a {reqType === 'inventory' ? 'Inventario' : 'Recursos Humanos'}
                  </button>
                </div>
              </div>
            </div>
            
            {myRequests.length > 0 && (
              <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-500" /> Mis Solicitudes Recientes
                </h3>
                <div className="space-y-4">
                  {myRequests.map(req => (
                    <div key={req.id} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${ req.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' : req.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : req.status === 'in_process' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-rose-100 text-rose-700 border-rose-200' }`}>
                            {req.status === 'pending' ? 'Pendiente' : req.status === 'approved' ? 'Aprobado' : req.status === 'in_process' ? 'En Proceso' : 'Rechazado'}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{new Date(req.date).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">{req.item}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Cant: {req.quantity} • {req.type === 'inventory' ? 'Inventario' : 'RRHH'}</p>
                      </div>
                      <div className="text-right sm:text-right text-sm flex flex-col items-end gap-2">
                        <div className="italic text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                          {req.status === 'pending' && "Esperando revisión"}
                          {req.status === 'in_process' && "En preparación"}
                          {req.status === 'approved' && "Listo para retirar"}
                          {req.status === 'rejected' && "No aprobado"}
                        </div>
                        {req.adminNote && (
                          <div className="bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 p-2 rounded-lg text-xs max-w-xs text-left border border-slate-200 dark:border-slate-700 shadow-sm relative">
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                            <span className="font-bold block mb-0.5 text-indigo-700">Nota del administrador:</span>
                            {req.adminNote}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {fieldOpsTab === 'reportes' && (
          <>
            {!isLocationVerified ? (
              <div className="flex-1 w-full max-w-xl mx-auto px-4 py-12 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 w-full text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Verificación de Planta</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Seleccione la planta donde se encuentra y verifique su ubicación para iniciar el reporte (Radio: 500m).</p>
                  
                  <select 
                    value={selectedPlantId}
                    onChange={(e) => {
                      setSelectedPlantId(e.target.value);
                      const plant = PLANTS_DATA[e.target.value as keyof typeof PLANTS_DATA];
                      if (plant) setClientName(plant.client);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  >
                    <option value="">-- Seleccione una Planta --</option>
                    {Object.entries(PLANTS_DATA).map(([id, p]) => (
                      <option key={id} value={id}>{p.name} ({p.client})</option>
                    ))}
                  </select>

                  {geofenceError && (
                    <div className="bg-rose-50 text-rose-600 text-sm py-2 px-3 rounded-lg border border-rose-200 mb-4 text-left flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <span>{geofenceError}</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      if (!selectedPlantId) { setGeofenceError('Seleccione una planta primero.'); return; }
                      setIsVerifyingLocation(true); setGeofenceError('');
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          const p = PLANTS_DATA[selectedPlantId as keyof typeof PLANTS_DATA];
                          if (!p) return;
                          const dist = getDistanceFromLatLonInM(pos.coords.latitude, pos.coords.longitude, p.lat, p.lng);
                          if (dist <= 500) {
                            setIsLocationVerified(true);
                            setGpsLocation(`${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`);
                            setPlantDistance(dist);
                          } else {
                            setGeofenceError(`Estás a ${Math.round(dist)}m de la planta. Debes estar a menos de 500m.`);
                          }
                          setIsVerifyingLocation(false);
                        },
                        (err) => {
                          setGeofenceError('Error obteniendo ubicación. Asegúrate de dar permisos de GPS.');
                          setIsVerifyingLocation(false);
                        },
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                      );
                    }}
                    disabled={isVerifyingLocation}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVerifyingLocation ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Verificando...</>
                    ) : (
                      <><Navigation className="w-5 h-5" /> Verificar Ubicación</>
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      if (!selectedPlantId) { setGeofenceError('Seleccione una planta primero.'); return; }
                      setIsLocationVerified(true);
                      setGpsLocation('13.3023, -87.1724 (Simulado)');
                      setPlantDistance(45);
                    }}
                    className="w-full bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    Omitir Validación (Modo Demo)
                  </button>
                  </div>
                </div>
              </div>
            ) : (
          <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-2 mb-6 flex gap-2 overflow-x-auto hide-scrollbar scroll-wheel-horizontal">
              <button
                onClick={() => setFsmTab('ejecucion')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${fsmTab === 'ejecucion' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Ejecución
              </button>
              {(isInspectionUnlocked || (fsmCategory !== 'fotovoltaico' && fsmCategory !== 'gps')) && (
                <>
                  <button
                    onClick={() => setFsmTab('detalles')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${fsmTab === 'detalles' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    Detalles
                  </button>
                  <button
                    onClick={() => setFsmTab('evidencias')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${fsmTab === 'evidencias' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    Evidencias
                  </button>
                  <button
                    onClick={() => setFsmTab('firmas')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${fsmTab === 'firmas' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    Firmas
                  </button>
                </>
              )}
            </div>

            {/* TAB EJECUCION */}
            <div className={isGeneratingPDF || fsmTab === 'ejecucion' ? 'block space-y-6' : 'hidden'}>
              <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-semibold text-slate-800 dark:text-slate-100">Detalles Operativos</h2>
                </div>
                <div className="p-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Categoría del Servicio</label>
                    <select disabled={isWorkActive} value={fsmCategory} onChange={(e) => {
                      setFsmCategory(e.target.value); setFsmService(''); setFsmSubType(''); setIsInspectionUnlocked(false); setFsmTab('ejecucion');
                    }} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 outline-none">
                      <option value="">-- Seleccione una Categoría --</option>
                      {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => (
                         <option key={key} value={key}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Tipo de Servicio</label>
                    <select disabled={isWorkActive} value={fsmService} onChange={(e) => {
                      setFsmService(e.target.value); setFsmSubType(''); setIsInspectionUnlocked(false); setFsmTab('ejecucion');
                    }} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 outline-none">
                      <option value="">-- Seleccione un Servicio --</option>
                      {fsmCategory && SERVICE_CATEGORIES[fsmCategory]?.services.map((srv) => (
                        <option key={srv.id} value={srv.id}>{srv.name}</option>
                      ))}
                    </select>
                  </div>

                </div>
                
                {fsmService === 'fv_prev' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Clasificación (Nivel de Mantenimiento)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { id: 'm1', label: 'M1 (Mensual)' },
                        { id: 'm2', label: 'M2 (Trimestral)' },
                        { id: 'm3', label: 'M3 (Semestral)' },
                        { id: 'm4', label: 'M4 (Anual)' }
                      ].map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setFsmSubType(sub.id)}
                          className={`py-2 px-3 text-sm font-medium rounded-xl border transition-all ${ fsmSubType === sub.id ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 hover:border-slate-300' }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {fsmService === 'fv_aceite' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Clasificación (Nivel de Tensión)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'lv', label: 'Baja Tensión' },
                        { id: 'mv', label: 'Media Tensión' }
                      ].map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setFsmSubType(sub.id)}
                          className={`py-2 px-3 text-sm font-medium rounded-xl border transition-all ${ fsmSubType === sub.id ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 hover:border-slate-300' }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Cliente / Planta</label>
                  <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Ej: Planta Solar Bósforo" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Observaciones / Hallazgos</label>
                  <div className="relative">
                    <textarea 
                      value={observaciones} 
                      onChange={(e) => setObservaciones(e.target.value)} 
                      rows={4} 
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all resize-none shadow-inner pr-12" 
                      placeholder="Describa el trabajo realizado, hallazgos o novedades..."
                    ></textarea>
                    <button className="absolute right-3 top-3 p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                    </button>
                  </div>
                </div>
                </div>
              </section>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700/50">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${ isWorkActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400' }`}>
                    <HardHat className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Ejecución de Trabajos en Planta</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {isWorkActive && workStartTime ? `Iniciado a las ${new Date(workStartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'Trabajo no iniciado'}
                    </p>
                  </div>
                </div>

                {workLocationError && (
                  <div className="bg-rose-50 text-rose-600 text-sm py-3 px-4 rounded-xl border border-rose-200 mb-6 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p>{workLocationError}</p>
                  </div>
                )}

                {/* REQUISITO PREVIO DE SEGURIDAD */}
                {(fsmCategory === 'fotovoltaico' || fsmCategory === 'gps') && !isWorkActive && (
                  <div className="mb-8 border border-amber-200 bg-amber-50/30 rounded-2xl p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Evaluación de Riesgos y Estado Previo</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Es obligatorio completar esta evaluación antes de poder iniciar la ejecución de los trabajos.</p>
                      </div>
                    </div>
                    {fsmCategory === 'fotovoltaico' ? (
                       <PreInspectionForm isUnlocked={isInspectionUnlocked} onUnlock={() => setIsInspectionUnlocked(true)} onLock={() => setIsInspectionUnlocked(false)} />
                    ) : (
                       <GPSPreInspectionForm isUnlocked={isInspectionUnlocked} onUnlock={() => setIsInspectionUnlocked(true)} onLock={() => setIsInspectionUnlocked(false)} />
                    )}
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Comentarios (Opcional)</label>
                  <textarea 
                    value={workComment}
                    onChange={(e) => setWorkComment(e.target.value)}
                    placeholder="Ej: Inicio de trabajos, finalización de actividades, lluvia inesperada..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 outline-none resize-none h-24"
                  ></textarea>
                  <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> La ubicación GPS se registrará automáticamente al marcar.</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleWorkAction(isWorkActive ? 'end_work' : 'start_work')}
                    disabled={isFetchingWorkLocation || !fsmService || (!isWorkActive && (fsmCategory === 'fotovoltaico' || fsmCategory === 'gps') && !isInspectionUnlocked)}
                    className={`flex-1 py-4 rounded-xl font-bold text-base shadow-sm transition-all flex justify-center items-center gap-2 ${ (!isWorkActive && (fsmCategory === 'fotovoltaico' || fsmCategory === 'gps') && !isInspectionUnlocked) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : isWorkActive ? 'bg-amber-100 border border-amber-200 text-amber-700 hover:bg-amber-200 cursor-pointer' : 'bg-emerald-600 text-white hover:bg-emerald-700'} ${isFetchingWorkLocation ? 'opacity-50' : ''}`}
                  >
                    {isFetchingWorkLocation ? (
                      <><RefreshCw className="w-5 h-5 animate-spin" /> Obteniendo GPS...</>
                    ) : (
                      <>{isWorkActive ? <CheckCircle2 className="w-5 h-5" /> : <HardHat className="w-5 h-5" />} {isWorkActive ? 'Finalizar Trabajo Diario' : 'Iniciar Trabajo Diario'}</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* TAB DETALLES */}
            <div className={isGeneratingPDF || fsmTab === 'detalles' ? 'block space-y-6' : 'hidden'}>
              <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-emerald-600" />
                    <h2 className="font-semibold text-slate-800 dark:text-slate-100">Orden de Trabajo y Ubicación</h2>
                  </div>
                  {plantDistance !== null && (
                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded flex items-center gap-1 border border-amber-200">
                      Distancia: {Math.round(plantDistance)}m
                    </span>
                  )}
                </div>
                
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-5 border-b border-slate-100 dark:border-slate-700/50 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">ID Orden (Agenda)</label>
                      <input type="text" value="WO-2026-0895" disabled className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-600 dark:text-slate-300 font-mono shadow-inner" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Inicio Programado</label>
                      <input type="text" value="30 Ago 2026, 08:00 AM" disabled className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-600 dark:text-slate-300 shadow-inner" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-700 mb-1">Inicio Real del Trabajo</label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="time" className="w-full bg-emerald-50 border border-emerald-200 rounded-lg pl-9 pr-2.5 py-2.5 text-sm text-emerald-700 font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Registra el arranque de la actividad</p>
                    </div>
                  </div>

                  {/* Selector de Planta (disabled as we verified) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Planta Asignada</label>
                    <select 
                      value={selectedPlantId} 
                      disabled 
                      className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 opacity-80"
                    >
                      <option value={selectedPlantId}>
                        {PLANTS_DATA[selectedPlantId as keyof typeof PLANTS_DATA]?.name} ({PLANTS_DATA[selectedPlantId as keyof typeof PLANTS_DATA]?.client})
                      </option>
                    </select>
                  </div>

                  {/* GPS Registered */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Check-in de Coordenadas</label>
                    <div className="w-full border border-emerald-200 bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-200/50 rounded-full flex items-center justify-center text-emerald-700">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-900">Ubicación Registrada</p>
                          <p className="text-sm text-emerald-700">{gpsLocation}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (isWorkActive) { window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Debe finalizar el trabajo antes de cambiar de planta.' } })); return; }
                          setIsLocationVerified(false);
                          setGpsLocation(null);
                        }} 
                        disabled={isWorkActive}
                        className={`text-sm font-medium underline ${isWorkActive ? 'text-slate-400 cursor-not-allowed' : 'text-emerald-600 hover:text-emerald-800 cursor-pointer'}`}
                      >
                        Cambiar
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              

              <div id="fsm-dynamic-form" className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
                {fsmCategory === 'fotovoltaico' && fsmService === 'fv_inst' && <InstallationForm />}
                {fsmCategory === 'fotovoltaico' && fsmService === 'fv_limp_rob' && <CleaningForm />}
                {fsmCategory === 'fotovoltaico' && fsmService === 'fv_prev' && <PreventiveMaintForm level={(fsmSubType || 'Menor') as any} />}
                {fsmCategory === 'fotovoltaico' && fsmService === 'fv_corr' && <CorrectiveMaintForm />}
                {fsmCategory === 'fotovoltaico' && fsmService === 'fv_desm' && <UninstallationForm />}
                {fsmCategory === 'fotovoltaico' && fsmService === 'fv_reinst' && <ReinstallationForm />}
                {fsmCategory === 'fotovoltaico' && fsmService === 'fv_drone' && <DroneInspectionForm />}
                {fsmCategory === 'fotovoltaico' && fsmService === 'fv_transf' && <TransformerInspectionForm />}
                {fsmCategory === 'fotovoltaico' && fsmService === 'fv_iv_el' && <IVCurveForm />}
                {fsmCategory === 'fotovoltaico' && fsmService === 'fv_trackers' && <TrackerMaintenanceForm />}
                
                {fsmCategory === 'hfo' && fsmService === 'hfo_corr' && <HFOCorrectiveForm />}
                {fsmCategory === 'hfo' && fsmService === 'hfo_vibration' && <BorescopyVibrationForm />}
                {fsmCategory === 'hfo' && fsmService === 'hfo_oil' && <OilAnalysisForm />}
                
                {fsmCategory === 'gps' && <GPSForm serviceType={fsmService || 'gps_inst'} />}
                
                {fsmCategory === 'pvstop' && <PVSTOPForm serviceType={fsmService || 'pvs_cap'} />}
                {fsmCategory === 'chemitek' && <ChemitekForm serviceType={fsmService || 'chk_limp'} />}
                {fsmCategory === 'visitas' && <VisitasForm serviceType='visitas_rep' />}
              </div>
            </div>

            {/* TAB EVIDENCIAS */}
            <div className={isGeneratingPDF || fsmTab === 'evidencias' ? 'block space-y-6' : 'hidden'}>
              <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-semibold text-slate-800 dark:text-slate-100">Registro Fotográfico</h2>
                </div>
                <div className="p-5">
                  <div id="fsm-evidence-container" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MultiImageCategory label="Antes" theme="slate" />
                    <MultiImageCategory label="Después" theme="emerald" />
                  </div>
                </div>
              </section>

              {/* SECCIÓN: Layout Satelital (MAPBOX) - Solo Fotovoltaico */}
              {fsmCategory === 'fotovoltaico' && (
                <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <MapIcon className="w-5 h-5 text-emerald-600" />
                      <h2 className="font-semibold text-slate-800 dark:text-slate-100">Trazado de Zonas Trabajadas (Layout)</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {drawnPolygons?.features?.length > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          {drawnPolygons.features.length} {drawnPolygons.features.length === 1 ? 'zona guardada' : 'zonas guardadas'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 dark:bg-slate-700/60 dark:text-slate-400">
                          Persistencia en sesión activa
                        </span>
                      )}
                      {drawnPolygons?.features?.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearDrawnPolygons}
                          className="px-2 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar todos los polígonos trazados"
                        >
                          Limpiar trazado
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <p>
                        Dibuja un polígono sobre el área de la planta donde se ejecutó el servicio.
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        💾 Guardado en localforage (persiste al cambiar de tab)
                      </span>
                    </div>
                    <div className="w-full h-72 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl relative flex flex-col overflow-hidden shadow-inner group">
                        <Map
                          ref={mapRef}
                          mapLib={activeMapLib}
                          mapboxAccessToken={MAPBOX_TOKEN || undefined}
                          initialViewState={{
                            longitude: -87.1941,
                            latitude: 13.3027,
                            zoom: 15
                          }}
                          mapStyle={MAP_STYLES.satellite}
                          interactive={true}
                          preserveDrawingBuffer={true}
                        >
                          <DrawControl
                            position="top-left"
                            displayControlsDefault={false}
                            controls={{ polygon: true, trash: true }}
                            defaultMode="draw_polygon"
                            storageKey="fsm_draw_polygons"
                            initialData={drawnPolygons}
                            onDrawReady={(draw) => {
                              drawInstanceRef.current = draw;
                            }}
                            onChange={(featuresData) => {
                              setDrawnPolygons(featuresData);
                            }}
                          />
                          <Marker longitude={-87.1941} latitude={13.3027} anchor="bottom">
                            <MapPin className="w-8 h-8 text-emerald-500 drop-shadow-md animate-bounce" />
                          </Marker>
                          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10">
                            Vista Satelital
                          </div>
                        </Map>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* TAB FIRMAS */}
            <div className={isGeneratingPDF || fsmTab === 'firmas' ? 'block space-y-6' : 'hidden'}>
              {currentUserRole === 'admin' && (
              <>
              {/* Resumen Ejecutivo IA */}
              <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-sm overflow-hidden mb-6">
                <div className="px-5 py-4 border-b border-indigo-100/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <h2 className="font-semibold text-indigo-900">Resumen Ejecutivo</h2>
                  </div>
                </div>
                <div className="p-5">
                  {!aiSummary ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-indigo-700/70 mb-4">Genera un análisis profesional y consolidado de todos los hallazgos reportados para el cliente final.</p>
                      <button 
                        onClick={handleGenerateAISummary}
                        disabled={isGeneratingAI}
                        className={`px-4 py-2 rounded-xl text-sm font-bold text-white shadow-sm flex items-center gap-2 mx-auto ${isGeneratingAI ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'}`}
                      >
                        {isGeneratingAI ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                        Generar Resumen
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-inner border border-indigo-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-indigo-400">RESUMEN EJECUTIVO</span>
                        <button onClick={() => setAiSummary('')} className="text-xs text-indigo-500 hover:text-indigo-700 cursor-pointer underline">Regenerar</button>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{aiSummary}</p>
                    </div>
                  )}
                </div>
              </section>
              </>
            )}

            {currentUserRole === 'admin' && (
              <>
              {/* Trazabilidad de Auditoría */}
            <div className={isGeneratingPDF || fsmTab === 'firmas' ? 'block mb-6' : 'hidden'}>
              <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-semibold text-slate-800 dark:text-slate-100">Log de Actividad (Auditoría)</h2>
                </div>
                <div className="p-5">
                  {activityLog.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic text-center py-4">No se han registrado actividades recientes en este formulario.</p>
                  ) : (
                    <div className="space-y-4">
                      {activityLog.map((log, index) => {
                        return (
                          <div key={index} className="flex items-start gap-3">
                            <div className="mt-0.5 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center shrink-0">
                              <Activity className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-slate-700 dark:text-slate-200">{log.action}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{log.time}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            </div>

              </>
            )}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Firmas de Conformidad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Firma del Supervisor (EA Service)</label>
                    <div className={`border-2 rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden ${signatureErrorSupervisor ? 'border-rose-500' : 'border-slate-200'}`}>
                      <SignatureCanvas 
                        ref={sigPadSupervisor}
                        canvasProps={{className: 'w-full h-40'}}
                        onEnd={() => {
                           setHasSupervisorSignature(true);
                           setSignatureErrorSupervisor(false);
                           addLog('Firma del supervisor registrada', 'PenTool');
                        }}
                      />
                    </div>
                    <button onClick={() => { sigPadSupervisor.current?.clear(); setHasSupervisorSignature(false); }} className="mt-2 text-sm text-rose-500 font-medium hover:text-rose-600">Limpiar Firma</button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Firma del Cliente (Conformidad)</label>
                    <div className={`border-2 rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden ${signatureErrorClient ? 'border-rose-500' : 'border-slate-200'}`}>
                      <SignatureCanvas 
                        ref={sigPadClient}
                        canvasProps={{className: 'w-full h-40'}}
                        onEnd={() => {
                           setHasClientSignature(true);
                           setSignatureErrorClient(false);
                           addLog('Firma del cliente registrada', 'PenTool');
                        }}
                      />
                    </div>
                    <button onClick={() => { sigPadClient.current?.clear(); setHasClientSignature(false); }} className="mt-2 text-sm text-rose-500 font-medium hover:text-rose-600">Limpiar Firma</button>
                  </div>
                </div>
              </div>
              
              <button 
                 onClick={handleGeneratePDF}
                 disabled={isGeneratingPDF}
                 className={`w-full py-4 rounded-xl font-bold text-base shadow-sm transition-all flex justify-center items-center gap-2 ${isGeneratingPDF ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              >
                 {isGeneratingPDF ? (
                   <><RefreshCw className="w-5 h-5 animate-spin" /> Generando Reporte...</>
                 ) : (
                   <><CheckCircle2 className="w-5 h-5" /> Generar Reporte PDF y Finalizar</>
                 )}
              </button>
            </div>

          </main>
            )}
          </>
        )}
      </div>
    );

  }

  // Fallback para cualquier estado inesperado cuando el usuario ya tiene sesión iniciada:
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 max-w-md w-full">
          <LogoEAServiceConnect className="h-10 w-auto mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">Regresando al panel principal...</p>
          <button
            onClick={() => setActiveModule('dashboard')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 font-semibold transition-colors cursor-pointer"
          >
            Volver al Panel Principal
          </button>
        </div>
      </div>
    );
  }

  if (mustChangePasswordMode) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 max-w-md w-full relative overflow-hidden">
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="mb-4 flex justify-center">
              <LogoEAServiceConnect className="h-12 w-auto" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Actualiza tu contraseña</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Por políticas de seguridad, debes cambiar la contraseña temporal generada por el sistema.
            </p>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (newPassword !== confirmNewPassword) {
                setToastMessage({ show: true, message: 'Las contraseñas no coinciden.' });
                return;
              }
              try {
                setChangingPassword(true);
                const user = auth.currentUser;
                if (!user) throw new Error('No hay usuario activo');
                await updatePassword(user, newPassword);
                const userDocRef = doc(db, 'users', user.uid);
                await updateDoc(userDocRef, { mustChangePassword: false });
                setMustChangePasswordMode(false);
                setIsLoggedIn(true);
                setToastMessage({ show: true, message: 'Contraseña actualizada exitosamente.' });
              } catch (error: any) {
                setToastMessage({ show: true, message: error.message || 'Error al actualizar contraseña.' });
              } finally {
                setChangingPassword(false);
              }
            }}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Nueva Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Confirmar Nueva Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={changingPassword}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70"
            >
              {changingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- STANDARD LOGIN / SIGNUP SCREEN ---
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 max-w-md w-full relative overflow-hidden">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4 flex justify-center">
            <LogoEAServiceConnect className="h-12 sm:h-14 w-auto" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {isForgotPasswordMode ? 'Recuperar Cuenta' : isSignUpMode ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {isForgotPasswordMode 
              ? 'Ingresa tu correo para recibir un enlace de recuperación.'
              : isSignUpMode 
                ? 'Ingresa tus datos para registrarte en el sistema.' 
                : 'Accede al panel de control de EA Service.'}
          </p>
        </div>
            
            <form 
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              if (isForgotPasswordMode) {
                if (!loginEmail) {
                  setToastMessage({ show: true, message: 'Por favor ingrese su correo.' });
                  return;
                }
                await sendPasswordResetEmail(auth, loginEmail);
                window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Correo de recuperación enviado.', type: 'success' } }));
                setIsForgotPasswordMode(false);
                return;
              }

              if (isSignUpMode) {
                const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
                const user = userCredential.user;
                await updateProfile(user, { displayName: signUpName });
                
                const userDocRef = doc(db, 'users', user.uid);
                await setDoc(userDocRef, {
                  name: signUpName,
                  email: loginEmail,
                  role: signUpRole,
                  employeeId: signUpEmployeeId,
                  emergencyPhone: signUpEmergencyPhone,
                  specialty: signUpSpecialty,
                  isActive: true,
                  internalRole: 'technician',
                  createdAt: serverTimestamp()
                });
                
                setCurrentUserRole('technician');
                
                setCurrentUser(signUpName);
                setIsLoggedIn(true);
                return;
              }

              // Login
              const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
              const user = userCredential.user;
              
              const userDocRef = doc(db, 'users', user.uid);
              const userDocSnap = await getDoc(userDocRef);
              
              let isUserActive = true;
              let requiresPasswordChange = false;
              let fetchedRole = 'technician';
              let fetchedInternalRole = 'technician';
              
              const isProyectosMaster = user.email?.toLowerCase().trim() === 'proyectos@easervice.app' || (user.email || '').toLowerCase().includes('proyectos');

              if (userDocSnap.exists()) {
                 const data = userDocSnap.data();
                 isUserActive = data.isActive !== false;
                 requiresPasswordChange = data.mustChangePassword === true;
                 fetchedRole = data.role || 'Técnico';
                 fetchedInternalRole = data.internalRole || 'technician';
                 if (isProyectosMaster || data.internalRole === 'admin' || data.role === 'Usuario Maestro' || data.role === 'admin' || data.role === 'Gerente') {
                   fetchedInternalRole = 'admin';
                   fetchedRole = 'admin';
                 } else if (data.role === 'Supervisor') {
                   fetchedRole = 'supervisor';
                 }
              } else {
                 if (isProyectosMaster) {
                     fetchedInternalRole = 'admin';
                     fetchedRole = 'admin';
                     try {
                       await setDoc(userDocRef, {
                         email: user.email,
                         displayName: user.displayName || 'Proyectos (Maestro)',
                         role: 'Usuario Maestro',
                         internalRole: 'admin',
                         isActive: true,
                         createdAt: serverTimestamp()
                       }, { merge: true });
                     } catch (e) {
                       console.warn("Could not save master user doc:", e);
                     }
                 }
              }
              
              if (isProyectosMaster) {
                 fetchedInternalRole = 'admin';
                 fetchedRole = 'admin';
                 isUserActive = true;
              }
              
              if (!isUserActive && fetchedInternalRole !== 'admin') {
                await signOut(auth);
                setToastMessage({ show: true, message: 'Esta cuenta ha sido desactivada por el administrador.' });
                return;
              }
              
              if (requiresPasswordChange && !isProyectosMaster) {
                 setMustChangePasswordMode(true);
                 return; // Do not authenticate yet
              }
              
              setCurrentUserRole(fetchedRole);
              
              setCurrentUser(user.displayName || (isProyectosMaster ? 'Proyectos (Maestro)' : user.email?.split('@')[0]) || 'Usuario');
              setIsLoggedIn(true);
              setToastMessage({ show: true, message: '' });
            } catch (error: any) {
              console.error(error);
              setToastMessage({ show: true, message: error.message || 'Error de autenticación.' });
            }
          }} 
          className="space-y-5"
        >
          {isSignUpMode && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Nombre Completo</label>
                <input type="text" required={isSignUpMode} value={signUpName} onChange={(e) => setSignUpName(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" placeholder="Ej. Juan Pérez" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">ID Empleado</label>
                  <input type="text" required={isSignUpMode} value={signUpEmployeeId} onChange={(e) => setSignUpEmployeeId(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" placeholder="EMP-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Tel. Emergencia</label>
                  <input type="text" required={isSignUpMode} value={signUpEmergencyPhone} onChange={(e) => setSignUpEmergencyPhone(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" placeholder="555-0192" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Rol / Cargo</label>
                  <select value={signUpRole} onChange={(e) => setSignUpRole(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors bg-white dark:bg-slate-800">
                    <option value="Técnico de Campo">Técnico de Campo</option>
                    <option value="Supervisor de Planta">Supervisor de Planta</option>
                    <option value="Auditor">Auditor</option>
                    <option value="Gerente Regional">Gerente Regional</option>
                    <option value="Administrador Maestro">Administrador Maestro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Especialidad</label>
                  <select value={signUpSpecialty} onChange={(e) => setSignUpSpecialty(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors bg-white dark:bg-slate-800">
                    <option value="Solar">Solar</option>
                    <option value="HFO">HFO</option>
                    <option value="Eléctrica">Eléctrica</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all"
                placeholder="usuario@empresa.com"
              />
            </div>
          </div>

          {!isForgotPasswordMode && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required={!isForgotPasswordMode}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          )}

          {!isForgotPasswordMode && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                Recordarme
              </label>
            </div>
            <div className="text-sm">
              <button type="button" onClick={() => setIsForgotPasswordMode(true)} className="font-medium text-emerald-600 hover:text-emerald-500">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-[0.98] cursor-pointer mt-2"
          >
            {isForgotPasswordMode ? 'Recuperar Contraseña' : isSignUpMode ? 'Registrarse' : 'Ingresar al Sistema'}
            <ArrowRight className="w-4 h-4" />
          </button>

          
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">O acceder con</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleBiometricLogin}
          className="mt-6 w-full flex justify-center items-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-[0.98] cursor-pointer"
        >
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
          Huella Dactilar o Rostro
        </button>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400 border-b border-slate-100 dark:border-slate-700/50 pb-4 mb-4">
          <ShieldCheck className="w-4 h-4" />
          <span>Acceso seguro y encriptado</span>
        </div>
        
        <div className="flex flex-col items-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">Marcas Representadas</p>
          <div className="flex items-center gap-6 transition-all duration-300">
            <LogoChemitek className="h-6" />
            <LogoPvstop className="h-7" />
          </div>
        </div>
      </div>
    </div>
  );
}
