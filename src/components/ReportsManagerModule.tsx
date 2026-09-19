import React, { useState } from 'react';
import BackToDashboardButton from './BackToDashboardButton';
import { ArrowLeft, FileText, Download, CheckCircle, Search, Filter, Sparkles, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import localforage from 'localforage';
import { useEffect } from 'react';

interface ReportsManagerModuleProps {
  onBack: () => void;
  currentUser?: string;
}

export default function ReportsManagerModule({ onBack, currentUser = 'Administrador' }: ReportsManagerModuleProps) {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [activeReport, setActiveReport] = useState<any>(null);
  const [aiSummary, setAiSummary] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);

  const [mockReports, setMockReports] = useState<any[]>([
    { id: 'REP-2026-001', date: '2026-09-15', plant: 'Planta Solar Capella', type: 'Limpieza Robotizada', notes: 'Se completó la limpieza de 1500 módulos. Presencia de polvo moderada, sin daños reportados. Se usó 1000 galones de agua.' },
    { id: 'REP-2026-002', date: '2026-09-16', plant: 'Central Térmica Nejapa', type: 'Mantenimiento Correctivo', notes: 'Se reemplazó la válvula de presión en el bloque 2. Se realizaron pruebas de fuga satisfactorias.' }
  ]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const history = await localforage.getItem('fsm_report_history');
        if (history && Array.isArray(history) && history.length > 0) {
          const mapped = history.map((h: any) => ({
            id: h.id,
            date: new Date(h.date).toLocaleDateString(),
            plant: h.clientName,
            type: h.serviceName,
            notes: h.notes || 'Sin observaciones.',
            parameters: h.parameters || [],
            photos: h.photos || [],
            signatureSupervisor: h.signatureSupervisor || '',
            signatureClient: h.signatureClient || '',
            aiSummary: h.aiSummary || ''
          }));
          setMockReports(mapped);
        }
      } catch (err) {
        console.error("Error loading reports from localforage:", err);
      }
    };
    loadReports();
  }, []);

  const handleGenerateAI = async (report: any) => {
    setActiveReport(report);
    setShowAIModal(true);
    setIsGeneratingAI(true);
    setAiSummary('');

    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceCategory: report.type,
          serviceType: report.type,
          notes: report.notes
        }),
      });
      const data = await response.json();
      setAiSummary(data.summary || 'No se pudo generar el resumen.');
    } catch (err) {
      console.error(err);
      setAiSummary('Error al conectar con la inteligencia artificial.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateISOPDF = () => {
    if (!activeReport) return;
    
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // --- ISO HEADER ---
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.rect(10, 10, pageWidth - 20, 25);
    
    // Box divisions
    doc.line(60, 10, 60, 35); // V line 1
    doc.line(140, 10, 140, 35); // V line 2
    doc.line(140, 18, pageWidth - 10, 18); // H line 1 in right box
    doc.line(140, 26, pageWidth - 10, 26); // H line 2 in right box

    // Logo / Company Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("EA SERVICE", 35, 23, { align: 'center' });
    
    // Title
    doc.setFontSize(12);
    doc.text("REPORTE EJECUTIVO", 100, 21, { align: 'center' });
    doc.text("DE OPERACIONES", 100, 27, { align: 'center' });

    // Metadata
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("CÓDIGO:", 142, 15);
    doc.setFont("helvetica", "normal");
    doc.text("FOR-OPE-02", 165, 15);
    
    doc.setFont("helvetica", "bold");
    doc.text("VERSIÓN:", 142, 23);
    doc.setFont("helvetica", "normal");
    doc.text("01", 165, 23);
    
    doc.setFont("helvetica", "bold");
    doc.text("FECHA:", 142, 32);
    doc.setFont("helvetica", "normal");
    const currentDate = new Date().toLocaleDateString();
    doc.text(currentDate, 165, 32);

    // --- CONTENT ---
    let y = 45;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL REPORTE", 10, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.text("ID Reporte:", 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(activeReport.id, 40, y);
    y += 6;
    
    doc.setFont("helvetica", "bold");
    doc.text("Fecha Op.:", 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(activeReport.date, 40, y);
    y += 6;

    doc.setFont("helvetica", "bold");
    doc.text("Planta/Sitio:", 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(activeReport.plant, 40, y);
    y += 6;

    doc.setFont("helvetica", "bold");
    doc.text("Servicio:", 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(activeReport.type, 40, y);
    y += 12;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("RESUMEN EJECUTIVO", 10, y);
    y += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const lines = doc.splitTextToSize(aiSummary, pageWidth - 20);
    doc.text(lines, 10, y);
    
    y += (lines.length * 5) + 15;
    
    // Notes block
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVACIONES ORIGINALES DEL TÉCNICO", 10, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const noteLines = doc.splitTextToSize(activeReport.notes, pageWidth - 20);
    doc.text(noteLines, 10, y);
    doc.setTextColor(0, 0, 0);
    y += (noteLines.length * 5) + 10;
    
    // Add page if needed
    const checkPage = (addedHeight: number) => {
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
        
        activeReport.parameters.forEach((param: any) => {
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
        
        activeReport.photos.forEach((photo: any) => {
           if (pX + imgSize > pageWidth - 10) {
               pX = 10;
               y += imgSize + 15;
               checkPage(imgSize + 20);
           }
           try {
               // Must be JPEG or PNG depending on src, mostly dataURLs include prefix
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
        
        // Impreso por
        const timestamp = new Date().toLocaleString();
        doc.text(`Impreso por: ${currentUser} - ${timestamp}`, 10, footerY);
        
        // Paginación
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 30, footerY);
        
        // Mandatory Statement
        doc.setFont("helvetica", "italic");
        doc.text("Documento controlado aplicable a SGC bajo norma ISO 9001:2015 / ISO 9001:2026.", pageWidth / 2, footerY + 5, { align: "center" });
    }

    doc.save(`Resumen_Ejecutivo_${activeReport.id}.pdf`);
    
    // Save modified report back to history
    localforage.getItem('fsm_report_history').then(history => {
        if (history && Array.isArray(history)) {
             const updatedHistory = history.map(r => r.id === activeReport.id ? activeReport : r);
             localforage.setItem('fsm_report_history', updatedHistory);
        }
    });

    setShowAIModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
      <header className="bg-sky-700 border-b border-sky-800 sticky top-0 z-20 shadow-md px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <BackToDashboardButton 
            id="btn-reports-back"
            onClick={onBack}
            variant="glass"
          />
          <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
          <h1 className="font-bold text-lg sm:text-xl text-white flex-1 truncate">Gestor de Reportes y Auditoría</h1>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Reportes de Campo Listos para Análisis</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Revisa los datos del técnico y genera el Reporte Ejecutivo bajo estándar ISO 9001.</p>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Buscar reporte..." className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <button className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockReports.map(report => (
            <div key={report.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-sky-100 text-sky-700 p-2 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                  Completado
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{report.type}</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{report.plant}</p>
              
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 border-b border-slate-100 dark:border-slate-700/50 pb-4">
                <span>ID: {report.id}</span>
                <span>{report.date}</span>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 italic">
                "{report.notes}"
              </div>
              
              <button
                onClick={() => { setActiveReport(report); setAiSummary(""); setShowAIModal(true); setIsGeneratingAI(false); }}
                className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-auto bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              >
                <FileText className="w-5 h-5" />
                Reporte Ejecutivo
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between bg-indigo-50/50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-indigo-900 text-lg">Resumen Ejecutivo</h3>
              </div>
              <button onClick={() => setShowAIModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="mb-6 flex gap-4 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div>
                  <span className="block font-bold text-slate-800 dark:text-slate-100 text-xs uppercase mb-1">Reporte ID</span>
                  {activeReport?.id}
                </div>
                <div>
                  <span className="block font-bold text-slate-800 dark:text-slate-100 text-xs uppercase mb-1">Servicio</span>
                  {activeReport?.type}
                </div>
                <div>
                  <span className="block font-bold text-slate-800 dark:text-slate-100 text-xs uppercase mb-1">Planta</span>
                  {activeReport?.plant}
                </div>
              </div>

              {!isGeneratingAI && !aiSummary && (
                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Notas originales del técnico (Editables antes de generar)</label>
                  <textarea 
                    value={activeReport?.notes || ''} 
                    onChange={(e) => setActiveReport({...activeReport, notes: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none resize-y min-h-[100px]"
                  ></textarea>

                  {/* Rendering parameters */}
                  {activeReport?.parameters && activeReport.parameters.length > 0 && (
                    <div className="mt-6 mb-4">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Parámetros Técnicos (Editables)</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {activeReport.parameters.map((param: any, idx: number) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-700 rounded">
                               <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 line-clamp-1" title={param.label}>{param.label}</label>
                               <input type="text" value={param.value} onChange={(e) => {
                                  const newParams = [...activeReport.parameters];
                                  newParams[idx].value = e.target.value;
                                  setActiveReport({...activeReport, parameters: newParams});
                               }} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm outline-none focus:border-indigo-500" />
                            </div>
                         ))}
                      </div>
                    </div>
                  )}

                  {/* Rendering Photos */}
                  {activeReport?.photos && activeReport.photos.length > 0 && (
                    <div className="mt-6 mb-4">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Registro Fotográfico</label>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {activeReport.photos.map((p: any, idx: number) => (
                           <div key={idx} className="shrink-0 relative w-24 h-24 rounded border border-slate-200 dark:border-slate-700 overflow-hidden">
                              <img src={p.src} alt="Evidencia" className="w-full h-full object-cover" />
                              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] text-center p-0.5 truncate">{p.label}</div>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rendering Signatures Preview */}
                  <div className="mt-6 mb-4 grid grid-cols-2 gap-4">
                     {activeReport?.signatureSupervisor && (
                         <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Firma Supervisor</label>
                            <img src={activeReport.signatureSupervisor} alt="Supervisor" className="h-12 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-2" />
                         </div>
                     )}
                     {activeReport?.signatureClient && (
                         <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Firma Cliente</label>
                            <img src={activeReport.signatureClient} alt="Cliente" className="h-12 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-2" />
                         </div>
                     )}
                  </div>

                  <button
                    onClick={() => handleGenerateAI(activeReport)}
                    className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700"
                  >
                    Generar Reporte Ejecutivo
                  </button>
                </div>
              )}
              {isGeneratingAI ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 relative mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                  </div>
                  <p className="text-indigo-900 font-medium">Consolidando información y generando reporte...</p>
                </div>
              ) : (
                aiSummary && (
                <div className="space-y-4">
                  <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
                    <span className="text-xs font-bold text-indigo-500 mb-2 block">REPORTE EJECUTIVO (EDITABLE)</span>
                    <textarea value={aiSummary} onChange={(e) => setAiSummary(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-indigo-200 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none resize-y min-h-[120px]"></textarea>
                  </div>
                </div>
                )
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
              <button 
                onClick={() => setShowAIModal(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={generateISOPDF}
                disabled={isGeneratingAI || !aiSummary}
                className="px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Download className="w-5 h-5" />
                Descargar PDF (Formato ISO)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
