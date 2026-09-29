import { useState, useEffect, useMemo, useRef } from 'react';
import {
  marineTelemetryService,
  MarineTelemetryReading,
  ChartDataPoint,
  TimeframeMode
} from '../services/marineTelemetryStream';

export function useMarineTelemetry() {
  const [telemetry, setTelemetry] = useState<MarineTelemetryReading>(() =>
    marineTelemetryService.getCurrentReading()
  );
  const [chartPoints, setChartPoints] = useState<ChartDataPoint[]>(() =>
    marineTelemetryService.getChartPoints()
  );
  const [mode, setModeState] = useState<TimeframeMode>(() =>
    marineTelemetryService.getMode()
  );
  const [secondsAgo, setSecondsAgo] = useState<number>(0);
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    const unsubscribe = marineTelemetryService.subscribe((newReading, newPoints) => {
      setTelemetry(newReading);
      setChartPoints(newPoints);
      lastUpdateRef.current = Date.now();
      setSecondsAgo(0);
    });

    const timer = setInterval(() => {
      const diff = Math.floor((Date.now() - lastUpdateRef.current) / 1000);
      setSecondsAgo(diff);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  const setMode = (newMode: TimeframeMode) => {
    setModeState(newMode);
    marineTelemetryService.setMode(newMode);
    lastUpdateRef.current = Date.now();
    setSecondsAgo(0);
  };

  const freshnessText = useMemo(() => {
    if (mode === 'Historical') return '24h Log Archive';
    if (mode === 'Forecast') return 'T+24h Wave Run';
    if (secondsAgo <= 1) return 'Updated just now';
    return `Updated ${secondsAgo}s ago`;
  }, [mode, secondsAgo]);

  // Compute SVG curve paths dynamically from chartPoints
  const { areaPath, linePath, activePoint } = useMemo(() => {
    if (!chartPoints || chartPoints.length === 0) {
      return { areaPath: '', linePath: '', activePoint: { x: 240, y: 28 } };
    }

    const width = 400;
    const height = 90;
    const paddingBottom = 14;
    const paddingTop = 16;
    const n = chartPoints.length;

    // Determine scale range
    const values = chartPoints.map((p) => p.val);
    const minVal = Math.max(0.4, Math.min(...values) - 0.2);
    const maxVal = Math.max(minVal + 0.6, Math.max(...values) + 0.25);
    const valRange = maxVal - minVal || 1.0;

    const coords = chartPoints.map((p, idx) => {
      const x = (idx / (n - 1)) * width;
      const normalized = (p.val - minVal) / valRange;
      // y=paddingTop is top (highest wave), y=height-paddingBottom is bottom
      const y = (height - paddingBottom) - (normalized * (height - paddingTop - paddingBottom));
      return { x, y, val: p.val, sst: p.sst };
    });

    // Build Catmull-Rom to Cubic Bézier spline
    let pathD = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;

    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[Math.max(0, i - 1)];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[Math.min(coords.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      pathD += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    const linePathStr = pathD;
    const areaPathStr = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    const lastCoord = coords[coords.length - 1];

    return {
      areaPath: areaPathStr,
      linePath: linePathStr,
      activePoint: lastCoord
    };
  }, [chartPoints]);

  return {
    telemetry,
    chartPoints,
    mode,
    setMode,
    freshnessText,
    areaPath,
    linePath,
    activePoint
  };
}
