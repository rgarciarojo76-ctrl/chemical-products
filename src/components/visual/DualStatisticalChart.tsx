import React, { useMemo } from "react";
import {
  normInv,
  logNormPDF,
  getPlottingPositions,
} from "../../utils/statisticsMath";

interface DualStatisticalChartProps {
  samples: number[];
  vla: number;
  gm: number;
  gsd: number;
  ur: number;
}

export const DualStatisticalChart: React.FC<DualStatisticalChartProps> = ({
  samples,
  vla,
  gm,
  gsd,
  ur,
}) => {
  // Dimensions
  const totalWidth = 1000;
  const height = 400;
  const gap = 60;
  const chartWidth = (totalWidth - gap) / 2;
  const padding = { top: 40, right: 20, bottom: 50, left: 50 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // --- DATA PREP ---
  const validSamples = useMemo(
    () => samples.filter((s) => s > 0).sort((a, b) => a - b),
    [samples],
  );
  const n = validSamples.length;

  // Global Range
  const maxVal = Math.max(vla, ur, ...validSamples);
  const minVal = Math.min(...validSamples, vla * 0.1);

  // CHART A: PROBABILITY PLOT
  const probPositions = useMemo(() => getPlottingPositions(n), [n]);
  const zScores = useMemo(
    () => probPositions.map((p) => normInv(p)),
    [probPositions],
  );

  // Determine Ranges for A
  const logMin = Math.log(minVal * 0.5); // Pad left
  const logMax = Math.log(maxVal * 2); // Pad right
  const logRange = logMax - logMin;

  const zMin = -3; // approx 0.1%
  const zMax = 3; // approx 99.9%
  const zRange = zMax - zMin;

  // Scales A
  const scaleXA = (logVal: number) =>
    ((logVal - logMin) / logRange) * plotWidth;
  const scaleYA = (zVal: number) =>
    plotHeight - ((zVal - zMin) / zRange) * plotHeight;

  // Regression Line (Theoretical Log-Normal)
  const lnGM = Math.log(gm);
  const lnGSD = Math.log(gsd);

  const xLogLineStart = -3 * lnGSD + lnGM;
  const xLogLineEnd = 3 * lnGSD + lnGM;

  // CHART B: DENSITY CURVE
  const maxXB = maxVal * 1.3;

  const stepB = maxXB / 100;
  let maxYB = 0;
  const curvePoints: [number, number][] = [];

  const scaleXB = (val: number) => (val / maxXB) * plotWidth;

  // Loop for points
  for (let x = 0.01; x <= maxXB; x += stepB) {
    const y = logNormPDF(x, lnGM, lnGSD);
    if (y > maxYB) maxYB = y;
    curvePoints.push([x, y]);
  }

  const scaleYB = (val: number) =>
    plotHeight - (val / (maxYB * 1.1)) * plotHeight;

  // Build Paths B
  const linePathB = curvePoints
    .map((p, i) => {
      return `${i === 0 ? "M" : "L"} ${scaleXB(p[0]) + padding.left + chartWidth + gap} ${scaleYB(p[1]) + padding.top}`;
    })
    .join(" ");

  // Build Red Shading (Area under curve from VLA to maxXB)
  const shadingPoints = curvePoints.filter((p) => p[0] >= vla);
  const yAtVla = logNormPDF(vla, lnGM, lnGSD);

  let shadingD = "";
  if (shadingPoints.length > 0) {
    const startX = scaleXB(vla) + padding.left + chartWidth + gap;
    const startY = scaleYB(yAtVla) + padding.top;

    const pathPoints = shadingPoints
      .map(
        (p) =>
          `L ${scaleXB(p[0]) + padding.left + chartWidth + gap} ${scaleYB(p[1]) + padding.top}`,
      )
      .join(" ");

    const endX =
      scaleXB(shadingPoints[shadingPoints.length - 1][0]) +
      padding.left +
      chartWidth +
      gap;

    shadingD = `M ${startX} ${height - padding.bottom} L ${startX} ${startY} ${pathPoints} L ${endX} ${height - padding.bottom} Z`;
  }

  // --- RENDER ---
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4 mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
        📊 Análisis Estadístico Dual (UNE-EN 689)
      </h3>

      <svg viewBox={`0 0 ${totalWidth} ${height}`} className="w-full h-auto">
        {/* --- CHART A: PROBABILITY PLOT --- */}
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Axes */}
          <line
            x1="0"
            y1={plotHeight}
            x2={plotWidth}
            y2={plotHeight}
            stroke="#9ca3af"
            strokeWidth="2"
          />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={plotHeight}
            stroke="#9ca3af"
            strokeWidth="2"
          />

          {/* Grid (Horizontal Z-lines) */}
          {[-2, -1, 0, 1, 2].map((z) => {
            const y = scaleYA(z);
            return (
              <g key={z}>
                <line
                  x1="0"
                  y1={y}
                  x2={plotWidth}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeDasharray="4,4"
                />
                <text
                  x="-10"
                  y={y + 4}
                  fontSize="10"
                  textAnchor="end"
                  fill="#6b7280"
                >
                  {z}
                </text>
              </g>
            );
          })}

          {/* Labels */}
          <text
            x={plotWidth / 2}
            y={plotHeight + 35}
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill="#374151"
          >
            Log(Concentración)
          </text>
          <text
            transform="rotate(-90)"
            x={-plotHeight / 2}
            y={-35}
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill="#374151"
          >
            Probit (Z-Score)
          </text>

          {/* Title */}
          <text
            x={plotWidth / 2}
            y={-15}
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#1f2937"
          >
            A. Ajuste Log-Normal
          </text>

          {/* Regression Line */}
          <line
            x1={scaleXA(xLogLineStart)}
            y1={scaleYA(-3)}
            x2={scaleXA(xLogLineEnd)}
            y2={scaleYA(3)}
            stroke="#2563eb"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* Points */}
          {validSamples.map((s, i) => {
            const z = zScores[i];
            const lx = Math.log(s);
            return (
              <circle
                key={i}
                cx={scaleXA(lx)}
                cy={scaleYA(z)}
                r="4"
                fill="#ef4444"
                stroke="white"
                strokeWidth="1"
              />
            );
          })}
        </g>

        {/* --- CHART B: DENSITY CURVE --- */}
        <g transform={`translate(0, 0)`}>
          {" "}
          {/* Coordinates already offset in path generation */}
          {/* Axes - manually drawing relative to the second region */}
          <line
            x1={padding.left + chartWidth + gap}
            y1={height - padding.bottom}
            x2={totalWidth - padding.right}
            y2={height - padding.bottom}
            stroke="#9ca3af"
            strokeWidth="2"
          />
          {/* Shading */}
          <path d={shadingD} fill="#ef4444" opacity="0.2" />
          {/* Curve */}
          <path d={linePathB} fill="none" stroke="#2563eb" strokeWidth="2" />
          {/* VLA Line */}
          {(() => {
            const xPos = scaleXB(vla) + padding.left + chartWidth + gap;
            return (
              <g>
                <line
                  x1={xPos}
                  y1={padding.top}
                  x2={xPos}
                  y2={height - padding.bottom}
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <text
                  x={xPos}
                  y={padding.top - 10}
                  fill="#ef4444"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                >
                  VLA
                </text>
              </g>
            );
          })()}
          {/* UR Line */}
          {(() => {
            const xPos = scaleXB(ur) + padding.left + chartWidth + gap;
            // Only draw if within bounds
            if (xPos > totalWidth) return null;
            return (
              <g>
                <line
                  x1={xPos}
                  y1={padding.top + 20}
                  x2={xPos}
                  y2={height - padding.bottom}
                  stroke="#111827"
                  strokeWidth="3"
                />
                <text
                  x={xPos}
                  y={padding.top + 15}
                  fill="#111827"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                >
                  U(70)
                </text>
              </g>
            );
          })()}
          {/* Title */}
          <text
            x={padding.left + chartWidth + gap + plotWidth / 2}
            y={padding.top - 15}
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#1f2937"
          >
            B. Densidad de Exposición
          </text>
          {/* X Axis Label */}
          <text
            x={padding.left + chartWidth + gap + plotWidth / 2}
            y={height - 5}
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill="#374151"
          >
            Concentración ($mg/m^3$)
          </text>
          {/* Exposure Index Annotation */}
          <text
            x={totalWidth - padding.right - 10}
            y={padding.top + 40}
            textAnchor="end"
            fontSize="14"
            fontWeight="bold"
            fill="#374151"
          >
            I = {(ur / vla).toFixed(2)}
          </text>
        </g>
      </svg>
    </div>
  );
};
