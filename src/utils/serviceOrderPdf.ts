import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ServiceOrder } from '../data';
import { TOTAL_PAGES_EXP, loadCorporateLogos, drawCorporateHeader, drawCorporateFooter } from './pdfCorporateLayout';

export const generateServiceOrderPDF = async (order: ServiceOrder) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const logos = await loadCorporateLogos();

  const title = `ORDEN DE TRABAJO Y PROGRAMACIÓN DE SERVICIO - ${order.code}`;
  const code = 'FOR-FSM-02';
  const version = '01';

  let yPos = drawCorporateHeader(doc, title, code, logos, version);
  yPos += 4;

  // Overview Table
  autoTable(doc, {
    startY: yPos,
    head: [['DATOS GENERALES DE LA PLANTA Y CLIENTE', 'INFORMACIÓN']],
    body: [
      ['Cliente Contratante', order.clientName || 'N/A'],
      ['Planta / Instalación', order.plantName || 'N/A'],
      ['Tipo de Instalación', order.plantType || 'Fotovoltaica'],
      ['Capacidad Nominal', order.plantCapacity || 'N/A'],
      ['Dirección / Ubicación', order.plantAddress || 'Registrada en sistema'],
      ['Coordenadas GPS', order.plantCoords ? `${order.plantCoords.lat.toFixed(4)}, ${order.plantCoords.lng.toFixed(4)}` : 'N/A'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], textColor: 255, fontSize: 8.5, font: 'helvetica' },
    styles: { fontSize: 8, font: 'helvetica' },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 65, fillColor: [248, 250, 252] },
      1: { cellWidth: 115 }
    },
    margin: { left: 15, right: 15, top: 40, bottom: 35 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 6;

  // Program details table
  autoTable(doc, {
    startY: yPos,
    head: [['PROGRAMACIÓN OPERATIVA DEL SERVICIO', 'DETALLES TÉCNICOS']],
    body: [
      ['Código de Orden de Trabajo (OT)', order.code],
      ['Categoría de Servicio', order.categoryName],
      ['Servicio Específico a Brindar', order.serviceName],
      ['Subtipo / Alcance Específico', order.serviceSubType || 'Estándar contractual'],
      ['Fecha de Inicio de Programación', order.startDate],
      ['Duración Programada', `${order.durationDays} día(s) de trabajo`],
      ['Fecha Estimada de Finalización', order.endDate],
      ['Nivel de Prioridad', order.priority ? order.priority.toUpperCase() : 'NORMAL'],
      ['Estado Operativo', order.status ? order.status.toUpperCase() : 'PROGRAMADA'],
      ['Cuadrilla / Técnico Asignado', order.assignedTeam || 'Pendiente de asignación'],
      ['Observaciones e Instrucciones', order.notes || 'Trabajo programado conforme a especificaciones contractuales y normas de seguridad industrial vigentes.']
    ],
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 8.5, font: 'helvetica' },
    styles: { fontSize: 8, font: 'helvetica' },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 65, fillColor: [248, 250, 252] },
      1: { cellWidth: 115 }
    },
    margin: { left: 15, right: 15, top: 40, bottom: 35 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 12;

  // Signatures Section
  if (yPos > 230) {
    doc.addPage();
    yPos = 45;
  }

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('VALIDACIÓN Y APROBACIÓN DE PROGRAMACIÓN', 15, yPos);
  yPos += 14;

  const colWidth = 75;
  const col1X = 20;
  const col2X = 115;

  // Signature lines
  doc.setDrawColor(160, 160, 160);
  doc.setLineWidth(0.4);
  doc.line(col1X, yPos + 15, col1X + colWidth, yPos + 15);
  doc.line(col2X, yPos + 15, col2X + colWidth, yPos + 15);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Supervisor de Operaciones / Planificador', col1X + (colWidth / 2), yPos + 20, { align: 'center' });
  doc.text('Recepción Cliente / Responsable Planta', col2X + (colWidth / 2), yPos + 20, { align: 'center' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('EA Service Connect - Operaciones FSM', col1X + (colWidth / 2), yPos + 24, { align: 'center' });
  doc.text(order.clientName, col2X + (colWidth / 2), yPos + 24, { align: 'center' });

  // Footers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawCorporateHeader(doc, title, code, logos, version);
    drawCorporateFooter(doc, i, logos);
  }

  if (typeof doc.putTotalPages === 'function') {
    doc.putTotalPages(TOTAL_PAGES_EXP);
  }

  const safeFileName = `Orden_Trabajo_${order.code}_${order.plantName.replace(/\s+/g, '_')}.pdf`;
  doc.save(safeFileName);
};
