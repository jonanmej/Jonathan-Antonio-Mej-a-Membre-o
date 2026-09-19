export interface Plant {
  id: string;
  name: string;
  client: string;
  type: string;
  capacity: string;
  contractExp: string;
  status: 'optimo' | 'mantenimiento' | 'alerta' | 'active';
  lastService: string;
  coords: { lat: number, lng: number };
  address?: string;
  contacts?: { name: string, role: string, initials: string }[];
}

export const plants: Plant[] = [
  {
    id: 'SOL-001',
    name: 'Planta Solar Capella',
    client: 'Neoen',
    type: 'Fotovoltaica',
    capacity: '140 MW',
    contractExp: 'Nov 2030',
    status: 'optimo',
    lastService: 'Hace 2 semanas',
    coords: { lat: 13.3134, lng: -88.4410 } // Usulután
  },
  {
    id: 'HFO-042',
    name: 'Central Térmica Nejapa',
    client: 'Nejapa Power S.A.',
    type: 'Motor HFO',
    capacity: '144 MW',
    contractExp: 'Ene 2028',
    status: 'mantenimiento',
    lastService: 'En curso',
    coords: { lat: 13.8055, lng: -89.2319 } // Nejapa
  },
  {
    id: 'SOL-088',
    name: 'Planta Solar Bósforo',
    client: 'AES El Salvador',
    type: 'Fotovoltaica',
    capacity: '100 MW',
    contractExp: 'En Revisión (Vencido)',
    status: 'alerta',
    lastService: 'Hace 8 meses',
    coords: { lat: 13.5937, lng: -88.1979 } // San Miguel
  },
  {
    id: 'SOL-089',
    name: 'Parque Solar Opico',
    client: 'DELSUR',
    type: 'Fotovoltaica',
    capacity: '35 MW',
    contractExp: 'Jul 2035',
    status: 'optimo',
    lastService: 'Hace 1 mes',
    coords: { lat: 13.8821, lng: -89.3562 } // San Juan Opico
  },
  {
    id: 'HFO-043',
    name: 'Central Acajutla',
    client: 'CECEL',
    type: 'Motor HFO',
    capacity: '90 MW',
    contractExp: 'Dic 2025',
    status: 'mantenimiento',
    lastService: 'Hace 3 días',
    coords: { lat: 13.5878, lng: -89.8353 } // Acajutla
  }
];

export const SERVICE_CATEGORIES: Record<string, { name: string, services: { id: string, name: string, subTypes?: string[] }[] }> = {
  fotovoltaico: {
    name: "1. Fotovoltaico",
    services: [
      { id: "fv_inst", name: "Instalación" },
      { id: "fv_limp_rob", name: "Limpieza de módulos con robot" },
      { id: "fv_prev", name: "Mantenimiento Preventivo", subTypes: ["Menor", "Medio", "Mayor"] },
      { id: "fv_corr", name: "Mantenimiento correctivo" },
      { id: "fv_desm", name: "Desmantelamiento" },
      { id: "fv_reinst", name: "Reinstalación" },
      { id: "fv_drone", name: "Servicio técnico de drone" },
      { id: "fv_transf", name: "Mantenimiento de transformador eléctrico" },
      { id: "fv_iv_el", name: "Curvas I-V y Electroluminiscencia (EL)" },
      { id: "fv_trackers", name: "Mantenimiento de Seguidores (Trackers)" }
    ]
  },
  hfo: {
    name: "2. Motores HFO",
    services: [
      { id: "hfo_corr", name: "Mantenimientos correctivos" },
      { id: "hfo_vibration", name: "Boroscopía y Análisis de Vibraciones" },
      { id: "hfo_oil", name: "Análisis de Aceites y Tribología" }
    ]
  },
  gps: {
    name: "3. GPS",
    services: [
      { id: "gps_inst", name: "Instalación" },
      { id: "gps_reinst", name: "Reinstalación" },
      { id: "gps_retir", name: "Retiro" },
      { id: "gps_rep", name: "Reparación" },
      { id: "gps_visita", name: "Visita Técnica" }
    ]
  },
  pvstop: {
    name: "4. PVSTOP",
    services: [
      { id: "pvs_cap", name: "Capacitaciones sobre el producto" }
    ]
  },
  chemitek: {
    name: "5. Chemitek Solar",
    services: [
      { id: "chk_limp", name: "Limpieza de instalaciones fotovoltaicas con productos Chemitek solar" }
    ]
  },
  visitas: {
    name: "Visitas Técnicas",
    services: [
      { id: "vis_fallas", name: "Fallas en equipos e instalaciones" },
      { id: "vis_emerg", name: "Emergencias" },
      { id: "vis_insp", name: "Inspección previas a trabajos" }
    ]
  }
};

export interface ServiceOrder {
  id: string;
  code: string;
  clientId: string;
  clientName: string;
  plantId: string;
  plantName: string;
  plantType?: string;
  plantCapacity?: string;
  plantAddress?: string;
  plantCoords?: { lat: number; lng: number };
  categoryKey: string;
  categoryName: string;
  serviceId: string;
  serviceName: string;
  serviceSubType?: string;
  startDate: string;
  durationDays: number;
  endDate: string;
  priority: 'baja' | 'media' | 'alta' | 'urgente';
  status: 'programada' | 'en_progreso' | 'completada' | 'cancelada';
  assignedTeam?: string;
  notes?: string;
  createdAt: string;
  createdBy?: string;
}

export const initialServiceOrders: ServiceOrder[] = [
  {
    id: 'ord_capella_01',
    code: 'OT-2026-0104',
    clientId: 'client_neoen',
    clientName: 'Neoen',
    plantId: 'SOL-001',
    plantName: 'Planta Solar Capella',
    plantType: 'Fotovoltaica',
    plantCapacity: '140 MW',
    plantAddress: 'Usulután, El Salvador',
    plantCoords: { lat: 13.3134, lng: -88.4410 },
    categoryKey: 'fotovoltaico',
    categoryName: '1. Fotovoltaico',
    serviceId: 'fv_prev',
    serviceName: 'Mantenimiento Preventivo',
    serviceSubType: 'Medio',
    startDate: '2026-09-21',
    durationDays: 4,
    endDate: '2026-09-24',
    priority: 'alta',
    status: 'programada',
    assignedTeam: 'Cuadrilla Solar Alfa',
    notes: 'Revisión periódica contractual de inversores centrales y cajas de string.',
    createdAt: '2026-09-18T10:00:00Z',
    createdBy: 'Ing. Planificador'
  },
  {
    id: 'ord_bosforo_01',
    code: 'OT-2026-0108',
    clientId: 'client_aes',
    clientName: 'AES El Salvador',
    plantId: 'SOL-088',
    plantName: 'Planta Solar Bósforo',
    plantType: 'Fotovoltaica',
    plantCapacity: '100 MW',
    plantAddress: 'San Miguel, El Salvador',
    plantCoords: { lat: 13.5937, lng: -88.1979 },
    categoryKey: 'chemitek',
    categoryName: '5. Chemitek Solar',
    serviceId: 'chk_limp',
    serviceName: 'Limpieza de instalaciones fotovoltaicas con productos Chemitek solar',
    startDate: '2026-09-25',
    durationDays: 3,
    endDate: '2026-09-27',
    priority: 'media',
    status: 'programada',
    assignedTeam: 'Equipo Chemitek 1',
    notes: 'Aplicación de recubrimiento antiestático y limpieza intensiva con agua desmineralizada.',
    createdAt: '2026-09-18T11:30:00Z',
    createdBy: 'Supervisor FSM'
  }
];
