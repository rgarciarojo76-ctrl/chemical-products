import React, { useMemo } from "react";

interface StatisticalChartProps {
  samples: number[];
  vla: number;
  gm: number;
  gsd: number;
  ur: number;
  decision: "compliant" | "non_compliant" | "need_more_samples";
}

export const StatisticalChart: React.FC<StatisticalChartProps> = ({
  samples,
  vla,
  gm,
  gsd,
  ur,
  decision,
}) => {
  // 1. Setup Graph Dimensions and Scales
  const width = 600;
  const height = 250;
  const padding = { top: 20, right: 30, bottom: 40, left: 40 };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Determine X-Axis Range
  const maxVal = Math.max(vla, ur, ...samples);
  const xDomainMax = maxVal * 1.25;

  // 2. Generate Log-Normal Curve Points
  const curvePath = useMemo(() => {
    if (gm <= 0 || gsd <= 1) return "";

    const mu = Math.log(gm);
    const sigma = Math.log(gsd);
    // Avoid division by zero at x=0. Start from small epsilon.
    const startX = Math.max(0.01, maxVal * 0.01);
    const step = (xDomainMax - startX) / 100;

    // Scale helper inside memo to avoid dep on external scalar
    const getX = (val: number) => (val / xDomainMax) * graphWidth;

    const points: [number, number][] = [];
    let maxY = 0;

    for (let x = startX; x <= xDomainMax; x += step) {
      const pdf =
        (1 / (x * sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-Math.pow(Math.log(x) - mu, 2) / (2 * Math.pow(sigma, 2)));

      points.push([getX(x), pdf]);
      if (pdf > maxY) maxY = pdf;
    }

    const yScale = (val: number) =>
      graphHeight - (val / (maxY * 1.1)) * graphHeight;

    if (points.length === 0) return "";

    const d = points
      .map((p, i) => {
        const [xPx, yRaw] = p;
        const yPx = yScale(yRaw);
        return `${i === 0 ? "M" : "L"} ${xPx + padding.left} ${yPx + padding.top}`;
      })
      .join(" ");

    const areaD = `${d} L ${points[points.length - 1][0] + padding.left} ${height - padding.bottom} L ${points[0][0] + padding.left} ${height - padding.bottom} Z`;

    return { line: d, area: areaD };
  }, [
    gm,
    gsd,
    maxVal,
    xDomainMax,
    graphWidth,
    graphHeight,
    height,
    padding.left,
    padding.top,
    padding.bottom,
  ]);

  // X-Scale for rendering static elements
  const xScale = (val: number) => (val / xDomainMax) * graphWidth;

  // 3. Render
  if (!gm || !gsd || samples.length === 0) return null;

  return (
    <div className="w-full overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm mt-4">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h4 className="font-bold text-gray-700 text-sm">
          Visualización del Test (Log-Normal)
        </h4>
        <div className="text-xs text-gray-500">
          Escala Lineal (0 - {xDomainMax.toFixed(2)} mg/m³)
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grids and Axes */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#e5e7eb"
          strokeWidth="2"
        />

        {/* --- CURVE --- */}
        {curvePath && (
          <>
            <path d={curvePath.area} fill="url(#gradBlue)" opacity="0.2" />
            <path
              d={curvePath.line}
              stroke="#2563eb"
              strokeWidth="2"
              fill="none"
            />
            <defs>
              <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
              </linearGradient>
              <pattern
                id="diagonalHatch"
                width="4"
                height="4"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect
                  width="2"
                  height="4"
                  transform="translate(0,0)"
                  fill="#ef4444"
                  opacity="0.1"
                />
              </pattern>
            </defs>
          </>
        )}

        {/* --- VLA LINE --- */}
        <line
          x1={padding.left + xScale(vla)}
          y1={padding.top}
          x2={padding.left + xScale(vla)}
          y2={height - padding.bottom}
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        <text
          x={padding.left + xScale(vla)}
          y={padding.top - 5}
          fill="#ef4444"
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
        >
          VLA ({vla})
        </text>

        {/* --- UR LINE (Result) --- */}
        <line
          x1={padding.left + xScale(ur)}
          y1={padding.top + 20}
          x2={padding.left + xScale(ur)}
          y2={height - padding.bottom}
          stroke={decision === "compliant" ? "#16a34a" : "#dc2626"}
          strokeWidth="3"
        />
        <text
          x={padding.left + xScale(ur)}
          y={padding.top + 15}
          fill={decision === "compliant" ? "#16a34a" : "#dc2626"}
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
        >
          UR ({ur.toFixed(2)})
        </text>

        {/* --- SAMPLES DOTS --- */}
        {samples.map((s, i) => (
          <circle
            key={i}
            cx={padding.left + xScale(s)}
            cy={height - padding.bottom - 10} // Just above axis
            r="4"
            fill="#4b5563"
            opacity="0.7"
          >
            <title>
              Muestra {i + 1}: {s.toFixed(3)}
            </title>
          </circle>
        ))}
      </svg>

      <div className="p-3 text-xs text-gray-500 bg-gray-50 border-t flex justify-center gap-4">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-500 opacity-50"></span>
          <span>Modelo Log-Normal</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-gray-600 opacity-70"></span>
          <span>Muestras Reales</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1 h-3 bg-red-500 border border-dashed border-red-500"></span>
          <span>Límite (VLA)</span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={`w-1 h-3 ${decision === "compliant" ? "bg-green-600" : "bg-red-600"}`}
          ></span>
          <span>Resultado (UR)</span>
        </div>
      </div>
    </div>
  );
};
