import React, { useState } from 'react';
import BackToDashboardButton from './BackToDashboardButton';
import { 
  ShoppingCart, Package, Settings, AlertTriangle, ArrowRight, ArrowLeft, 
  Shield, Zap, Wrench, CheckCircle2, FileText, Download, Calculator, 
  Search, Plus, Minus, Trash2, Printer, Sparkles, Building2, Phone, Mail, User
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { TOTAL_PAGES_EXP, loadCorporateLogos, drawCorporateHeader, drawCorporateFooter, addDocumentControlTable } from '../utils/pdfCorporateLayout';

interface CommercialModuleProps {
  onBack: () => void;
}

interface CartItem {
  id: string;
  category: string;
  name: string;
  code: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  description: string;
}

export default function CommercialModule({ onBack }: CommercialModuleProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'pvstop' | 'chemitek' | 'parts' | 'quote'>('services');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cotizador rápido state
  const [quoteItems, setQuoteItems] = useState<CartItem[]>([]);
  const [clientData, setClientData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    plant: '',
    notes: '',
    validityDays: 15
  });
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);

  const tabs = [
    { id: 'services', label: 'Servicios O&M', icon: <Wrench className="w-4 h-4" /> },
    { id: 'pvstop', label: 'PVSTOP (Extinción Solar)', icon: <Shield className="w-4 h-4" /> },
    { id: 'chemitek', label: 'Chemitek (Químicos)', icon: <Zap className="w-4 h-4" /> },
    { id: 'parts', label: 'Repuestos & Accesorios', icon: <Package className="w-4 h-4" /> },
    { id: 'quote', label: `Cotizador (${quoteItems.length})`, icon: <ShoppingCart className="w-4 h-4" /> }
  ];

  // Servicios disponibles
  const servicesCatalog = [
    {
      id: 'srv-1',
      code: 'SRV-OM-SOLAR',
      name: 'Operación y Mantenimiento Integral O&M',
      category: 'Servicios',
      unit: 'MWp/Año',
      price: 4500,
      description: 'Gestión continua, monitorización SCADA 24/7, mantenimiento preventivo y correctivo de planta fotovoltaica según estándar IEC 62446.',
      features: ['Monitoreo continuo de rendimiento', 'Protocolo preventivo semestral', 'Atención de correctivos con SLA < 4 horas', 'Informes técnicos mensuales ISO 9001']
    },
    {
      id: 'srv-2',
      code: 'SRV-LIMP-SOLAR',
      name: 'Limpieza de Módulos Fotovoltaicos con Soluciones Chemitek',
      category: 'Servicios',
      unit: 'Módulo',
      price: 0.85,
      description: 'Limpieza profesional especializada utilizando cepillos rotativos certificados y producto de desincrustación/antiadherente Chemitek sin degradar el vidrio AR.',
      features: ['Agua osmotizada / tratada', 'Recubrimiento antiestático para retrasar ensuciamiento', 'Inspección visual previa y posterior', 'Medición de ganancia de rendimiento (Soiling Ratio)']
    },
    {
      id: 'srv-3',
      code: 'SRV-DRONE-IR',
      name: 'Inspección Termográfica con Drone (Sensor Radiométrico FLIR)',
      category: 'Servicios',
      unit: 'MWp',
      price: 380,
      description: 'Barrido termográfico aéreo conforme a IEC TS 62446-3 para detección temprana de puntos calientes (hotspots), diodos en corto, strings desconectados.',
      features: ['Cámara dual RGB 4K + Termografía 640x512', 'Orto-mosaico radiométrico geo-referenciado', 'Clasificación de anomalías por nivel de severidad', 'Fichero exportable a CAD y GIS']
    },
    {
      id: 'srv-4',
      code: 'SRV-IV-CURVE',
      name: 'Trazado de Curvas I-V y Pruebas Eléctricas Avanzadas',
      category: 'Servicios',
      unit: 'String',
      price: 45,
      description: 'Medición con trazador de curva I-V de alta precisión con celda de referencia de irradiancia calibrada y sensor PT1000 de temperatura de panel.',
      features: ['Evaluación de degradación PID / LID', 'Determinación de potencia STC real', 'Prueba de resistencia de aislamiento hasta 1500V', 'Detección de mismatch de tensión y corriente']
    },
    {
      id: 'srv-5',
      code: 'SRV-TRAFO-OIL',
      name: 'Mantenimiento y Análisis Físico-Químico de Aceite de Transformador',
      category: 'Servicios',
      unit: 'Transformador',
      price: 1250,
      description: 'Ensayos dieléctricos de rigidez, contenido de humedad ppm, acidez, tensión interfacial y cromatografía de gases disueltos (DGA).',
      features: ['Toma de muestra al vacío según norma ASTM', 'Mantenimiento de silica gel y sellos', 'Inspección de bushing y termografía de conexiones', 'Diagnóstico de degradación de celulosa (Furanos)']
    }
  ];

  // Productos PVSTOP
  const pvstopCatalog = [
    {
      id: 'pvs-1',
      code: 'PVS-CYL-9L',
      name: 'PVSTOP Cilindro Extintor Portátil de 9 Litros',
      category: 'PVSTOP',
      unit: 'Unidad',
      price: 1850,
      description: 'Polímero bloqueador de luz ignífugo que neutraliza la generación eléctrica de paneles solares en segundos, permitiendo a bomberos y técnicos operar sin riesgo de electrocución.',
      features: ['Aislamiento dieléctrico comprobado hasta 36 kV', 'Desactiva el panel en menos de 15 segundos', 'Película despegable tipo peel-off una vez seco', 'No corrosivo, respetuoso con el medio ambiente']
    },
    {
      id: 'pvs-2',
      code: 'PVS-CYL-25L',
      name: 'PVSTOP Unidad Móvil sobre Ruedas 25 Litros',
      category: 'PVSTOP',
      unit: 'Unidad',
      price: 4200,
      description: 'Sistema de respuesta rápida para parques solares a escala de utility o cubiertas industriales extensas con lanza telescópica y manguera de 15 metros.',
      features: ['Gran autonomía para hasta 60 paneles por carga', 'Carro reforzado con neumáticos todo terreno', 'Boquilla regulable de largo alcance (hasta 12 metros)', 'Certificación internacional de extinción solar']
    },
    {
      id: 'pvs-3',
      code: 'PVS-AER-500',
      name: 'PVSTOP Aerosol Táctico de Intervención Rápida 500ml',
      category: 'PVSTOP',
      unit: 'Caja (6 uds)',
      price: 540,
      description: 'Formato ligero para brigadas de mantenimiento e instaladores residenciales/comerciales para bloqueo preventivo durante mantenimientos en caliente.',
      features: ['Listo para usar sin preparación', 'Cubre hasta 2-3 paneles estándar', 'Seguro para el operador', 'Fácil almacenamiento en vehículos de cuadrilla']
    }
  ];

  // Productos Chemitek
  const chemitekCatalog = [
    {
      id: 'chm-1',
      code: 'CHM-WSC-20L',
      name: 'Chemitek Water-Solar Cleaner (WSC) Bidón 20L',
      category: 'Chemitek',
      unit: 'Bidón 20L',
      price: 260,
      description: 'Detergente concentrado de pH neutro certificado por TÜV Sud para módulos solares. Remueve suciedad biológica, polen, polvo de carbón y excrementos de aves.',
      features: ['Dilución 1:100 o 1:200 con agua', 'No anula la garantía de fabricantes de módulos (Tier 1)', 'Biodegradable y seguro para aguas freáticas', 'Rinde para aprox. 1.5 a 2.5 MWp por bidón']
    },
    {
      id: 'chm-2',
      code: 'CHM-ASA-20L',
      name: 'Chemitek Antistatic Solar Armor (ASA) Bidón 20L',
      category: 'Chemitek',
      unit: 'Bidón 20L',
      price: 340,
      description: 'Recubrimiento nanométrico antiestático que neutraliza las cargas superficiales del vidrio, reduciendo la adherencia de polvo y aumentando la producción entre limpiezas.',
      features: ['Efecto hidrofóbico y repelente de polvo', 'Prolonga los intervalos de limpieza hasta en un 50%', 'Aumenta la ganancia energética anual hasta un 3-5%', 'Compatible con todo tipo de vidrio solar antirreflejo']
    },
    {
      id: 'chm-3',
      code: 'CHM-CR-20L',
      name: 'Chemitek Cement & Scale Removal (CR) Bidón 20L',
      category: 'Chemitek',
      unit: 'Bidón 20L',
      price: 390,
      description: 'Formulación ácida orgánica para remover incrustaciones severas de cal, sarro, óxido, residuos de cemento o polvo de canteras sin dañar el marco de aluminio ni sellos.',
      features: ['Actuación rápida contra sales minerales', 'No agresivo con marcos anodizados', 'Enjuague sencillo con agua desmineralizada', 'Fórmula biodegradable patentada']
    }
  ];

  // Repuestos
  const partsCatalog = [
    {
      id: 'prt-1',
      code: 'PRT-MC4-1500',
      name: 'Conector Stäubli Multi-Contact MC4-EVO2 (Macho + Hembra 1500V)',
      category: 'Repuestos',
      unit: 'Pack 50 pares',
      price: 175,
      description: 'Conectores solares originales certificados para 1500V DC y hasta 45A, garantizando cero calentamiento por arco o mismatch de contacto.',
      features: ['Grado IP68 sumergible', 'Resistente a UV y ozono', 'Para cables solares de 4mm² y 6mm²', 'Certificado IEC 62852 y UL 6703']
    },
    {
      id: 'prt-2',
      code: 'PRT-FUS-1500-20',
      name: 'Fusible Cilíndrico gPV 1500V DC 20A 10x85mm',
      category: 'Repuestos',
      unit: 'Caja 10 uds',
      price: 95,
      description: 'Protección fotovoltaica de string contra sobrecorrientes en sistemas solares de alta tensión DC.',
      features: ['Poder de corte 30kA DC', 'Curva de disparo gPV especializada', 'Marcas líderes: Mersen / Eaton Bussmann', 'Bajo nivel de disipación de potencia']
    },
    {
      id: 'prt-3',
      code: 'PRT-SPD-TYPE12',
      name: 'Supresor de Sobretensiones (SPD) DC Tipo I+II 1500V',
      category: 'Repuestos',
      unit: 'Unidad',
      price: 240,
      description: 'Dispositivo de protección contra descargas atmosféricas e impulsos inductivos en cajas de conexión y entradas de inversores.',
      features: ['Corriente de rayo Iimp 12.5 kA (10/350 µs)', 'Contacto de tele-señalización de estado', 'Cartuchos enchufables sustituibles', 'Norma IEC 61643-31']
    },
    {
      id: 'prt-4',
      code: 'PRT-PYRANO-SR05',
      name: 'Piranómetro Clase C Secundario ISO 9060 con Calibración de Fábrica',
      category: 'Repuestos',
      unit: 'Unidad',
      price: 1650,
      description: 'Sensor de irradiancia solar espectralmente plano para estación meteorológica de planta y cálculo del Performance Ratio (PR).',
      features: ['Salida Modbus RTU RS485 o analógica 4-20mA', 'Cúpula óptica de cuarzo de alta transmisión', 'Certificado de calibración trazable WRR', 'Calentador interno anticondensación']
    }
  ];

  const allItems = [...servicesCatalog, ...pvstopCatalog, ...chemitekCatalog, ...partsCatalog];

  const filteredItems = (categoryItems: typeof servicesCatalog) => {
    if (!searchTerm.trim()) return categoryItems;
    const term = searchTerm.toLowerCase();
    return categoryItems.filter(item => 
      item.name.toLowerCase().includes(term) ||
      item.code.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );
  };

  const addToQuote = (item: any) => {
    setQuoteItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: item.id,
        category: item.category,
        name: item.name,
        code: item.code,
        unit: item.unit,
        unitPrice: item.price,
        quantity: 1,
        description: item.description
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setQuoteItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const removeItem = (id: string) => {
    setQuoteItems(prev => prev.filter(i => i.id !== id));
  };

  const subtotal = quoteItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const tax = subtotal * 0.13; // 13% IVA estándar
  const total = subtotal + tax;

  // Generación formal de PDF de cotización cumpliendo la regla de Persisted AI Agent: ISO 9001
  const generateFormalQuotePDF = async () => {
    if (quoteItems.length === 0) {
      alert('Por favor agregue al menos un servicio o producto a la cotización.');
      return;
    }

    try {
      setIsGeneratingQuote(true);
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const quoteCode = `COT-COM-${new Date().getFullYear().toString().slice(-2)}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Control header ISO 9001
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);

      // Tabla de Encabezado ISO 9001
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, 12, 180, 22, 2, 2, 'FD');

      // Logo / Nombre Corporativo
      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129); // Emerald
      doc.text('EA SERVICE CONNECT', 20, 21);
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.text('Energías Renovables & Soluciones O&M Avanzadas', 20, 26);
      doc.text('Distribuidor Autorizado PVSTOP & Chemitek', 20, 30);

      // Box de Control Documental ISO 9001
      doc.setDrawColor(203, 213, 225);
      doc.line(130, 12, 130, 34);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text('CONTROL DOCUMENTAL', 135, 17);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(`CÓDIGO: FOR-COM-01`, 135, 22);
      doc.text(`VERSIÓN: 01`, 135, 26);
      doc.text(`FECHA: ${today}`, 135, 30);

      // Título del documento
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text('PROPUESTA ECONÓMICA Y COTIZACIÓN TÉCNICA', 15, 43);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`N° Cotización: ${quoteCode}`, 15, 48);
      doc.text(`Validez de la oferta: ${clientData.validityDays || 15} días calendario`, 120, 48);

      // Datos del Cliente
      doc.setFillColor(241, 245, 249);
      doc.rect(15, 52, 180, 26, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, 52, 180, 26, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text('DATOS DEL CLIENTE / RECEPTOR:', 18, 57);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`Cliente: ${clientData.name || 'Cliente Particular / Corporativo'}`, 18, 63);
      doc.text(`Empresa / Razón Social: ${clientData.company || 'N/A'}`, 18, 68);
      doc.text(`Planta / Sitio de Entrega: ${clientData.plant || 'En Sitio / Por Coordinar'}`, 18, 73);

      doc.text(`Correo: ${clientData.email || 'N/A'}`, 110, 63);
      doc.text(`Teléfono: ${clientData.phone || 'N/A'}`, 110, 68);
      doc.text(`Moneda: Dólares de los Estados Unidos (USD)`, 110, 73);

      // Tabla de Ítems Cotizados
      let startY = 84;
      doc.setFillColor(16, 185, 129); // Emerald header
      doc.rect(15, startY, 180, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('CÓDIGO', 18, startY + 5);
      doc.text('DESCRIPCIÓN DEL ÍTEM / SERVICIO', 48, startY + 5);
      doc.text('CANT', 130, startY + 5);
      doc.text('P. UNIT', 145, startY + 5);
      doc.text('TOTAL', 172, startY + 5);

      let currentY = startY + 7;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);

      quoteItems.forEach((item, index) => {
        const rowHeight = 9;
        if (index % 2 === 0) {
          doc.setFillColor(255, 255, 255);
        } else {
          doc.setFillColor(248, 250, 252);
        }
        doc.rect(15, currentY, 180, rowHeight, 'F');
        doc.setDrawColor(241, 245, 249);
        doc.line(15, currentY + rowHeight, 195, currentY + rowHeight);

        doc.setFontSize(7.5);
        doc.text(item.code, 18, currentY + 6);
        
        // Truncar nombre si es muy largo
        const truncatedName = item.name.length > 46 ? item.name.substring(0, 44) + '...' : item.name;
        doc.text(truncatedName, 48, currentY + 6);

        doc.text(`${item.quantity} ${item.unit}`, 130, currentY + 6);
        doc.text(`$${item.unitPrice.toFixed(2)}`, 145, currentY + 6);
        doc.text(`$${(item.unitPrice * item.quantity).toFixed(2)}`, 172, currentY + 6);

        currentY += rowHeight;
      });

      // Bloque de Totales
      currentY += 4;
      doc.setDrawColor(226, 232, 240);
      doc.line(125, currentY, 195, currentY);

      currentY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text('Subtotal:', 130, currentY);
      doc.text(`$${subtotal.toFixed(2)}`, 172, currentY);

      currentY += 5;
      doc.text('IVA (13%):', 130, currentY);
      doc.text(`$${tax.toFixed(2)}`, 172, currentY);

      currentY += 6;
      doc.setFillColor(241, 245, 249);
      doc.rect(125, currentY - 4, 70, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(16, 185, 129);
      doc.text('TOTAL COTIZADO:', 128, currentY + 2);
      doc.text(`$${total.toFixed(2)}`, 170, currentY + 2);

      // Condiciones Comerciales y Garantías
      currentY += 14;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text('TÉRMINOS Y CONDICIONES COMERCIALES:', 15, currentY);

      currentY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('1. Precios expresados en Dólares de los Estados Unidos de América (USD).', 15, currentY);
      currentY += 4;
      doc.text('2. Tiempo de entrega / ejecución: A convenir según cronograma coordinado con el cliente.', 15, currentY);
      currentY += 4;
      doc.text('3. Garantía de fábrica y respaldo técnico oficial EA Service Connect.', 15, currentY);
      currentY += 4;
      doc.text('4. Forma de pago: 50% anticipo al confirmar orden, 50% contra entrega o recepción conforme.', 15, currentY);

      if (clientData.notes) {
        currentY += 6;
        doc.setFont('helvetica', 'bold');
        doc.text('Notas adicionales:', 15, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(clientData.notes.substring(0, 160), 15, currentY + 4);
      }

      // MANDATORY ISO 9001 COMPLIANCE FOOTER
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(203, 213, 225);
        doc.line(15, 280, 195, 280);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`Página ${i} de ${pageCount}`, 15, 285);
        doc.text(`Impreso por: Sistema EA Service Connect - ${new Date().toLocaleString('es-ES')}`, 85, 285);

        // Mandatory rule: Centered and italicized ISO statement
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        doc.text('Documento controlado aplicable a SGC bajo norma ISO 9001:2015 / ISO 9001:2026.', 105, 290, { align: 'center' });
      }

      doc.save(`Cotizacion_${quoteCode}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Error al generar la cotización en PDF.');
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans">
      {/* HEADER CON BOTÓN REGRESAR AL DASHBOARD */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 shrink-0 shadow-xs z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            {/* BOTÓN REGRESAR AL DASHBOARD PRINCIPAL */}
            <BackToDashboardButton
              id="btn-commercial-back"
              onClick={onBack}
              variant="neutral"
            />

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Área Comercial</h1>
                <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Catálogo & Ventas
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Portafolio de Servicios O&M, PVSTOP, Chemitek y Cotizador ISO 9001
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('quote')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                activeTab === 'quote'
                  ? 'bg-amber-500 text-white shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-500'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cotizador</span>
              <span className="bg-amber-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] ml-0.5">
                {quoteItems.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* TABS Y BUSCADOR */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1 max-w-full custom-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
                    activeTab === tab.id
                      ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab !== 'quote' && (
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar en catálogo..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            )}
          </div>

          {/* VISTA TAB: SERVICIOS */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <Wrench className="w-6 h-6 text-blue-200" />
                  <h2 className="text-xl font-bold">Servicios de Operación y Mantenimiento Solar (O&M)</h2>
                </div>
                <p className="text-blue-100 text-sm max-w-2xl">
                  Ofrecemos soluciones técnicas de clase mundial para maximizar el rendimiento energético (PR) y extender la vida útil de sus activos solares fotovoltaicos e industriales.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems(servicesCatalog).map(srv => (
                  <div key={srv.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                            {srv.code}
                          </span>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base mt-1.5">{srv.name}</h3>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white">${srv.price.toLocaleString()}</span>
                          <span className="text-xs text-slate-500 block">/ {srv.unit}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{srv.description}</p>
                      <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-700/60 pt-3 mb-4">
                        {srv.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => addToQuote(srv)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 hover:bg-amber-500 hover:text-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar al Cotizador
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISTA TAB: PVSTOP */}
          {activeTab === 'pvstop' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl p-6 text-white shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-6 h-6 text-red-200" />
                  <h2 className="text-xl font-bold">PVSTOP: Tecnología Patentada de Seguridad Solar</h2>
                </div>
                <p className="text-red-100 text-sm max-w-2xl">
                  Único agente líquido que neutraliza la generación eléctrica de paneles solares actuando como un interruptor de luz químico. Aislamiento dieléctrico comprobado hasta 36kV para bomberos e instaladores.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredItems(pvstopCatalog).map(pvs => (
                  <div key={pvs.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded">
                          {pvs.code}
                        </span>
                        <div className="text-right">
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white">${pvs.price.toLocaleString()}</span>
                          <span className="text-xs text-slate-500 block">/ {pvs.unit}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{pvs.name}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{pvs.description}</p>
                      <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-700/60 pt-3 mb-4">
                        {pvs.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => addToQuote(pvs)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 hover:bg-amber-500 hover:text-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar al Cotizador
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISTA TAB: CHEMITEK */}
          {activeTab === 'chemitek' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-emerald-200" />
                  <h2 className="text-xl font-bold">Chemitek: Químicos de Limpieza y Recubrimientos Solares</h2>
                </div>
                <p className="text-emerald-100 text-sm max-w-2xl">
                  Gama completa certificada por TÜV Sud y avalada por fabricantes Tier 1. Limpieza de alta eficiencia sin desgaste del vidrio antireflectante y recubrimientos antiestáticos de larga duración.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredItems(chemitekCatalog).map(chm => (
                  <div key={chm.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                          {chm.code}
                        </span>
                        <div className="text-right">
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white">${chm.price.toLocaleString()}</span>
                          <span className="text-xs text-slate-500 block">/ {chm.unit}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{chm.name}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{chm.description}</p>
                      <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-700/60 pt-3 mb-4">
                        {chm.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => addToQuote(chm)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 hover:bg-amber-500 hover:text-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar al Cotizador
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISTA TAB: REPUESTOS */}
          {activeTab === 'parts' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-6 text-white shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-6 h-6 text-amber-200" />
                  <h2 className="text-xl font-bold">Repuestos & Componentes Fotovoltaicos</h2>
                </div>
                <p className="text-amber-100 text-sm max-w-2xl">
                  Conectores originales Stäubli MC4, fusibles gPV de alta tensión, descargadores de sobretensión SPD y sensores calibrados para estaciones meteorológicas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems(partsCatalog).map(prt => (
                  <div key={prt.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded">
                          {prt.code}
                        </span>
                        <div className="text-right">
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white">${prt.price.toLocaleString()}</span>
                          <span className="text-xs text-slate-500 block">/ {prt.unit}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{prt.name}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{prt.description}</p>
                      <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-700/60 pt-3 mb-4">
                        {prt.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => addToQuote(prt)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 hover:bg-amber-500 hover:text-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar al Cotizador
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISTA TAB: COTIZADOR RÁPIDO & EXPORTACIÓN ISO 9001 */}
          {activeTab === 'quote' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
              {/* Columna Izquierda: Ítems Seleccionados */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ítems de la Cotización</h3>
                      <p className="text-xs text-slate-500">Gestione las cantidades y servicios a incluir en la propuesta</p>
                    </div>
                    {quoteItems.length > 0 && (
                      <button
                        onClick={() => setQuoteItems([])}
                        className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Vaciar Lista
                      </button>
                    )}
                  </div>

                  {quoteItems.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-600 dark:text-slate-300 font-bold text-sm">El cotizador está vacío</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                        Navegue por las pestañas de Servicios, PVSTOP, Chemitek o Repuestos y presione "Agregar al Cotizador".
                      </p>
                      <button
                        onClick={() => setActiveTab('services')}
                        className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors shadow-xs"
                      >
                        Explorar Catálogo de Servicios
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {quoteItems.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
                          <div className="flex-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                              {item.code}
                            </span>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">{item.name}</h4>
                            <p className="text-xs text-slate-500">${item.unitPrice.toLocaleString()} / {item.unit}</p>
                          </div>

                          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                            <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-xs font-bold text-slate-800 dark:text-slate-100 min-w-[28px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-right min-w-[80px]">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">
                                ${(item.unitPrice * item.quantity).toLocaleString()}
                              </span>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-rose-500 p-1"
                              title="Eliminar ítem"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Columna Derecha: Formulario del Cliente y Resumen */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                    Datos del Cliente
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Nombre del Contacto</label>
                      <input
                        type="text"
                        placeholder="Ej. Ing. Carlos Martínez"
                        value={clientData.name}
                        onChange={e => setClientData({ ...clientData, name: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Empresa / Razón Social</label>
                      <input
                        type="text"
                        placeholder="Ej. Neoen / AES El Salvador"
                        value={clientData.company}
                        onChange={e => setClientData({ ...clientData, company: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Correo Electrónico</label>
                        <input
                          type="email"
                          placeholder="contacto@cliente.com"
                          value={clientData.email}
                          onChange={e => setClientData({ ...clientData, email: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Teléfono</label>
                        <input
                          type="text"
                          placeholder="+503 ..."
                          value={clientData.phone}
                          onChange={e => setClientData({ ...clientData, phone: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Planta Solar / Ubicación</label>
                      <input
                        type="text"
                        placeholder="Ej. Planta Solar El Tránsito 2.5 MWp"
                        value={clientData.plant}
                        onChange={e => setClientData({ ...clientData, plant: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Resumen de Montos */}
                  <div className="border-t border-slate-100 dark:border-slate-700 pt-3 space-y-2">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>Subtotal Estimado:</span>
                      <span className="font-semibold">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>IVA (13%):</span>
                      <span className="font-semibold">${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span>Total Cotización:</span>
                      <span className="text-amber-600 dark:text-amber-400">
                        ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Control ISO 9001 Badge */}
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-800/50">
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                      <strong>Cumplimiento ISO 9001:</strong> El documento generado incluirá código formal <code className="font-mono">FOR-COM-01</code>, control de versiones, paginación estandarizada y cláusula obligatoria de SGC.
                    </p>
                  </div>

                  {/* Botón Descargar Cotización PDF */}
                  <button
                    onClick={generateFormalQuotePDF}
                    disabled={isGeneratingQuote || quoteItems.length === 0}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    {isGeneratingQuote ? 'Generando Documento...' : 'Descargar Cotización Formal (PDF ISO 9001)'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
