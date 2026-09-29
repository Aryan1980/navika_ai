import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { PFZZone } from '../../types/marine';
import { RoutePlannerPanel } from '../Navigation/RoutePlannerPanel';
import { getTranslation } from '../../utils/translations';
import { getLocalizedPortName } from '../../utils/locationTranslations';
import { haversineDistance, calculateBearing } from '../../services/fallbackData';
import {
  MARINE_PORTS,
  OCEAN_BUOYS,
  AIS_VESSELS,
  OCEAN_BASINS,
  generateGraticuleGeoJSON,
  generateOceanCurrentVectors,
  generateSSTThermalFrontGeoJSON,
  generateSatelliteSwathGeoJSON,
  MarinePort,
  OceanBuoy,
  AISVessel
} from './marineMapData';
import { MarineInspectionSheet, InspectionTarget } from './MarineInspectionSheet';
import { MarineMapLegend } from './MarineMapLegend';
import { MarineMapControls, BasemapMode, QuickFilterMode } from './MarineMapControls';
import { MarineSearchBar } from './MarineSearchBar';
import { MarineCoordinateHUD } from './MarineCoordinateHUD';
import { Ruler, X } from 'lucide-react';

export const MarineMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);

  // Marker storage refs for clean lifecycle management
  const pfzMarkersRef = useRef<maplibregl.Marker[]>([]);
  const portMarkersRef = useRef<maplibregl.Marker[]>([]);
  const buoyMarkersRef = useRef<maplibregl.Marker[]>([]);
  const vesselTrafficMarkersRef = useRef<maplibregl.Marker[]>([]);
  const basinMarkersRef = useRef<maplibregl.Marker[]>([]);
  const vesselMarkerRef = useRef<maplibregl.Marker | null>(null);
  const meshMarkersRef = useRef<maplibregl.Marker[]>([]);
  const rulerMarkerARef = useRef<maplibregl.Marker | null>(null);
  const rulerMarkerBRef = useRef<maplibregl.Marker | null>(null);

  // Map state
  const [basemapMode, setBasemapMode] = useState<BasemapMode>('satellite');
  const [activeLayers, setActiveLayers] = useState<string[]>([
    'pfz',
    'ports',
    'ais_vessels',
    'ocean_buoys',
    'sst_gradient',
    'current_vectors',
    'openseamap',
    'navic_mesh',
    'imbl',
    'mpas',
    'graticule'
  ]);
  const [quickFilter, setQuickFilter] = useState<QuickFilterMode>('all');
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Coordinates & Inspection Target
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(10.5);
  const [inspectionTarget, setInspectionTarget] = useState<InspectionTarget | null>(null);

  // Interactive Nautical Distance Ruler State
  const [isRulerActive, setIsRulerActive] = useState<boolean>(false);
  const [rulerPoints, setRulerPoints] = useState<[number, number][]>([]);
  const [rulerMeasurement, setRulerMeasurement] = useState<{
    distKm: number;
    distNm: number;
    bearingDeg: number;
    bearingCompass: string;
  } | null>(null);

  const {
    activeLocation,
    activeLocationName,
    pfzs,
    routeComparison,
    openRouteForPFZ,
    confirmLocation,
    language,
    isRouteDrawerOpen,
    setIsRouteDrawerOpen
  } = useApp();

  // 1. Initialize MapLibre GL Map with 3 High-Detail Basemaps
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            // Basemap 1: Satellite Photorealistic (Google Hybrid)
            'satellite-source': {
              type: 'raster',
              tiles: [
                'https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                'https://mt2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                'https://mt3.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
              ],
              tileSize: 256,
              maxzoom: 19,
              attribution: '&copy; Google Satellite / Marine Hydrography'
            },
            // Basemap 2: Dark Marine Hydrographic (CARTO Dark Matter)
            'dark-marine-source': {
              type: 'raster',
              tiles: [
                'https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              maxzoom: 19,
              attribution: '&copy; CARTO Dark Matter / OpenStreetMap'
            },
            // Basemap 3: Bathymetry Ocean Depth (ESRI World Ocean Base & Reference)
            'bathymetry-source': {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}'
              ],
              tileSize: 256,
              maxzoom: 16,
              attribution: '&copy; ESRI World Ocean Bathymetry & GEBCO'
            },
            'bathymetry-ref-source': {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}'
              ],
              tileSize: 256,
              maxzoom: 16,
              attribution: '&copy; ESRI World Ocean Reference'
            },
            // Overlay: OpenSeaMap Nautical Seamarks
            'openseamap-source': {
              type: 'raster',
              tiles: ['https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'],
              tileSize: 256,
              maxzoom: 18,
              attribution: '&copy; OpenSeaMap Navigation Seamarks'
            }
          },
          layers: [
            // Basemap 1: Satellite
            {
              id: 'satellite-layer',
              type: 'raster',
              source: 'satellite-source',
              paint: { 'raster-opacity': 0.96 }
            },
            // Basemap 2: Dark Marine
            {
              id: 'dark-marine-layer',
              type: 'raster',
              source: 'dark-marine-source',
              layout: { visibility: 'none' },
              paint: { 'raster-opacity': 0.96 }
            },
            // Basemap 3: Bathymetry
            {
              id: 'bathymetry-layer',
              type: 'raster',
              source: 'bathymetry-source',
              layout: { visibility: 'none' },
              paint: { 'raster-opacity': 0.98 }
            },
            {
              id: 'bathymetry-ref-layer',
              type: 'raster',
              source: 'bathymetry-ref-source',
              layout: { visibility: 'none' },
              paint: { 'raster-opacity': 0.95 }
            },
            // Seamarks Overlay
            {
              id: 'openseamap-layer',
              type: 'raster',
              source: 'openseamap-source',
              layout: { visibility: 'visible' },
              paint: { 'raster-opacity': 0.92 }
            }
          ]
        },
        center: [activeLocation.longitude, activeLocation.latitude],
        zoom: 10.5,
        minZoom: 3,
        maxZoom: 18,
        pitch: is3DMode ? 52 : 0,
        bearing: is3DMode ? -15 : 0,
        attributionControl: false
      });

      map.on('load', () => {
        setIsMapLoaded(true);

        // ── A. Graticule Lat/Long Gridlines ──
        map.addSource('graticule-source', {
          type: 'geojson',
          data: generateGraticuleGeoJSON()
        });
        map.addLayer({
          id: 'graticule-lines',
          type: 'line',
          source: 'graticule-source',
          paint: {
            'line-color': '#38bdf8',
            'line-width': 1,
            'line-opacity': 0.22,
            'line-dasharray': [4, 4]
          }
        });

        // ── B. SST Thermal Upwelling Gradient & Plumes ──
        map.addSource('sst-front-source', {
          type: 'geojson',
          data: generateSSTThermalFrontGeoJSON(activeLocation.latitude, activeLocation.longitude)
        });
        map.addLayer({
          id: 'sst-front-fill',
          type: 'fill',
          source: 'sst-front-source',
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': ['get', 'opacity']
          }
        });
        map.addLayer({
          id: 'sst-front-line',
          type: 'line',
          source: 'sst-front-source',
          paint: {
            'line-color': '#0ea5e9',
            'line-width': 1.5,
            'line-opacity': 0.45,
            'line-dasharray': [3, 2]
          }
        });

        // ── C. Ocean Currents & Swell Vector Field ──
        map.addSource('current-vectors-source', {
          type: 'geojson',
          data: generateOceanCurrentVectors(activeLocation.latitude, activeLocation.longitude)
        });
        map.addLayer({
          id: 'current-vectors-line',
          type: 'line',
          source: 'current-vectors-source',
          paint: {
            'line-color': '#38bdf8',
            'line-width': 2,
            'line-opacity': 0.45
          }
        });

        // ── D. Satellite Swath Footprint (ISRO Oceansat-3) ──
        map.addSource('satellite-swath-source', {
          type: 'geojson',
          data: generateSatelliteSwathGeoJSON(activeLocation.latitude, activeLocation.longitude)
        });
        map.addLayer({
          id: 'satellite-swath-fill',
          type: 'fill',
          source: 'satellite-swath-source',
          paint: {
            'fill-color': '#a855f7',
            'fill-opacity': 0.08
          }
        });
        map.addLayer({
          id: 'satellite-swath-track',
          type: 'line',
          source: 'satellite-swath-source',
          paint: {
            'line-color': '#c084fc',
            'line-width': 1.8,
            'line-opacity': 0.5,
            'line-dasharray': [5, 3]
          }
        });

        // ── E. Sovereign Geofences: IMBL ──
        map.addSource('imbl-source', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });
        map.addLayer({
          id: 'imbl-line',
          type: 'line',
          source: 'imbl-source',
          paint: {
            'line-color': '#f59e0b',
            'line-width': 2.5,
            'line-dasharray': [4, 3]
          }
        });

        // ── F. Marine Protected Areas (MPAs) ──
        map.addSource('mpas-source', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });
        map.addLayer({
          id: 'mpas-fill',
          type: 'fill',
          source: 'mpas-source',
          paint: {
            'fill-color': '#f43f5e',
            'fill-opacity': 0.16
          }
        });
        map.addLayer({
          id: 'mpas-outline',
          type: 'line',
          source: 'mpas-source',
          paint: {
            'line-color': '#f43f5e',
            'line-width': 1.5
          }
        });

        // ── G. Naval / Oil Platform Geofences ──
        map.addSource('restricted-source', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });
        map.addLayer({
          id: 'restricted-fill',
          type: 'fill',
          source: 'restricted-source',
          paint: {
            'fill-color': '#a855f7',
            'fill-opacity': 0.16
          }
        });
        map.addLayer({
          id: 'restricted-outline',
          type: 'line',
          source: 'restricted-source',
          paint: {
            'line-color': '#a855f7',
            'line-width': 1.5
          }
        });

        // ── H. Navigation Routes (Safe vs Shortest) ──
        map.addSource('route-shortest-source', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });
        map.addLayer({
          id: 'route-shortest-line',
          type: 'line',
          source: 'route-shortest-source',
          paint: {
            'line-color': '#f43f5e',
            'line-width': 2.5,
            'line-dasharray': [3, 2],
            'line-opacity': 0.8
          }
        });

        map.addSource('route-safe-source', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });
        map.addLayer({
          id: 'route-safe-glow',
          type: 'line',
          source: 'route-safe-source',
          paint: {
            'line-color': '#88BDF2',
            'line-width': 8,
            'line-opacity': 0.35,
            'line-blur': 3
          }
        });
        map.addLayer({
          id: 'route-safe-line',
          type: 'line',
          source: 'route-safe-source',
          paint: {
            'line-color': '#BDDDFC',
            'line-width': 3.5,
            'line-opacity': 0.95
          }
        });

        map.addSource('route-waypoints-source', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });
        map.addLayer({
          id: 'route-waypoints-circle',
          type: 'circle',
          source: 'route-waypoints-source',
          paint: {
            'circle-radius': 6.5,
            'circle-color': '#88BDF2',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#0f141d'
          }
        });

        // ── I. NavIC & LoRaWAN Mesh Peer Links ──
        map.addSource('navic-mesh-lines-source', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });
        map.addLayer({
          id: 'navic-mesh-lines-layer',
          type: 'line',
          source: 'navic-mesh-lines-source',
          paint: {
            'line-color': '#38bdf8',
            'line-width': 2,
            'line-dasharray': [3, 2],
            'line-opacity': 0.85
          }
        });

        // ── J. Interactive Ruler Measurement Line ──
        map.addSource('ruler-source', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });
        map.addLayer({
          id: 'ruler-line',
          type: 'line',
          source: 'ruler-source',
          paint: {
            'line-color': '#fbbf24',
            'line-width': 3,
            'line-dasharray': [3, 2]
          }
        });
      });

      // Mousemove coordinates tracking
      map.on('mousemove', (e) => {
        setCursorCoords({ lat: e.lngLat.lat, lon: e.lngLat.lng });
      });

      map.on('zoom', () => {
        setZoomLevel(map.getZoom());
      });

      mapInstanceRef.current = map;
    } catch (err) {
      console.error('MapLibre GL JS initialization error:', err);
    }

    return () => {
      // Clean up markers
      pfzMarkersRef.current.forEach((m) => m.remove());
      pfzMarkersRef.current = [];
      portMarkersRef.current.forEach((m) => m.remove());
      portMarkersRef.current = [];
      buoyMarkersRef.current.forEach((m) => m.remove());
      buoyMarkersRef.current = [];
      vesselTrafficMarkersRef.current.forEach((m) => m.remove());
      vesselTrafficMarkersRef.current = [];
      basinMarkersRef.current.forEach((m) => m.remove());
      basinMarkersRef.current = [];
      meshMarkersRef.current.forEach((m) => m.remove());
      meshMarkersRef.current = [];
      if (vesselMarkerRef.current) vesselMarkerRef.current.remove();
      if (rulerMarkerARef.current) rulerMarkerARef.current.remove();
      if (rulerMarkerBRef.current) rulerMarkerBRef.current.remove();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Basemap Mode Visibility Switcher
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapLoaded) return;

    map.setLayoutProperty(
      'satellite-layer',
      'visibility',
      basemapMode === 'satellite' ? 'visible' : 'none'
    );
    map.setLayoutProperty(
      'dark-marine-layer',
      'visibility',
      basemapMode === 'dark_marine' ? 'visible' : 'none'
    );
    map.setLayoutProperty(
      'bathymetry-layer',
      'visibility',
      basemapMode === 'bathymetry' ? 'visible' : 'none'
    );
    map.setLayoutProperty(
      'bathymetry-ref-layer',
      'visibility',
      basemapMode === 'bathymetry' ? 'visible' : 'none'
    );
  }, [basemapMode, isMapLoaded]);

  // 3. Layer Visibility Synchronization
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapLoaded) return;

    const setVisibility = (layerId: string, visible: boolean) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
      }
    };

    setVisibility('openseamap-layer', activeLayers.includes('openseamap'));
    setVisibility('graticule-lines', activeLayers.includes('graticule'));
    setVisibility('sst-front-fill', activeLayers.includes('sst_gradient'));
    setVisibility('sst-front-line', activeLayers.includes('sst_gradient'));
    setVisibility('current-vectors-line', activeLayers.includes('current_vectors'));
    setVisibility('satellite-swath-fill', activeLayers.includes('satellite_swath'));
    setVisibility('satellite-swath-track', activeLayers.includes('satellite_swath'));
    setVisibility('imbl-line', activeLayers.includes('imbl'));
    setVisibility('mpas-fill', activeLayers.includes('mpas'));
    setVisibility('mpas-outline', activeLayers.includes('mpas'));
    setVisibility('restricted-fill', activeLayers.includes('restricted'));
    setVisibility('restricted-outline', activeLayers.includes('restricted'));
    setVisibility('navic-mesh-lines-layer', activeLayers.includes('navic_mesh'));
  }, [activeLayers, isMapLoaded]);

  // 4. Update Departure Vessel Fix Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (vesselMarkerRef.current) vesselMarkerRef.current.remove();

    const vEl = document.createElement('div');
    vEl.className = 'relative flex items-center justify-center';
    vEl.style.width = '40px';
    vEl.style.height = '40px';
    vEl.title = `Active Departure Fix: ${activeLocationName}`;
    vEl.innerHTML = `
      <div style="position: absolute; width: 38px; height: 38px; border-radius: 9999px; background: rgba(4, 116, 196, 0.28); border: 2px solid rgba(136, 189, 242, 0.85); animation: pulse 2s infinite;"></div>
      <div style="position: relative; width: 18px; height: 18px; border-radius: 9999px; background: #0474C4; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.75);"></div>
    `;

    const vMarker = new maplibregl.Marker({ element: vEl, anchor: 'center' })
      .setLngLat([activeLocation.longitude, activeLocation.latitude])
      .addTo(map);

    vesselMarkerRef.current = vMarker;
  }, [activeLocation.latitude, activeLocation.longitude, activeLocationName]);

  // 5. Update PFZ Spot Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    pfzMarkersRef.current.forEach((m) => m.remove());
    pfzMarkersRef.current = [];

    if (!activeLayers.includes('pfz')) return;
    if (quickFilter === 'vessels_only' || quickFilter === 'ports_only') return;

    const visiblePFZs = pfzs.filter((p) => {
      if (quickFilter === 'safe_only') return p.safety_rating === 'SAFE';
      return true;
    });

    visiblePFZs.forEach((pfz) => {
      const isSafe = pfz.safety_rating === 'SAFE';
      const isCaution = pfz.safety_rating === 'CAUTION';
      const dotColor = isSafe ? '#10b981' : isCaution ? '#f59e0b' : '#f43f5e';
      const haloBg = isSafe
        ? 'rgba(16, 185, 129, 0.25)'
        : isCaution
        ? 'rgba(245, 158, 11, 0.25)'
        : 'rgba(244, 63, 94, 0.25)';
      const haloBorder = isSafe
        ? 'rgba(52, 211, 153, 0.7)'
        : isCaution
        ? 'rgba(251, 191, 36, 0.7)'
        : 'rgba(251, 113, 133, 0.7)';

      const markerEl = document.createElement('div');
      markerEl.className = 'relative flex items-center justify-center cursor-pointer group';
      markerEl.style.width = '42px';
      markerEl.style.height = '42px';
      markerEl.title = `${pfz.name} - ● ${pfz.safety_rating} ZONE (${pfz.distance_km} km · ${pfz.bearing_compass})`;

      markerEl.innerHTML = `
        <div style="position: absolute; width: 38px; height: 38px; border-radius: 9999px; background: ${haloBg}; border: 1px solid ${haloBorder};"></div>
        <div style="position: relative; width: 17px; height: 17px; border-radius: 9999px; background: ${dotColor}; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.65); transition: transform 0.2s ease;"></div>
      `;

      markerEl.onmouseenter = () => {
        const dot = markerEl.querySelector('div:last-child') as HTMLElement;
        if (dot) dot.style.transform = 'scale(1.3)';
      };
      markerEl.onmouseleave = () => {
        const dot = markerEl.querySelector('div:last-child') as HTMLElement;
        if (dot) dot.style.transform = 'scale(1.0)';
      };

      markerEl.onclick = () => {
        map.easeTo({
          center: [pfz.location.longitude, pfz.location.latitude],
          offset: [0, 40],
          duration: 450
        });
        setInspectionTarget({ type: 'pfz', data: pfz });
      };

      const marker = new maplibregl.Marker({ element: markerEl, anchor: 'center' })
        .setLngLat([pfz.location.longitude, pfz.location.latitude])
        .addTo(map);

      pfzMarkersRef.current.push(marker);
    });
  }, [pfzs, activeLayers, quickFilter]);

  // 6. Update Major Commercial & Fishery Harbors Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    portMarkersRef.current.forEach((m) => m.remove());
    portMarkersRef.current = [];

    if (!activeLayers.includes('ports')) return;
    if (quickFilter === 'vessels_only') return;

    MARINE_PORTS.forEach((port) => {
      const portEl = document.createElement('div');
      portEl.className = 'relative flex items-center justify-center cursor-pointer group';
      portEl.style.width = '34px';
      portEl.style.height = '34px';
      portEl.title = `Harbor: ${port.name} (${port.state})\nDepth: ${port.depth_m}m · VHF Ch ${port.vhf_ch}`;

      portEl.innerHTML = `
        <div style="position: absolute; width: 32px; height: 32px; border-radius: 9999px; background: rgba(6, 182, 212, 0.2); border: 1.5px solid rgba(34, 211, 238, 0.7);"></div>
        <div style="position: relative; width: 18px; height: 18px; border-radius: 9999px; background: #0891b2; border: 2px solid #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 10px; color: #ffffff;">⚓</span>
        </div>
      `;

      portEl.onclick = () => {
        map.easeTo({
          center: [port.lon, port.lat],
          duration: 450
        });
        setInspectionTarget({ type: 'port', data: port });
      };

      const marker = new maplibregl.Marker({ element: portEl, anchor: 'center' })
        .setLngLat([port.lon, port.lat])
        .addTo(map);

      portMarkersRef.current.push(marker);
    });
  }, [activeLayers, quickFilter]);

  // 7. Update MoES / INCOIS Telemetry Buoys Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    buoyMarkersRef.current.forEach((m) => m.remove());
    buoyMarkersRef.current = [];

    if (!activeLayers.includes('ocean_buoys')) return;
    if (quickFilter === 'vessels_only' || quickFilter === 'ports_only') return;

    OCEAN_BUOYS.forEach((buoy) => {
      const buoyEl = document.createElement('div');
      buoyEl.className = 'relative flex items-center justify-center cursor-pointer';
      buoyEl.style.width = '34px';
      buoyEl.style.height = '34px';
      buoyEl.title = `${buoy.name}\nHs: ${buoy.hs_m}m | SST: ${buoy.sst_c}°C | Ping: ${buoy.last_ping}`;

      buoyEl.innerHTML = `
        <div style="position: absolute; width: 32px; height: 32px; border-radius: 9999px; background: rgba(245, 158, 11, 0.22); border: 1.5px dashed rgba(245, 158, 11, 0.85); animation: spin 10s linear infinite;"></div>
        <div style="position: relative; width: 16px; height: 16px; border-radius: 9999px; background: #f59e0b; border: 2px solid #ffffff; box-shadow: 0 0 10px rgba(245,158,11,0.8); display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 8px;">📡</span>
        </div>
      `;

      buoyEl.onclick = () => {
        map.easeTo({
          center: [buoy.lon, buoy.lat],
          duration: 450
        });
        setInspectionTarget({ type: 'buoy', data: buoy });
      };

      const marker = new maplibregl.Marker({ element: buoyEl, anchor: 'center' })
        .setLngLat([buoy.lon, buoy.lat])
        .addTo(map);

      buoyMarkersRef.current.push(marker);
    });
  }, [activeLayers, quickFilter]);

  // 8. Update AIS Marine Vessel Traffic Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    vesselTrafficMarkersRef.current.forEach((m) => m.remove());
    vesselTrafficMarkersRef.current = [];

    if (!activeLayers.includes('ais_vessels')) return;
    if (quickFilter === 'ports_only') return;

    AIS_VESSELS.forEach((v) => {
      const vEl = document.createElement('div');
      vEl.className = 'relative flex items-center justify-center cursor-pointer';
      vEl.style.width = '32px';
      vEl.style.height = '32px';
      vEl.title = `${v.name} (${v.vessel_type})\nSOG: ${v.sog_kn} kn · COG: ${v.cog_deg}°\nDest: ${v.destination}`;

      vEl.innerHTML = `
        <div style="transform: rotate(${v.cog_deg}deg); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: ${v.color}25; border: 2px solid ${v.color}; border-radius: 50%; box-shadow: 0 0 12px ${v.color}80;">
          <span style="font-size: 13px;">🚢</span>
        </div>
      `;

      vEl.onclick = () => {
        map.easeTo({
          center: [v.lon, v.lat],
          duration: 450
        });
        setInspectionTarget({ type: 'vessel', data: v });
      };

      const marker = new maplibregl.Marker({ element: vEl, anchor: 'center' })
        .setLngLat([v.lon, v.lat])
        .addTo(map);

      vesselTrafficMarkersRef.current.push(marker);
    });
  }, [activeLayers, quickFilter]);

  // 9. Update Ocean Basin Typographic Labels
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    basinMarkersRef.current.forEach((m) => m.remove());
    basinMarkersRef.current = [];

    OCEAN_BASINS.forEach((basin) => {
      const bEl = document.createElement('div');
      bEl.className = 'pointer-events-none select-none text-center';
      bEl.innerHTML = `
        <div style="font-family: ui-sans-serif, system-ui; font-weight: 800; letter-spacing: 0.22em; font-size: 11px; color: rgba(224, 242, 254, 0.45); text-shadow: 0 2px 10px rgba(0,0,0,0.9); text-transform: uppercase;">
          ${basin.name}
        </div>
        <div style="font-size: 9px; color: rgba(136, 189, 242, 0.35); letter-spacing: 0.05em;">
          ${basin.subtext}
        </div>
      `;

      const marker = new maplibregl.Marker({ element: bEl, anchor: 'center' })
        .setLngLat([basin.lon, basin.lat])
        .addTo(map);

      basinMarkersRef.current.push(marker);
    });
  }, []);

  // 10. NavIC LoRa Mesh Demonstration Nodes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapLoaded) return;

    meshMarkersRef.current.forEach((m) => m.remove());
    meshMarkersRef.current = [];

    const meshSource = map.getSource('navic-mesh-lines-source') as maplibregl.GeoJSONSource;

    if (!activeLayers.includes('navic_mesh')) {
      if (meshSource) meshSource.setData({ type: 'FeatureCollection', features: [] });
      return;
    }

    const peerVessels = [
      {
        id: 'IND-TN-0482',
        name: 'Meenavan 1',
        type: 'Mechanized Trawler (18m)',
        lat: activeLocation.latitude + 0.042,
        lng: activeLocation.longitude + 0.062,
        sats: 7,
        rssi: -82,
        hop: 1
      },
      {
        id: 'IND-TN-0819',
        name: 'Kadalur Express',
        type: 'Motorized Fiber Craft (12m)',
        lat: activeLocation.latitude + 0.078,
        lng: activeLocation.longitude + 0.108,
        sats: 8,
        rssi: -89,
        hop: 2
      },
      {
        id: 'IND-KL-1204',
        name: 'Sagara Jyoti',
        type: 'Gillnetter (15m)',
        lat: activeLocation.latitude - 0.035,
        lng: activeLocation.longitude + 0.072,
        sats: 6,
        rssi: -85,
        hop: 1
      }
    ];

    const lines = [
      [[activeLocation.longitude, activeLocation.latitude], [peerVessels[0].lng, peerVessels[0].lat]],
      [[activeLocation.longitude, activeLocation.latitude], [peerVessels[2].lng, peerVessels[2].lat]],
      [[peerVessels[0].lng, peerVessels[0].lat], [peerVessels[1].lng, peerVessels[1].lat]],
      [[peerVessels[0].lng, peerVessels[0].lat], [peerVessels[2].lng, peerVessels[2].lat]]
    ];

    if (meshSource) {
      meshSource.setData({
        type: 'FeatureCollection',
        features: lines.map((coords, i) => ({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: coords },
          properties: { id: `mesh-link-${i}` }
        }))
      });
    }

    peerVessels.forEach((v) => {
      const el = document.createElement('div');
      el.className = 'relative flex items-center justify-center cursor-pointer';
      el.style.width = '32px';
      el.style.height = '32px';
      el.title = `${v.name} (${v.id}) - NavIC Mesh Node`;
      el.innerHTML = `
        <div style="position: absolute; width: 30px; height: 30px; border-radius: 9999px; background: rgba(6, 182, 212, 0.2); border: 1.5px dashed rgba(56, 189, 248, 0.8); animation: spin 8s linear infinite;"></div>
        <div style="position: relative; width: 14px; height: 14px; border-radius: 9999px; background: #06b6d4; border: 2px solid #ffffff; box-shadow: 0 0 10px rgba(6,182,212,0.8); display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 8px;">📡</span>
        </div>
      `;

      const m = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([v.lng, v.lat])
        .addTo(map);

      meshMarkersRef.current.push(m);
    });
  }, [activeLayers, isMapLoaded, activeLocation.latitude, activeLocation.longitude]);

  // 11. Fetch Geofences (IMBL, MPAs, Restricted)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapLoaded) return;

    api.getGeofences().then((geofences) => {
      const imblSource = map.getSource('imbl-source') as maplibregl.GeoJSONSource;
      if (imblSource && geofences.imbl) {
        const features = geofences.imbl.map((b: any) => ({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: b.coordinates.map((coord: [number, number]) => [coord[1], coord[0]])
          },
          properties: { name: b.name }
        }));
        imblSource.setData({ type: 'FeatureCollection', features });
      }

      const mpaSource = map.getSource('mpas-source') as maplibregl.GeoJSONSource;
      if (mpaSource && geofences.marine_protected_areas) {
        const features = geofences.marine_protected_areas.map((m: any) => ({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [m.polygon.map((coord: [number, number]) => [coord[1], coord[0]])]
          },
          properties: { name: m.name }
        }));
        mpaSource.setData({ type: 'FeatureCollection', features });
      }

      const rzSource = map.getSource('restricted-source') as maplibregl.GeoJSONSource;
      if (rzSource && geofences.restricted_zones) {
        const features = geofences.restricted_zones.map((r: any) => ({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [r.polygon.map((coord: [number, number]) => [coord[1], coord[0]])]
          },
          properties: { name: r.name }
        }));
        rzSource.setData({ type: 'FeatureCollection', features });
      }
    }).catch((err) => console.warn('Geofences fetch error:', err));
  }, [isMapLoaded]);

  // 12. Navigation Route Synchronization
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapLoaded) return;

    const shortestSource = map.getSource('route-shortest-source') as maplibregl.GeoJSONSource;
    const safeSource = map.getSource('route-safe-source') as maplibregl.GeoJSONSource;
    const waypointsSource = map.getSource('route-waypoints-source') as maplibregl.GeoJSONSource;

    if (!routeComparison) {
      if (shortestSource) shortestSource.setData({ type: 'FeatureCollection', features: [] });
      if (safeSource) safeSource.setData({ type: 'FeatureCollection', features: [] });
      if (waypointsSource) waypointsSource.setData({ type: 'FeatureCollection', features: [] });
      return;
    }

    const shortestCoords = routeComparison.shortest_route.waypoints.map((w) => [w.longitude, w.latitude]);
    const safeCoords = routeComparison.safe_route.waypoints.map((w) => [w.longitude, w.latitude]);

    if (shortestSource) {
      shortestSource.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: shortestCoords },
            properties: { type: 'shortest' }
          }
        ]
      });
    }

    if (safeSource) {
      safeSource.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: safeCoords },
            properties: { type: 'safe' }
          }
        ]
      });
    }

    if (waypointsSource) {
      const waypointFeatures = routeComparison.safe_route.waypoints.map((w, idx) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [w.longitude, w.latitude]
        },
        properties: {
          index: idx + 1,
          name: w.name,
          instruction: w.instruction
        }
      }));
      waypointsSource.setData({
        type: 'FeatureCollection',
        features: waypointFeatures
      });
    }

    const bounds = new maplibregl.LngLatBounds();
    safeCoords.forEach((c) => bounds.extend(c as [number, number]));
    shortestCoords.forEach((c) => bounds.extend(c as [number, number]));
    map.fitBounds(bounds, { padding: 90, duration: 1200 });
  }, [routeComparison, isMapLoaded]);

  // 13. Nautical Distance Measurement Tool Click Handler
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!isRulerActive) {
      // Clear ruler points & markers
      setRulerPoints([]);
      setRulerMeasurement(null);
      if (rulerMarkerARef.current) {
        rulerMarkerARef.current.remove();
        rulerMarkerARef.current = null;
      }
      if (rulerMarkerBRef.current) {
        rulerMarkerBRef.current.remove();
        rulerMarkerBRef.current = null;
      }
      const rulerSource = map.getSource('ruler-source') as maplibregl.GeoJSONSource;
      if (rulerSource) rulerSource.setData({ type: 'FeatureCollection', features: [] });
      map.getCanvas().style.cursor = '';
      return;
    }

    map.getCanvas().style.cursor = 'crosshair';

    const handleMapClick = (e: maplibregl.MapMouseEvent) => {
      const clickedLngLat: [number, number] = [e.lngLat.lng, e.lngLat.lat];

      setRulerPoints((prev) => {
        if (prev.length === 0 || prev.length >= 2) {
          // Set Point A
          if (rulerMarkerARef.current) rulerMarkerARef.current.remove();
          if (rulerMarkerBRef.current) rulerMarkerBRef.current.remove();

          const elA = document.createElement('div');
          elA.className = 'w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-lg';
          rulerMarkerARef.current = new maplibregl.Marker({ element: elA, anchor: 'center' })
            .setLngLat(clickedLngLat)
            .addTo(map);

          setRulerMeasurement(null);
          const rulerSource = map.getSource('ruler-source') as maplibregl.GeoJSONSource;
          if (rulerSource) rulerSource.setData({ type: 'FeatureCollection', features: [] });

          return [clickedLngLat];
        } else {
          // Set Point B
          const pA = prev[0];
          const pB = clickedLngLat;

          const elB = document.createElement('div');
          elB.className = 'w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-lg';
          rulerMarkerBRef.current = new maplibregl.Marker({ element: elB, anchor: 'center' })
            .setLngLat(pB)
            .addTo(map);

          // Calculate distance & bearing
          const distKm = haversineDistance(pA[1], pA[0], pB[1], pB[0]);
          const distNm = distKm / 1.852;
          const bearing = calculateBearing(pA[1], pA[0], pB[1], pB[0]);

          setRulerMeasurement({
            distKm: Math.round(distKm * 10) / 10,
            distNm: Math.round(distNm * 10) / 10,
            bearingDeg: bearing.deg,
            bearingCompass: bearing.compass
          });

          const rulerSource = map.getSource('ruler-source') as maplibregl.GeoJSONSource;
          if (rulerSource) {
            rulerSource.setData({
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: [pA, pB]
                  },
                  properties: {}
                }
              ]
            });
          }

          return [pA, pB];
        }
      });
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
      map.getCanvas().style.cursor = '';
    };
  }, [isRulerActive]);

  // Actions & Callbacks
  const handleToggleLayer = (layerId: string) => {
    setActiveLayers((prev) =>
      prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]
    );
  };

  const handleFlyTo = (coords: { lat: number; lon: number }, zoom = 11) => {
    mapInstanceRef.current?.flyTo({
      center: [coords.lon, coords.lat],
      zoom,
      duration: 1200
    });
  };

  const handleSelectPort = (port: MarinePort) => {
    confirmLocation({ latitude: port.lat, longitude: port.lon }, port.name);
    handleFlyTo({ lat: port.lat, lon: port.lon }, 12);
  };

  const handleToggle3D = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const next3D = !is3DMode;
    setIs3DMode(next3D);
    map.easeTo({
      pitch: next3D ? 52 : 0,
      bearing: next3D ? -18 : 0,
      duration: 1200
    });
  }, [is3DMode]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn({ duration: 300 });
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut({ duration: 300 });
  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo({
      center: [activeLocation.longitude, activeLocation.latitude],
      zoom: 11,
      duration: 1200
    });
  };
  const handleResetNorth = () => {
    mapInstanceRef.current?.resetNorthPitch({ duration: 800 });
    setIs3DMode(false);
  };
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#090d18]">
      {/* MapLibre GL Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Top Nav / Search Header */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 flex items-center gap-2 pointer-events-none">
        <MarineSearchBar
          pfzs={pfzs}
          onFlyTo={handleFlyTo}
          onSelectPFZ={(pfz) => setInspectionTarget({ type: 'pfz', data: pfz })}
          onSelectPort={(port) => setInspectionTarget({ type: 'port', data: port })}
        />
      </div>

      {/* Active Departure Harbor Coordinate Badge (Top Right Center) */}
      <div className="hidden lg:flex absolute top-4 left-1/2 -translate-x-1/2 z-20 items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#121824]/90 backdrop-blur-md border border-[#384959] shadow-xl pointer-events-auto font-sans">
        <div className="w-2.5 h-2.5 rounded-full bg-[#0474c4] animate-pulse" />
        <span className="text-xs sm:text-sm text-white font-semibold">
          {getLocalizedPortName(activeLocationName, language).split(',')[0]}
        </span>
        <span className="text-xs text-[#BDDDFC]/80 font-mono">
          {activeLocation.latitude.toFixed(4)}°N, {activeLocation.longitude.toFixed(4)}°E
        </span>
      </div>

      {/* Floating Map Controls (Basemaps, Layers, Ruler, 3D, Zoom) */}
      <MarineMapControls
        basemapMode={basemapMode}
        onSelectBasemap={setBasemapMode}
        activeLayers={activeLayers}
        onToggleLayer={handleToggleLayer}
        quickFilter={quickFilter}
        onSelectQuickFilter={setQuickFilter}
        is3DMode={is3DMode}
        onToggle3D={handleToggle3D}
        isRulerActive={isRulerActive}
        onToggleRuler={() => setIsRulerActive(!isRulerActive)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRecenter={handleRecenter}
        onResetNorth={handleResetNorth}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Ruler Active Measurement Notification Banner */}
      {isRulerActive && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-amber-500/90 text-[#0f141d] font-sans font-bold text-xs shadow-2xl backdrop-blur-md border border-amber-300">
            <Ruler className="w-4 h-4" />
            <span>
              {rulerMeasurement
                ? `Measured: ${rulerMeasurement.distNm} NM (${rulerMeasurement.distKm} km) · Course ${rulerMeasurement.bearingDeg}° (${rulerMeasurement.bearingCompass})`
                : rulerPoints.length === 1
                ? 'Click second waypoint on map to measure'
                : 'Click origin waypoint on map'}
            </span>
            <button
              onClick={() => setIsRulerActive(false)}
              className="p-1 rounded-full hover:bg-amber-600/30 text-[#0f141d]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Live Coordinate & Hydrographic HUD (Bottom Center) */}
      <MarineCoordinateHUD
        cursorCoords={cursorCoords}
        activeCoords={activeLocation}
        zoomLevel={zoomLevel}
      />

      {/* Collapsible Marine Legend (Bottom Left) */}
      <MarineMapLegend language={language} />

      {/* Universal Inspection Sheet (Bottom Sheet on Mobile, Floating Card on Desktop) */}
      <MarineInspectionSheet
        target={inspectionTarget}
        onClose={() => setInspectionTarget(null)}
        language={language}
        onNavigatePFZ={(pfz) => {
          openRouteForPFZ(pfz);
          setIsRouteDrawerOpen(true);
        }}
        onSelectPort={handleSelectPort}
      />

      {/* Slide-out Route Navigation Plan Panel */}
      {isRouteDrawerOpen && (
        <div className="absolute inset-y-0 right-0 z-40 w-full sm:w-[580px] md:w-[640px] lg:w-[680px] shadow-2xl">
          <RoutePlannerPanel />
        </div>
      )}
    </div>
  );
};
