import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Search, Plus, Minus, Crosshair, Navigation, X, Volume2, Compass, Shield, Flame, Droplets, Anchor, Box, Radio } from 'lucide-react';
import { PFZZone } from '../../types/marine';
import { RoutePlannerPanel } from '../Navigation/RoutePlannerPanel';
import { getTranslation } from '../../utils/translations';
import { getLocalizedPortName, localizeDestination } from '../../utils/locationTranslations';

export const MarineMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const activePopupRef = useRef<maplibregl.Popup | null>(null);
  const pfzMarkersRef = useRef<maplibregl.Marker[]>([]);
  const vesselMarkerRef = useRef<maplibregl.Marker | null>(null);
  const simulatedVesselMarkerRef = useRef<maplibregl.Marker | null>(null);
  const meshMarkersRef = useRef<maplibregl.Marker[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isOpenSeaMapActive, setIsOpenSeaMapActive] = useState<boolean>(true);
  const [isNavicMeshActive, setIsNavicMeshActive] = useState<boolean>(true);
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  const {
    activeLocation,
    activeLocationName,
    activeMapLayers,
    pfzs,
    selectedPFZForRoute,
    routeComparison,
    openRouteForPFZ,
    clearRoute,
    language,
    isRouteDrawerOpen,
    setIsRouteDrawerOpen,
    setActiveNav
  } = useApp();

  // 1. Initialize MapLibre GL JS Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
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
            'openseamap-source': {
              type: 'raster',
              tiles: ['https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'],
              tileSize: 256,
              maxzoom: 18,
              attribution: '&copy; OpenSeaMap Navigation Seamarks'
            }
          },
          layers: [
            {
              id: 'satellite-layer',
              type: 'raster',
              source: 'satellite-source',
              paint: { 'raster-opacity': 0.96 }
            },
            {
              id: 'openseamap-layer',
              type: 'raster',
              source: 'openseamap-source',
              layout: {
                visibility: isOpenSeaMapActive ? 'visible' : 'none'
              },
              paint: { 'raster-opacity': 0.94 }
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

        // Geofences: IMBL
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

        // Geofences: MPAs
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

        // Geofences: Restricted Zones
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

        // Navigation Routes (Shortest Direct vs Safe Searoute Fairway)
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

        // Route Waypoint markers
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

        // NavIC & LoRaWAN Mesh Peer-to-Peer Links
        map.addSource('navic-mesh-lines-source', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });
        map.addLayer({
          id: 'navic-mesh-lines-glow',
          type: 'line',
          source: 'navic-mesh-lines-source',
          paint: {
            'line-color': '#06b6d4',
            'line-width': 4,
            'line-opacity': 0.4,
            'line-blur': 2
          }
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
      });

      mapInstanceRef.current = map;
    } catch (err) {
      console.error('MapLibre GL JS initialization error:', err);
    }

    return () => {
      pfzMarkersRef.current.forEach(m => m.remove());
      pfzMarkersRef.current = [];
      meshMarkersRef.current.forEach(m => m.remove());
      meshMarkersRef.current = [];
      if (vesselMarkerRef.current) {
        vesselMarkerRef.current.remove();
        vesselMarkerRef.current = null;
      }
      if (simulatedVesselMarkerRef.current) {
        simulatedVesselMarkerRef.current.remove();
        simulatedVesselMarkerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. OpenSeaMap visibility sync
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapLoaded) return;
    if (map.getLayer('openseamap-layer')) {
      map.setLayoutProperty(
        'openseamap-layer',
        'visibility',
        isOpenSeaMapActive ? 'visible' : 'none'
      );
    }
  }, [isOpenSeaMapActive, isMapLoaded]);

  // 3. 3D Mode Perspective Switch
  const toggle3DMode = useCallback(() => {
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

  // 4. Update Vessel Position using reliable DOM Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (vesselMarkerRef.current) {
      vesselMarkerRef.current.remove();
    }

    const vEl = document.createElement('div');
    vEl.className = 'relative flex items-center justify-center';
    vEl.style.width = '36px';
    vEl.style.height = '36px';
    vEl.title = `Departure Fix: ${activeLocationName}`;
    vEl.innerHTML = `
      <div style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background: rgba(4, 116, 196, 0.28); border: 1.5px solid rgba(136, 189, 242, 0.7); animation: pulse 2s infinite;"></div>
      <div style="position: relative; width: 16px; height: 16px; border-radius: 9999px; background: #0474C4; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.6);"></div>
    `;

    const vMarker = new maplibregl.Marker({ element: vEl, anchor: 'center' })
      .setLngLat([activeLocation.longitude, activeLocation.latitude])
      .addTo(map);

    vesselMarkerRef.current = vMarker;
  }, [activeLocation.latitude, activeLocation.longitude, activeLocationName]);

  // 4b. Render Simulated Vessel Track (AIS IND-8421)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (simulatedVesselMarkerRef.current) {
      simulatedVesselMarkerRef.current.remove();
      simulatedVesselMarkerRef.current = null;
    }

    if (!activeMapLayers.includes('simulated_vessel')) return;

    // Seaward track vector from activeLocation heading ~240°
    const currentLat = activeLocation.latitude - 0.09;
    const currentLon = activeLocation.longitude - 0.14;

    const boatEl = document.createElement('div');
    boatEl.className = 'simulated-vessel-marker flex items-center justify-center cursor-pointer';
    boatEl.style.width = '32px';
    boatEl.style.height = '32px';
    boatEl.title = 'SIMULATED VESSEL (AIS ID: IND-8421)\nCourse: 240° WSW | Speed: 8.2 kn\nStatus: Underway using engine';
    boatEl.innerHTML = `
      <div style="transform: rotate(240deg); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: rgba(245, 158, 11, 0.35); border: 2px solid #f59e0b; border-radius: 50%; box-shadow: 0 0 14px rgba(245, 158, 11, 0.7);">
        <span style="font-size: 14px;">⛵</span>
      </div>
    `;

    const marker = new maplibregl.Marker({ element: boatEl, anchor: 'center' })
      .setLngLat([currentLon, currentLat])
      .addTo(map);

    simulatedVesselMarkerRef.current = marker;
  }, [activeLocation.latitude, activeLocation.longitude, activeMapLayers]);

  // 5. Update PFZ Spot Markers using DOM Markers for 100% reliable rendering
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous PFZ markers
    pfzMarkersRef.current.forEach(m => m.remove());
    pfzMarkersRef.current = [];

    if (!activeMapLayers.includes('pfz')) return;

    const filtered = pfzs.filter((p) =>
      searchQuery
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.recommendation.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

    filtered.forEach((pfz) => {
      const isSafe = pfz.safety_rating === 'SAFE';
      const isCaution = pfz.safety_rating === 'CAUTION';
      const dotColor = isSafe ? '#10b981' : isCaution ? '#f59e0b' : '#f43f5e';
      const haloBg = isSafe ? 'rgba(16, 185, 129, 0.22)' : isCaution ? 'rgba(245, 158, 11, 0.22)' : 'rgba(244, 63, 94, 0.22)';
      const haloBorder = isSafe ? 'rgba(52, 211, 153, 0.6)' : isCaution ? 'rgba(251, 191, 36, 0.6)' : 'rgba(251, 113, 133, 0.6)';

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
        if (activePopupRef.current) activePopupRef.current.remove();

        // Smoothly center the map view with an offset so the popup is completely visible without manual scrolling
        map.easeTo({
          center: [pfz.location.longitude, pfz.location.latitude],
          offset: [0, 80],
          duration: 450
        });

        const suitabilityScore = Math.round(Number(pfz.suitability_score || 85));
        const localizedSpotName = localizeDestination(pfz.name, language);
        const safetyRatingText = `${pfz.safety_rating} ${getTranslation('zone_suffix', language)}`;

        const popupDiv = document.createElement('div');
        popupDiv.className = 'p-5 text-white font-sans w-[320px] sm:w-[350px] max-h-[75vh] overflow-y-auto custom-scrollbar bg-[#161c27] rounded-3xl border border-[#384959] shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative select-none';
        popupDiv.innerHTML = `
          <!-- Header with 36px clearance for close button to prevent overlap -->
          <div class="mb-3 pr-9">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#384959] text-white border border-[#88BDF2]/40 flex items-center gap-1.5 shadow-sm">
                <span class="w-1.5 h-1.5 rounded-full bg-[#88BDF2]"></span>
                <span>● ${safetyRatingText}</span>
              </span>
              <span class="text-[11px] text-[#BDDDFC]/80 font-mono font-medium">${getTranslation('high_yield_zone', language)}</span>
            </div>
            <span class="font-extrabold text-sm sm:text-base text-white tracking-tight block leading-snug">${localizedSpotName}</span>
            <span class="text-xs text-[#BDDDFC]/70 font-medium leading-tight block mt-0.5">${getTranslation('isro_marine_observation', language)}</span>
          </div>

          <!-- Catch Potential -->
          <div class="mb-3.5 pt-2.5 border-t border-[#384959]/60">
            <div class="flex items-baseline justify-between mb-1.5">
              <div>
                <span class="font-bold text-xs text-white block leading-tight">${getTranslation('catch_potential', language)}</span>
                <span class="text-[10px] text-[#BDDDFC]/70 leading-tight">${getTranslation('rf_ml_model', language)}</span>
              </div>
              <span class="text-3xl font-extrabold text-[#88BDF2] font-mono leading-none tracking-tight">
                ${suitabilityScore}%
              </span>
            </div>
            <div class="w-full h-2.5 bg-[#12161f] border border-[#384959] rounded-full overflow-hidden mt-1.5 mb-1.5">
              <div class="h-full bg-gradient-to-r from-[#6A89A7] via-[#88BDF2] to-[#BDDDFC] rounded-full transition-all duration-500" style="width: ${suitabilityScore}%"></div>
            </div>
            <div class="flex items-center justify-between text-xs font-medium text-[#BDDDFC]">
              <span><strong class="text-white font-bold">${suitabilityScore}%</strong> ${getTranslation('predicted_catch', language)}</span>
              <span><strong class="text-white font-bold">${pfz.model_confidence_pct ?? 92}%</strong> ${getTranslation('confidence', language)}</span>
            </div>
          </div>

          <!-- 2 Modular Metric Sub-Cards -->
          <div class="grid grid-cols-2 gap-2.5 mb-3.5">
            <div class="p-3 rounded-2xl bg-[#12161f] border border-[#384959] flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-1.5 text-xs font-bold text-[#BDDDFC] mb-1.5">
                  <span>🌡️</span>
                  <span>${getTranslation('sst_thermal', language)}</span>
                </div>
                <div class="w-full h-1.5 bg-[#1a222f] rounded-full overflow-hidden mb-2">
                  <div class="h-full bg-[#88BDF2] rounded-full" style="width: 78%"></div>
                </div>
                <div class="flex items-baseline justify-between">
                  <span class="text-base font-bold text-white font-mono">${pfz.sst_c}°C</span>
                  <span class="text-xs font-bold text-[#88BDF2]">${getTranslation('optimal', language)}</span>
                </div>
              </div>
              <div class="flex items-end justify-between mt-2 pt-1.5 border-t border-[#384959]/50">
                <div>
                  <span class="text-xs text-[#BDDDFC]/70 uppercase block font-semibold">${getTranslation('front', language)}</span>
                  <span class="text-xs sm:text-sm font-bold text-white">ΔT 0.45°C</span>
                </div>
                <span class="text-[#88BDF2] text-xs font-bold">ılıll</span>
              </div>
            </div>

            <div class="p-3 rounded-2xl bg-[#12161f] border border-[#384959] flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-1.5 text-xs font-bold text-[#BDDDFC] mb-1.5">
                  <span>🌿</span>
                  <span>${getTranslation('chlorophyll', language)}</span>
                </div>
                <div class="w-full h-1.5 bg-[#1a222f] rounded-full overflow-hidden mb-2">
                  <div class="h-full bg-[#88BDF2] rounded-full" style="width: 84%"></div>
                </div>
                <div class="flex items-baseline justify-between">
                  <span class="text-base font-bold text-white font-mono">${pfz.chlorophyll_mg_m3}</span>
                  <span class="text-xs font-bold text-[#88BDF2]">mg/m³</span>
                </div>
              </div>
              <div class="flex items-end justify-between mt-2 pt-1.5 border-t border-[#384959]/50">
                <div>
                  <span class="text-xs text-[#BDDDFC]/70 uppercase block font-semibold">${getTranslation('plume', language)}</span>
                  <span class="text-xs sm:text-sm font-bold text-white">${getTranslation('upwelling', language)}</span>
                </div>
                <span class="text-[#88BDF2] text-xs font-bold">ılıll</span>
              </div>
            </div>
          </div>

          <!-- Coordinates and Telemetry Bar -->
          <div class="p-3 rounded-2xl bg-[#12161f] border border-[#384959] text-xs font-mono text-[#BDDDFC] mb-3.5 flex items-center justify-between">
            <div>
              <span class="text-[#BDDDFC]/70 block text-xs uppercase font-semibold">${getTranslation('target_fix', language)}</span>
              <span class="font-bold text-white text-xs sm:text-sm">${pfz.location.latitude.toFixed(4)}°N, ${pfz.location.longitude.toFixed(4)}°E</span>
            </div>
            <div class="text-right">
              <span class="text-[#BDDDFC]/70 block text-xs uppercase font-semibold">${getTranslation('distance_heading', language)}</span>
              <span class="font-bold text-[#88BDF2] text-xs sm:text-sm">${pfz.distance_km} km · ${pfz.bearing_compass} (${pfz.bearing_deg}°)</span>
            </div>
          </div>
        `;

        const navBtn = document.createElement('button');
        navBtn.className = 'w-full py-3 px-4 bg-[#88BDF2] hover:bg-[#BDDDFC] text-[#0f141d] font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer';
        navBtn.innerHTML = `<span>${getTranslation('navigate_here', language)}</span>`;
        navBtn.onclick = () => {
          openRouteForPFZ(pfz);
          setIsRouteDrawerOpen(true);
          if (activePopupRef.current) activePopupRef.current.remove();
        };
        popupDiv.appendChild(navBtn);

        const popup = new maplibregl.Popup({
          maxWidth: '360px',
          className: 'premium-maplibre-popup',
          closeButton: true,
          closeOnClick: false,
          offset: [0, -14],
          anchor: 'bottom'
        })
          .setLngLat([pfz.location.longitude, pfz.location.latitude])
          .setDOMContent(popupDiv)
          .addTo(map);

        popup.on('close', () => {
          activePopupRef.current = null;
        });

        activePopupRef.current = popup;
      };

      const marker = new maplibregl.Marker({ element: markerEl, anchor: 'center' })
        .setLngLat([pfz.location.longitude, pfz.location.latitude])
        .addTo(map);

      pfzMarkersRef.current.push(marker);
    });

    // Auto-fit to activeLocation and spots if no route active
    if (!routeComparison && filtered.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      bounds.extend([activeLocation.longitude, activeLocation.latitude]);
      filtered.forEach((p) => bounds.extend([p.location.longitude, p.location.latitude]));
      map.fitBounds(bounds, { padding: 90, maxZoom: 12, duration: 1000 });
    }
  }, [pfzs, activeMapLayers, searchQuery, activeLocation.latitude, activeLocation.longitude, routeComparison, language]);

  // 6. Update Geofences (IMBL, MPAs, Restricted Zones)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapLoaded) return;

    api.getGeofences().then((geofences) => {
      const imblSource = map.getSource('imbl-source') as maplibregl.GeoJSONSource;
      if (imblSource && activeMapLayers.includes('imbl') && geofences.imbl) {
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
      if (mpaSource && activeMapLayers.includes('mpas') && geofences.marine_protected_areas) {
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
      if (rzSource && activeMapLayers.includes('restricted') && geofences.restricted_zones) {
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
    }).catch(err => console.warn('Geofences fetch error:', err));
  }, [activeMapLayers, isMapLoaded]);

  // 7. Update Navigation Route (Eurostat searoute Corridor & Shortest Rhumb)
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

    const shortestCoords = routeComparison.shortest_route.waypoints.map(w => [w.longitude, w.latitude]);
    const safeCoords = routeComparison.safe_route.waypoints.map(w => [w.longitude, w.latitude]);

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
    safeCoords.forEach(c => bounds.extend(c as [number, number]));
    shortestCoords.forEach(c => bounds.extend(c as [number, number]));
    map.fitBounds(bounds, { padding: 90, duration: 1200 });
  }, [routeComparison, isMapLoaded]);

  // 8. NavIC & LoRaWAN Mesh Peer-to-Peer Relay Effect
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapLoaded) return;

    // Clear old mesh markers
    meshMarkersRef.current.forEach(m => m.remove());
    meshMarkersRef.current = [];

    const meshSource = map.getSource('navic-mesh-lines-source') as maplibregl.GeoJSONSource;

    if (!isNavicMeshActive) {
      if (meshSource) {
        meshSource.setData({ type: 'FeatureCollection', features: [] });
      }
      return;
    }

    // 3 Simulated peer vessels near active location for P2P mesh demo
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

    // GeoJSON lines connecting active user vessel to peer vessels and between peers
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
          geometry: {
            type: 'LineString',
            coordinates: coords
          },
          properties: { id: `mesh-link-${i}` }
        }))
      });
    }

    // Create DOM markers for peer vessels
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

      el.onclick = () => {
        if (activePopupRef.current) activePopupRef.current.remove();

        const pDiv = document.createElement('div');
        pDiv.className = 'p-3.5 bg-[#0f141d] border border-cyan-500/50 rounded-2xl text-white font-mono text-xs shadow-2xl';
        pDiv.innerHTML = `
          <div class="flex items-center justify-between pb-2 border-b border-[#384959] mb-2.5">
            <div>
              <span class="font-bold text-cyan-300 text-sm">${v.name}</span>
              <span class="text-xs text-slate-400 block">${v.type}</span>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              Mesh Relay Active
            </span>
          </div>

          <div class="space-y-1.5 text-xs text-[#BDDDFC]">
            <div class="flex justify-between">
              <span class="text-slate-400">Vessel Reg ID:</span>
              <span class="font-bold text-white">${v.id}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">NavIC Constellation:</span>
              <span class="font-bold text-amber-300">🛰️ ${v.sats} Sats (L5/S)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">LoRa 868MHz RSSI:</span>
              <span class="font-bold text-cyan-300">${v.rssi} dBm (SNR +9.2dB)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Mesh Forwarding:</span>
              <span class="font-bold text-emerald-400">Hop ${v.hop} of 3 → Shore Gateway</span>
            </div>
          </div>

          <div class="mt-2.5 pt-2 border-t border-[#384959] text-[10px] text-[#88BDF2] flex items-center justify-between">
            <span>Zero-4G Offshore Peer-to-Peer</span>
            <span class="text-emerald-400 font-bold">100% Offline</span>
          </div>
        `;

        const popup = new maplibregl.Popup({
          maxWidth: '320px',
          closeButton: true,
          closeOnClick: false,
          offset: [0, -12]
        })
          .setLngLat([v.lng, v.lat])
          .setDOMContent(pDiv)
          .addTo(map);

        activePopupRef.current = popup;
      };

      const m = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([v.lng, v.lat])
        .addTo(map);

      meshMarkersRef.current.push(m);
    });

  }, [isNavicMeshActive, isMapLoaded, activeLocation.latitude, activeLocation.longitude]);

  // Zoom and Camera Controls
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

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#090d18]">
      {/* MapLibre GL Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Top Nav / Search Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#88BDF2]" />
            <input
              type="text"
              placeholder="Search nautical zones, safe harbors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-64 sm:w-80 rounded-2xl bg-[#161c27]/90 backdrop-blur-md border border-[#384959] text-white placeholder-[#BDDDFC]/50 text-xs font-medium focus:outline-none focus:border-[#88BDF2] shadow-xl"
            />
          </div>

          {/* OpenSeaMap Toggle */}
          <button
            onClick={() => setIsOpenSeaMapActive(!isOpenSeaMapActive)}
            className={`px-3 py-2.5 rounded-2xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xl cursor-pointer ${
              isOpenSeaMapActive
                ? 'bg-[#1E2632] border-[#88BDF2] text-[#88BDF2]'
                : 'bg-[#161c27]/90 border-[#384959] text-[#BDDDFC]/70 hover:text-white'
            }`}
            title="Toggle Official OpenSeaMap Seamarks (Buoys, Beacons, Lighthouses, Fairways)"
          >
            <Anchor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">OpenSeaMap</span>
            <span className={`text-[10px] px-1 rounded ${isOpenSeaMapActive ? 'bg-[#88BDF2]/20 text-[#88BDF2]' : 'text-slate-500'}`}>
              {isOpenSeaMapActive ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* NavIC / LoRaWAN Mesh Toggle */}
          <button
            onClick={() => setIsNavicMeshActive(!isNavicMeshActive)}
            className={`px-3.5 py-2 rounded-2xl border text-xs sm:text-sm font-sans font-semibold flex items-center gap-1.5 transition-all shadow-xl cursor-pointer ${
              isNavicMeshActive
                ? 'bg-[#1E2632] border-[#88BDF2] text-[#88BDF2] shadow-[0_0_12px_rgba(136,189,242,0.25)]'
                : 'bg-[#161c27]/90 border-[#384959] text-[#BDDDFC]/70 hover:text-white'
            }`}
            title="Toggle NavIC Positioning & Peer-to-Peer LoRaWAN Vessel Mesh"
          >
            <Radio className={`w-4 h-4 ${isNavicMeshActive ? 'text-[#88BDF2] animate-pulse' : ''}`} />
            <span className="hidden sm:inline">NavIC Mesh</span>
            <span className={`text-xs px-1.5 py-0.2 rounded font-bold ${isNavicMeshActive ? 'bg-[#88BDF2]/20 text-[#88BDF2]' : 'text-slate-500'}`}>
              {isNavicMeshActive ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* 3D / 2D Perspective Toggle Button */}
          <button
            onClick={toggle3DMode}
            className={`px-3.5 py-2 rounded-2xl border text-xs sm:text-sm font-sans font-semibold flex items-center gap-1.5 transition-all shadow-xl cursor-pointer ${
              is3DMode
                ? 'bg-[#1E2632] border-[#88BDF2] text-[#88BDF2]'
                : 'bg-[#161c27]/90 border-[#384959] text-[#BDDDFC]/70 hover:text-white'
            }`}
            title="Switch between 3D Nautical Perspective and 2D Plan View"
          >
            <Box className="w-4 h-4" />
            <span>{is3DMode ? '3D View' : '2D Plan'}</span>
          </button>
        </div>

        {/* Departure Coordinate Badge */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#1E2632]/95 backdrop-blur-md border border-[#384959] shadow-xl pointer-events-auto font-sans">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0474c4] animate-pulse" />
          <span className="text-xs sm:text-sm text-white font-semibold">{getLocalizedPortName(activeLocationName, language)}</span>
          <span className="text-xs text-[#BDDDFC]/70 font-mono">
            {activeLocation.latitude.toFixed(4)}°N, {activeLocation.longitude.toFixed(4)}°E
          </span>
        </div>
      </div>

      {/* ── Marine Map NavIC Legend (Bottom Left) - Sleek UI matching other elements ── */}
      <div className="absolute left-4 bottom-8 z-20 pointer-events-auto max-w-xs sm:max-w-sm p-4 rounded-2xl bg-[#1E2632]/95 backdrop-blur-md border border-[#384959] shadow-2xl text-xs sm:text-sm font-sans transition-all">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#384959] mb-2.5 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Radio className="w-4 h-4 text-[#88BDF2] flex-shrink-0" />
            <span className="font-bold text-white text-xs sm:text-sm truncate">
              {getTranslation('nautical_mesh_title', language)}
            </span>
          </div>
          <span className="text-xs font-semibold text-[#88BDF2] bg-[#384959] px-2.5 py-0.5 rounded-full border border-[#88BDF2]/40 whitespace-nowrap">
            {getTranslation('navic_constellation_label', language)}
          </span>
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-[#BDDDFC]">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#0474C4] border-2 border-white shadow-sm flex-shrink-0"></span>
            <span className="text-white font-medium">{getTranslation('active_vessel_fix', language)}</span>
          </div>
          {isNavicMeshActive && (
            <>
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#88BDF2] flex-shrink-0"></span>
                <span>{getTranslation('peer_fleet_relays', language)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-0.5 border-b-2 border-dashed border-[#88BDF2] flex-shrink-0"></span>
                <span>{getTranslation('lora_mesh_links', language)}</span>
              </div>
            </>
          )}
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#384959] text-xs text-amber-300 font-medium leading-relaxed">
          {getTranslation('navic_legend_footnote', language)}
        </div>
      </div>

      {/* Floating Map Action Controls (Right Side) */}
      <div className="absolute right-4 bottom-8 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-2xl bg-[#161c27]/95 border border-[#384959] text-[#BDDDFC] hover:text-white hover:border-[#88BDF2] flex items-center justify-center shadow-2xl transition-all cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-2xl bg-[#161c27]/95 border border-[#384959] text-[#BDDDFC] hover:text-white hover:border-[#88BDF2] flex items-center justify-center shadow-2xl transition-all cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleRecenter}
          className="w-10 h-10 rounded-2xl bg-[#161c27]/95 border border-[#384959] text-[#BDDDFC] hover:text-white hover:border-[#88BDF2] flex items-center justify-center shadow-2xl transition-all cursor-pointer"
          title="Center Vessel Position"
        >
          <Crosshair className="w-4 h-4 text-[#88BDF2]" />
        </button>
        <button
          onClick={handleResetNorth}
          className="w-10 h-10 rounded-2xl bg-[#161c27]/95 border border-[#384959] text-[#BDDDFC] hover:text-white hover:border-[#88BDF2] flex items-center justify-center shadow-2xl transition-all cursor-pointer"
          title="Reset Heading & North"
        >
          <Compass className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      {/* Slide-out Route Navigation Plan Panel */}
      {isRouteDrawerOpen && (
        <div className="absolute inset-y-0 right-0 z-30 w-full sm:w-[580px] md:w-[640px] lg:w-[680px] shadow-2xl">
          <RoutePlannerPanel />
        </div>
      )}
    </div>
  );
};
