import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ReportData } from "./reportGenerator";

export const generatePDF = (data: ReportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  // Header Logic
  const drawHeader = () => {
    // Logo Placeholder (Gray Box if no image)
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, 10, 40, 15, "F");
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("LOGO EMPRESA", margin + 5, 20);

    // Title
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102); // Primary Blue
    doc.setFont("helvetica", "bold");
    doc.text("INFORME DE CARACTERIZACIÓN BÁSICA", pageWidth / 2, 20, {
      align: "center",
    });
    doc.setFontSize(10);
    doc.text("Según UNE-EN 689:2019 y RD 665/1997", pageWidth / 2, 26, {
      align: "center",
    });

    // Line
    doc.setDrawColor(0, 155, 219);
    doc.setLineWidth(1);
    doc.line(margin, 30, pageWidth - margin, 30);
  };

  drawHeader();

  let y = 40;

  // 1. Identificación y Toxicología
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("1. Identificación y Toxicología (Datos Oficiales)", margin, y);
  y += 5;

  // CMR Alerts Rendering
  if (data.agent.cmr_alerts.length > 0) {
    doc.setFontSize(10);
    doc.setTextColor(220, 38, 38); // Red
    data.agent.cmr_alerts.forEach((alert) => {
        doc.text(`⚠ ${alert}`, margin, y);
        y += 5;
    });
    y += 2;
  }

  const tableBody = [
    ["Agente Químico", data.agent.name],
    ["Nº CAS", data.agent.cas],
    ["VLA-ED (Diario)", data.agent.vla_ed],
    ["VLA-EC (Corto Plazo)", data.agent.vla_ec],
  ];

  autoTable(doc, {
    startY: y,
    head: [],
    body: tableBody,
    theme: "grid",
    columnStyles: {
        0: { fontStyle: "bold", fillColor: [240, 248, 255], cellWidth: 50 },
    },
    styles: { fontSize: 10, cellPadding: 3 },
  });

  // @ts-ignore
  y = doc.lastAutoTable.finalY + 10;

  // Alerts for Notes (Piel, Sen)
  if (data.agent.notes_alerts.length > 0) {
    doc.setFontSize(10);
    doc.setTextColor(185, 28, 28); // Dark Red
    doc.setFont("helvetica", "bold");
    data.agent.notes_alerts.forEach((alert) => {
        const splitText = doc.splitTextToSize(alert, pageWidth - (margin * 2));
        doc.text(splitText, margin, y);
        y += (splitText.length * 5) + 2;
    });
    y += 5;
  }

  // 2. Descripción de la Exposición
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("2. Descripción de la Exposición", margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const splitNarrative = doc.splitTextToSize(data.exposure.description, pageWidth - (margin * 2));
  doc.text(splitNarrative, margin, y);
  y += (splitNarrative.length * 5) + 10;

  // 3. Valoración Higiénica y Estrategia
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("3. Valoración Higiénica y Estrategia", margin, y);
  y += 8;

  // Box for conclusion
  const boxColor = data.conclusion.type === 'A' ? [220, 252, 231] : [254, 226, 226]; // Green-100 vs Red-100
  const borderColor = data.conclusion.type === 'A' ? [22, 163, 74] : [220, 38, 38];

  doc.setFillColor(boxColor[0], boxColor[1], boxColor[2]);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.rect(margin, y, pageWidth - (margin * 2), 35, "FD");

  doc.setFontSize(10);
  doc.setTextColor(0);
  // Type Label
  doc.setFont("helvetica", "bold");
  doc.text(data.conclusion.type === 'A' ? "ESCENARIO A: CONTROLADO" : "ESCENARIO B: RIESGO NO DESCARTABLE", margin + 5, y + 8);

  // Text
  doc.setFont("helvetica", "normal");
  const splitConclusion = doc.splitTextToSize(data.conclusion.text, pageWidth - (margin * 2) - 10);
  doc.text(splitConclusion, margin + 5, y + 16);

  y += 45;

  // 4. Obligaciones Legales
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("4. Medidas y Obligaciones Legales (RD 665/1997)", margin, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  data.conclusion.legal_obligations.forEach((obi) => {
    const splitObi = doc.splitTextToSize(`• ${obi}`, pageWidth - (margin * 2));
    doc.text(splitObi, margin, y);
    y += (splitObi.length * 5) + 2;
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Generado el ${data.meta.date} - ${data.meta.version}`, margin, pageHeight - 10);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin - 20, pageHeight - 10);
  }

  doc.save(`Evaluacion_${data.agent.name.replace(/\s+/g, '_')}_${data.meta.date}.pdf`);
};
