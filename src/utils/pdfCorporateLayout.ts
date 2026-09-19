import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { getLogoBase64, svgEAConsulting, svgChemitek, svgPvstop } from './logos';

export const TOTAL_PAGES_EXP = "{total_pages_count_string}";

export interface CorporateLogos {
  ea: string;
  chem: string;
  pv: string;
}

export const loadCorporateLogos = async (): Promise<CorporateLogos> => {
  return {
    ea: await getLogoBase64(svgEAConsulting) || '',
    chem: await getLogoBase64(svgChemitek) || '',
    pv: await getLogoBase64(svgPvstop) || ''
  };
};

export const drawCorporateHeader = (doc: jsPDF, title: string, code: string, logos: CorporateLogos, version: string = "001") => {
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(15, 10, 180, 25);
  doc.line(75, 10, 75, 35); // Vertical line after logos
  doc.line(145, 10, 145, 35); // Vertical line before ISO box

  // Logos (Left)
  try {
    if (logos.ea) doc.addImage(logos.ea, 'PNG', 18, 16.5, 54, 12);
  } catch (e) {
    console.error("Error drawing logos", e);
  }

  // Title (Center)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0);
  const splitTitle = doc.splitTextToSize(title, 65);
  // Center in the middle block (75 to 145 = width 70, center at 110)
  
  // Calculate vertical centering for multiline title
  const titleHeight = splitTitle.length * 4; 
  const startY = 22.5 - (titleHeight / 2) + 2; 
  doc.text(splitTitle, 110, startY, { align: 'center' });

  // ISO Box (Right)
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.line(145, 18, 195, 18);
  doc.line(145, 26, 195, 26);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("CÓDIGO:", 147, 15);
  doc.setFont("helvetica", "normal");
  doc.text(code, 193, 15, { align: 'right' });

  doc.setFont("helvetica", "bold");
  doc.text("VERSIÓN:", 147, 23);
  doc.setFont("helvetica", "normal");
  doc.text(version || "001", 193, 23, { align: 'right' });

  const dateStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  doc.setFont("helvetica", "bold");
  doc.text("FECHA:", 147, 31);
  doc.setFont("helvetica", "normal");
  doc.text(dateStr, 193, 31, { align: 'right' });
  
  return 45; // Suggested Y start for content
};

export const drawCorporateFooter = (doc: jsPDF, pageNum: number, logos?: CorporateLogos) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerStartY = pageHeight - 28;
  
  doc.setDrawColor(150);
  doc.setLineWidth(0.2);
  doc.line(15, footerStartY, 195, footerStartY);

  try {
    if (logos?.chem && logos.chem.length > 50) {
      doc.addImage(logos.chem, 'PNG', 15, footerStartY + 2, 26, 5.5);
    }
    if (logos?.pv && logos.pv.length > 50) {
      doc.addImage(logos.pv, 'PNG', 172, footerStartY + 1, 23, 7.8);
    }
  } catch (e) {
    console.error("Error drawing footer logos", e);
  }

  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(80);
  doc.text("Documento controlado aplicable a SGC bajo norma ISO 9001:2015 / ISO 9001:2026.", 105, footerStartY + 11, { align: 'center' });
  
  doc.setFont("helvetica", "normal");
  doc.text(`Impreso por: Sistema Integrado EA - ${new Date().toLocaleString('es-ES')}`, 15, pageHeight - 10);
  
  doc.setFont("helvetica", "bold");
  doc.text(`Página ${pageNum} de ${TOTAL_PAGES_EXP}`, 195, pageHeight - 10, { align: 'right' });
};

export const applyCorporateStyles = (doc: jsPDF) => {
  doc.setFont("helvetica");
};

export const addDocumentControlTable = (doc: jsPDF, finalY: number, elaborador: string = "") => {
  let yPos = finalY + 10;
  if (yPos > doc.internal.pageSize.getHeight() - 85) {
    doc.addPage();
    yPos = 45; 
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text("Control de Documentos (ISO 9001:2015 / ISO 9001:2026)", 15, yPos);
  yPos += 3;

  autoTable(doc, {
    startY: yPos,
    head: [['Acción', 'Nombre', 'Cargo', 'Fecha', 'Firma']],
    body: [
      ['Elaboró', elaborador, 'Técnico / Operador', new Date().toLocaleDateString('es-ES'), ''],
      ['Revisó', '', 'Coordinador / Supervisor', '', ''],
      ['Aprobó', '', 'Gerencia / Dirección', '', '']
    ],
    theme: 'grid',
    headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold', halign: 'center', font: 'helvetica' },
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 4, minCellHeight: 12, valign: 'middle' },
    margin: { left: 15, right: 15 }
  });
};
