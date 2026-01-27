import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ReportData } from "./reportGenerator";

export const generatePDF = (data: ReportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  // --- CORPORATE HEADER ---
  const drawHeader = () => {
    // ASPY Blue Background
    const aspyBlue = [0, 102, 204]; // #0066CC

    // Top Blue Block
    doc.setFillColor(aspyBlue[0], aspyBlue[1], aspyBlue[2]);
    doc.rect(0, 0, pageWidth, 40, "F");

    // "ASPY - DIRECCIÓN TÉCNICA" (Bold, White, Centered)
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("ASPY - DIRECCIÓN TÉCNICA", pageWidth / 2, 18, {
      align: "center",
    });

    // Subheader
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Informe de Caracterización Básica", pageWidth / 2, 28, {
      align: "center",
    });

    // Regulations
    doc.setFontSize(10);
    doc.text("Según UNE-EN 689:2019 y RD 665/1997", pageWidth / 2, 35, {
      align: "center",
    });

    // doc.setY(55); // Removed to fix TS error, y is set manually below
  };

  drawHeader();

  let y = 50;

  // --- SECTION 1: IDENTIFICATION ---
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Black
  doc.setFont("helvetica", "bold");
  doc.text("1. Identificación y Toxicología (Datos Oficiales)", margin, y);

  // CMR Label next to title (Red)
  if (data.agent.cmr_alerts.length > 0) {
    doc.setTextColor(220, 38, 38); // Red
    const cmrText = "& " + data.agent.cmr_alerts.join(" & ");
    doc.setFontSize(10);
    doc.text(cmrText, margin, y + 6);
  }
  y += 12;

  // Table Data
  const tableBody = [
    ["Agente Químico", data.agent.name],
    ["Nº CAS", data.agent.cas],
    [
      "VLA-ED (Diario)",
      data.agent.vla_ed !== "No est."
        ? `${data.agent.vla_ed} mg/m³`
        : "No establecido",
    ],
    [
      "VLA-EC (Corto Plazo)",
      data.agent.vla_ec !== "No est."
        ? `${data.agent.vla_ec} mg/m³`
        : "No establecido",
    ],
  ];

  if (data.agent.density) tableBody.push(["Densidad", data.agent.density]);
  if (data.agent.boiling_point)
    tableBody.push(["Punto de Ebullición", data.agent.boiling_point]);

  autoTable(doc, {
    startY: y,
    head: [],
    body: tableBody,
    theme: "plain", // We want custom borders
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineColor: [200, 200, 200], // Light grey borders
      lineWidth: 0.1,
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
        fillColor: [245, 247, 250],
        cellWidth: 60,
        textColor: 50,
      }, // Light grey bg for labels
      1: { cellWidth: "auto" },
    },
  });

  // @ts-expect-error - jspdf-autotable types
  y = doc.lastAutoTable.finalY + 10;

  // Skin/Sensitizer Alerts
  if (data.agent.notes_alerts.length > 0) {
    doc.setFontSize(10);
    // Loop through alerts. Red for Piel/Sens.
    data.agent.notes_alerts.forEach((alert) => {
      // Parse alert type for coloring (simple heuristic)
      if (alert.includes("Piel") || alert.includes("Sensibilizante")) {
        doc.setTextColor(185, 28, 28); // Red
      } else {
        doc.setTextColor(0);
      }

      doc.setFont("helvetica", "bold");
      const splitText = doc.splitTextToSize(alert, pageWidth - margin * 2);
      doc.text(splitText, margin, y);
      y += splitText.length * 5 + 3;
    });
    y += 5;
  }

  // --- SECTION 2: EXPOSURE ---
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 100); // Dark Blue for headers maybe? Or Black as per template. Let's stick to Black/Dark Grey.
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("2. Descripción de la Exposición", margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  // Clean empty lines in narrative
  const narrative = data.exposure.description.replace(/\n\n+/g, "\n");
  const lines = narrative.split("\n");

  lines.forEach((line) => {
    const splitLine = doc.splitTextToSize("• " + line, pageWidth - margin * 2);
    doc.text(splitLine, margin, y);
    y += splitLine.length * 5 + 2;
  });

  y += 10;

  // --- SECTION 3: STRATEGY ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("3. Valoración Higiénica y Estrategia", margin, y);
  y += 8;

  // Strategy Box
  const isSafe = data.conclusion.type === "A";

  // Colors
  const bgColor = isSafe ? [240, 253, 244] : [254, 242, 242]; // Light Green vs Light Red
  const borderColor = isSafe ? [22, 163, 74] : [220, 38, 38]; // Green vs Red text

  // Draw Box
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
  doc.rect(margin, y, pageWidth - margin * 2, 45, "FD"); // Increased height

  // Title inside box
  doc.setTextColor(0); // Black (or could use borderColor)
  doc.setFont("helvetica", "bold");
  doc.text(
    isSafe
      ? "ESCENARIO A: RIESGO ACEPTABLE"
      : "ESCENARIO B: RIESGO NO DESCARTABLE",
    margin + 5,
    y + 10,
  );

  // Conclusion Text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const conclusionLines = doc.splitTextToSize(
    data.conclusion.text,
    pageWidth - margin * 2 - 10,
  );
  doc.text(conclusionLines, margin + 5, y + 20);

  y += 55;

  // --- SECTION 4: LEGAL ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text("4. Medidas y Obligaciones Legales (RD 665/1997)", margin, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  data.conclusion.legal_obligations.forEach((obi) => {
    const splitObi = doc.splitTextToSize("• " + obi, pageWidth - margin * 2);
    doc.text(splitObi, margin, y);
    y += splitObi.length * 5 + 2;
  });

  // --- FOOTER ---
  const pageCount = (
    doc as unknown as { internal: { getNumberOfPages: () => number } }
  ).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Generado el ${data.meta.date} - Versión ${data.meta.version}`,
      margin,
      pageHeight - 10,
    );
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth - margin - 20,
      pageHeight - 10,
    );
  }

  doc.save(
    `Evaluacion_${data.agent.name.replace(/\s+/g, "_")}_${data.meta.date}.pdf`,
  );
};
