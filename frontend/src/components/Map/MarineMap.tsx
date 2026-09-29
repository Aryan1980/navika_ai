import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Search, Plus, Minus, Crosshair, Navigation, X } from 'lucide-react';
import { PFZZone } from '../../types/marine';

export const MarineMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});

  const [searchQuery, setSearchQuery] = useState('');

  const {
    activeLocation,
    activeLocationName,
    activeMapLayers,
    pfzs,
    selectedPFZForRoute,
    routeComparison,
    routeToPFZ,
    clearRoute
  } = useApp();

  // 1. Initialize Leaflet Map with High-Resolution Satellite Basemap
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    delete (mapContainerRef.current as any)._leaflet_id;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [activeLocation.latitude, activeLocation.longitude],
        zoom: 11,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false
      });

      // High-Resolution Seamless Satellite Basemap (Google Hybrid: Satellite + Coastlines & Marine Landmarks)
      L.tileLayer(
        'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 18,
          maxNativeZoom: 18,
          keepBuffer: 6,
          updateWhenIdle: false,
          attribution: '&copy; Google Satellite'
        }
      ).addTo(map);

      // Initialize LayerGroups
      const layers = ['vessel', 'simulated_vessel', 'pfz', 'sst', 'chlorophyll', 'waves', 'wind', 'imbl', 'mpas', 'restricted', 'route'];
      layers.forEach((id) => {
        const group = L.layerGroup().addTo(map);
        layerGroupsRef.current[id] = group;
      });

      mapInstanceRef.current = map;
    } catch (err) {
      console.error('Leaflet initialization notice:', err);
    }

    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch (err) {
        console.warn('Leaflet cleanup notice:', err);
      }
      if (mapContainerRef.current) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }
    };
  }, []);

  // Invalidate map size on container resize or layout shifts
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. Fit bounds when activeLocation changes or spots load (if no active route)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // If an active route is being displayed, let the route effect control framing
    if (routeComparison) return;

    if (pfzs.length > 0) {
      const bounds = L.latLngBounds([
        [activeLocation.latitude, activeLocation.longitude],
        ...pfzs.map((p) => [p.location.latitude, p.location.longitude] as [number, number])
      ]);
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 12
      });
    } else {
      mapInstanceRef.current.setView([activeLocation.latitude, activeLocation.longitude], 11, {
        animate: true
      });
    }
  }, [activeLocation.latitude, activeLocation.longitude, pfzs]);

  // 3. Render Departure Port / Vessel Marker (ONLY a clean Blue Dot)
  useEffect(() => {
    const group = layerGroupsRef.current['vessel'];
    if (!group) return;
    group.clearLayers();

    // Subtle outer beacon pulse circle
    const outerHalo = L.circle([activeLocation.latitude, activeLocation.longitude], {
      radius: 600,
      color: '#0474c4',
      weight: 1,
      fillColor: '#0474c4',
      fillOpacity: 0.18,
      interactive: false
    });
    group.addLayer(outerHalo);

    // Single distinct Blue Dot marker
    const blueDot = L.circleMarker([activeLocation.latitude, activeLocation.longitude], {
      radius: 8,
      fillColor: '#0474C4',
      color: '#ffffff',
      weight: 2.5,
      fillOpacity: 1
    }).bindTooltip(`Departure Fix: ${activeLocationName}`, {
      permanent: false,
      direction: 'top',
      className: 'font-mono text-xs'
    });

    group.addLayer(blueDot);
  }, [activeLocation.latitude, activeLocation.longitude, activeLocationName]);

  // 3b. Render Simulated Vessel Track (AIS IND-8421)
  useEffect(() => {
    const group = layerGroupsRef.current['simulated_vessel'];
    if (!group) return;
    group.clearLayers();

    if (!activeMapLayers.includes('simulated_vessel')) return;

    // Seaward track vector from activeLocation heading ~240°
    const startLat = activeLocation.latitude - 0.04;
    const startLon = activeLocation.longitude - 0.07;
    const currentLat = activeLocation.latitude - 0.09;
    const currentLon = activeLocation.longitude - 0.14;

    // Breadcrumb trail
    const breadcrumb = L.polyline([
      [activeLocation.latitude, activeLocation.longitude],
      [startLat, startLon],
      [currentLat, currentLon]
    ], {
      color: '#f59e0b',
      weight: 2.5,
      dashArray: '5, 8',
      opacity: 0.85
    });
    group.addLayer(breadcrumb);

    // Simulated Boat Marker
    const boatIcon = L.divIcon({
      className: 'simulated-vessel-marker',
      html: `
        <div style="transform: rotate(240deg); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: rgba(245, 158, 11, 0.25); border: 2px solid #f59e0b; border-radius: 50%; box-shadow: 0 0 14px rgba(245, 158, 11, 0.6);">
          <span style="font-size: 14px;">⛵</span>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const vesselMarker = L.marker([currentLat, currentLon], { icon: boatIcon })
      .bindTooltip(`
        <div style="font-family: monospace; font-size: 11px; padding: 2px 4px;">
          <div style="font-weight: bold; color: #f59e0b;">SIMULATED VESSEL (AIS ID: IND-8421)</div>
          <div>Course: 240° WSW | Speed: 8.2 knots</div>
          <div>Status: Underway using engine</div>
        </div>
      `, { permanent: false, direction: 'top' });

    group.addLayer(vesselMarker);
  }, [activeLocation.latitude, activeLocation.longitude, activeMapLayers]);

  // 4. Render Spot Markers (ONLY Clean Green Dots - Clicking shows info)
  useEffect(() => {
    const group = layerGroupsRef.current['pfz'];
    const map = mapInstanceRef.current;
    if (!group || !map) return;
    group.clearLayers();

    if (!activeMapLayers.includes('pfz')) return;

    const filtered = pfzs.filter((p) =>
      searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.recommendation.toLowerCase().includes(searchQuery.toLowerCase()) : true
    );

    filtered.forEach((pfz) => {
      const isSafe = pfz.safety_rating === 'SAFE';
      const isCaution = pfz.safety_rating === 'CAUTION';
      const dotColor = isSafe ? '#10b981' : isCaution ? '#f59e0b' : '#f43f5e';
      const haloColor = isSafe ? '#10b981' : isCaution ? '#f59e0b' : '#f43f5e';

      // Subtle outer radar beacon ring
      const outerHalo = L.circle([pfz.location.latitude, pfz.location.longitude], {
        radius: isSafe ? 700 : 550,
        color: haloColor,
        weight: 1,
        fillColor: haloColor,
        fillOpacity: isSafe ? 0.2 : 0.14,
        interactive: false
      });
      group.addLayer(outerHalo);

      // Distinct Spot Marker
      const spotDot = L.circleMarker([pfz.location.latitude, pfz.location.longitude], {
        radius: 8.5,
        fillColor: dotColor,
        color: '#ffffff',
        weight: 2,
        fillOpacity: 0.98
      });

      // Hover Tooltip for instant awareness
      spotDot.bindTooltip(
        `<div style="font-family: monospace; font-size: 11px; padding: 2px 4px;"><b>${pfz.name}</b><br/><span style="color: ${isSafe ? '#34d399' : '#fbbf24'}; font-weight: bold;">● ${pfz.safety_rating} ZONE</span> (${pfz.distance_km} km · ${pfz.bearing_compass})</div>`,
        { permanent: false, direction: 'top', opacity: 0.95 }
      );

      // Clicking opens the info popup
      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-3.5 text-[#f1f5fb] font-sans w-[280px] bg-[#181e2e]/98 backdrop-blur-xl rounded-2xl border border-[#5379AE]/40 shadow-2xl relative select-none';
      popupDiv.innerHTML = `
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-[#5379AE]/25 pr-6">
          <span class="font-bold text-sm text-white truncate max-w-[190px]">${pfz.name}</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
            isSafe
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : isCaution
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }">
            ${pfz.safety_rating}
          </span>
        </div>

        <div class="bg-[#121622] p-2.5 rounded-xl border border-[#5379AE]/25 mb-2">
          <div class="flex items-center justify-between text-[10px] font-mono text-[#A8C4EC]/70 mb-1">
            <span>TARGET GPS FIX</span>
            <span class="${isSafe ? 'text-emerald-400' : 'text-amber-400'} font-semibold">● ${isSafe ? 'Verified Safe' : 'Caution Advised'}</span>
          </div>
          <div class="font-mono text-xs font-bold text-white tracking-wider">
            ${pfz.location.latitude.toFixed(4)}°N, ${pfz.location.longitude.toFixed(4)}°E
          </div>
        </div>

        <div class="grid grid-cols-2 gap-1.5 mb-2 text-xs font-mono bg-[#121622] p-2 rounded-xl border border-[#5379AE]/20">
          <div>
            <span class="text-[#5379AE] block text-[9px]">DISTANCE</span>
            <span class="text-white font-semibold">${pfz.distance_km} km</span>
          </div>
          <div>
            <span class="text-[#5379AE] block text-[9px]">BEARING</span>
            <span class="text-[#0474C4] font-semibold">${pfz.bearing_compass} (${pfz.bearing_deg}°)</span>
          </div>
          <div>
            <span class="text-[#5379AE] block text-[9px]">SST FRONT</span>
            <span class="text-amber-300 font-semibold">${pfz.sst_c}°C</span>
          </div>
          <div>
            <span class="text-[#5379AE] block text-[9px]">CHLOROPHYLL</span>
            <span class="text-emerald-400 font-semibold">${pfz.chlorophyll_mg_m3} mg/m³</span>
          </div>
        </div>

        <div class="bg-[#121622]/90 p-2 rounded-xl border border-[#5379AE]/20 text-[10px] mb-2.5 space-y-1">
          <div class="${isSafe ? 'text-emerald-400' : 'text-amber-400'} font-bold font-mono text-[9px] uppercase tracking-wider flex items-center gap-1">
            <span>🛡️ ${isSafe ? 'Certified Safe Fishing Zone' : 'Moderate Transit Advisory'}</span>
          </div>
          <p class="text-[#A8C4EC]/90 leading-tight">
            ${pfz.recommendation}
          </p>
          <p class="text-amber-300/85 leading-tight text-[9px]">
            Sovereign IMBL clearance verified (>100 km buffer). Maintain heading ${pfz.bearing_deg}°.
          </p>
        </div>
      `;

      // Button row: Copy Coordinates & Center
      const btnRow = document.createElement('div');
      btnRow.className = 'grid grid-cols-2 gap-1.5';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn-signature btn-signature-sm !py-2 !px-2 !text-[10px] cursor-pointer w-full text-center justify-center';
      copyBtn.innerHTML = '<span>Copy GPS</span>';
      copyBtn.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`${pfz.location.latitude.toFixed(4)}, ${pfz.location.longitude.toFixed(4)}`);
        copyBtn.innerHTML = '<span class="text-emerald-300 font-bold">✓ Copied!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = '<span>Copy GPS</span>';
        }, 1800);
      };

      const centerBtn = document.createElement('button');
      centerBtn.className = 'btn-signature btn-signature-sm !py-2 !px-2 !text-[10px] cursor-pointer w-full text-center justify-center';
      centerBtn.innerHTML = '<span>Inspect Fix</span>';
      centerBtn.onclick = () => {
        routeToPFZ(pfz);
        map.setView([pfz.location.latitude, pfz.location.longitude], 12, { animate: true });
        map.closePopup();
      };

      btnRow.appendChild(copyBtn);
      btnRow.appendChild(centerBtn);
      popupDiv.appendChild(btnRow);

      spotDot.bindPopup(popupDiv, { maxWidth: 300, minWidth: 260 });
      group.addLayer(spotDot);
    });
  }, [pfzs, activeMapLayers, searchQuery, routeToPFZ]);

  // 5. Render Ocean Geofences (IMBL, MPAs, Restricted)
  useEffect(() => {
    api.getGeofences().then((geofences) => {
      // IMBL
      const imblGroup = layerGroupsRef.current['imbl'];
      if (imblGroup) {
        imblGroup.clearLayers();
        if (activeMapLayers.includes('imbl') && geofences.imbl) {
          geofences.imbl.forEach((b: any) => {
            const line = L.polyline(b.coordinates, {
              color: '#f59e0b',
              weight: 2.5,
              dashArray: '6, 6'
            }).bindPopup(`
              <div class="p-2 text-slate-100 font-sans text-xs bg-[#090d18] rounded-lg">
                <strong class="text-amber-400 font-semibold">${b.name}</strong>
                <p class="text-[11px] text-slate-300 mt-1">${b.description}</p>
                <div class="mt-1.5 pt-1 border-t border-white/10 text-[10px] text-rose-400">
                  Buffer warning: ${b.buffer_warning_km} km
                </div>
              </div>
            `);
            imblGroup.addLayer(line);
          });
        }
      }

      // MPAs
      const mpaGroup = layerGroupsRef.current['mpas'];
      if (mpaGroup) {
        mpaGroup.clearLayers();
        if (activeMapLayers.includes('mpas') && geofences.marine_protected_areas) {
          geofences.marine_protected_areas.forEach((mpa: any) => {
            const poly = L.polygon(mpa.polygon, {
              color: '#f43f5e',
              fillColor: '#f43f5e',
              fillOpacity: 0.15,
              weight: 1.5
            }).bindTooltip(mpa.name, { permanent: false });
            mpaGroup.addLayer(poly);
          });
        }
      }

      // Restricted
      const resGroup = layerGroupsRef.current['restricted'];
      if (resGroup) {
        resGroup.clearLayers();
        if (activeMapLayers.includes('restricted') && geofences.restricted_zones) {
          geofences.restricted_zones.forEach((rz: any) => {
            const poly = L.polygon(rz.polygon, {
              color: '#a855f7',
              fillColor: '#a855f7',
              fillOpacity: 0.15,
              weight: 1.5
            }).bindTooltip(rz.name, { permanent: false });
            resGroup.addLayer(poly);
          });
        }
      }
    }).catch((err) => console.error('Geofence load error:', err));
  }, [activeMapLayers]);

  // 6. Render Environmental Overlays (SST & Chlorophyll)
  useEffect(() => {
    const sstGroup = layerGroupsRef.current['sst'];
    const chlGroup = layerGroupsRef.current['chlorophyll'];
    if (!sstGroup || !chlGroup) return;

    sstGroup.clearLayers();
    chlGroup.clearLayers();

    const lat = activeLocation.latitude;
    const lon = activeLocation.longitude;

    if (sstGroup && activeMapLayers.includes('sst')) {
      const sstCircle = L.circle([lat - 0.05, lon - 0.18], {
        radius: 25000,
        color: '#f59e0b',
        fillColor: '#fbbf24',
        fillOpacity: 0.12,
        weight: 1.5
      }).bindTooltip('SST Thermal Gradient (28.4°C)', { permanent: false });
      sstGroup.addLayer(sstCircle);
    }

    if (chlGroup && activeMapLayers.includes('chlorophyll')) {
      const chlCircle = L.circle([lat - 0.08, lon - 0.24], {
        radius: 20000,
        color: '#10b981',
        fillColor: '#059669',
        fillOpacity: 0.18,
        weight: 1.5
      }).bindTooltip('Chlorophyll Bloom Core (3.4 mg/m³)', { permanent: false });
      chlGroup.addLayer(chlCircle);
    }
  }, [activeLocation.latitude, activeLocation.longitude, activeMapLayers]);

  // 7. Auto-Frame Target Spot & Departure Port (No Arbitrary Straight Line Polylines)
  useEffect(() => {
    const routeGroup = layerGroupsRef.current['route'];
    const map = mapInstanceRef.current;
    if (!routeGroup) return;
    routeGroup.clearLayers();

    if (!selectedPFZForRoute || !map) return;

    // Highlight target spot with a distinct pulsing outer beacon
    const targetBeacon = L.circleMarker([selectedPFZForRoute.location.latitude, selectedPFZForRoute.location.longitude], {
      radius: 14,
      color: '#34d399',
      weight: 2,
      dashArray: '3, 4',
      fillOpacity: 0.15,
      fillColor: '#34d399'
    });
    routeGroup.addLayer(targetBeacon);

    // Frame camera smoothly between departure port and target spot
    const bounds = L.latLngBounds([
      [activeLocation.latitude, activeLocation.longitude],
      [selectedPFZForRoute.location.latitude, selectedPFZForRoute.location.longitude]
    ]);
    map.fitBounds(bounds, { padding: [80, 80], maxZoom: 12, animate: true });
  }, [selectedPFZForRoute, activeLocation.latitude, activeLocation.longitude]);

  // Zoom helpers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => {
    mapInstanceRef.current?.setView([activeLocation.latitude, activeLocation.longitude], 11, {
      animate: true
    });
  };

  return (
    <div className="relative w-full h-full min-h-[560px] overflow-hidden bg-[#151926] font-sans">
      
      {/* ── Active Target HUD (Displayed when a spot is being inspected) ── */}
      {selectedPFZForRoute && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3 bg-[#181e2e]/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-[#5379AE]/40 shadow-2xl text-xs font-mono animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-bold">{selectedPFZForRoute.name}:</span>
            <span className="text-emerald-300 font-semibold">{selectedPFZForRoute.location.latitude.toFixed(4)}°N, {selectedPFZForRoute.location.longitude.toFixed(4)}°E</span>
            <span className="text-[#A8C4EC]">({selectedPFZForRoute.distance_km} km · Heading {selectedPFZForRoute.bearing_compass})</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] border border-emerald-500/30">Corridors Clear</span>
          </div>
          <button
            onClick={clearRoute}
            className="flex items-center gap-1 text-[#e59883] hover:text-white px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-xs transition-colors cursor-pointer border border-rose-500/20"
          >
            <X className="w-3 h-3" />
            <span>Dismiss</span>
          </button>
        </div>
      )}

      {/* ── Top Floating Search Pill on Satellite ── */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 bg-[#181e2e]/90 backdrop-blur-xl px-3.5 py-2 rounded-xl border border-[#5379AE]/35 text-xs shadow-2xl w-72">
          <Search className="w-4 h-4 text-[#0474C4]" />
          <input
            type="text"
            placeholder="Filter spots by species or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-[#f1f5fb] placeholder-[#8fa2bf] text-xs w-full font-normal"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#A8C4EC] hover:text-white text-xs cursor-pointer">✕</button>
          )}
        </div>
      </div>

      {/* ── Bottom-Left Operational Stats Pill ── */}
      <div className="absolute bottom-6 left-6 z-[400] bg-[#181e2e]/90 backdrop-blur-xl px-4 py-2.5 rounded-xl border border-[#5379AE]/35 text-xs font-mono shadow-2xl space-y-1 pointer-events-none hidden sm:block">
        <div className="flex items-center gap-4 text-[#A8C4EC]">
          <span className="text-[#5379AE] text-xs">Identified Spots:</span>
          <span className="text-white font-bold">{pfzs.length} Active</span>
        </div>
        <div className="flex items-center gap-4 text-[#A8C4EC]">
          <span className="text-[#5379AE] text-xs">Green Dots:</span>
          <span className="text-emerald-400 font-bold">
            {pfzs.filter((p) => p.safety_rating === 'SAFE').length} Safe Zones
          </span>
        </div>
        {pfzs.some((p) => p.safety_rating === 'CAUTION') && (
          <div className="flex items-center gap-4 text-[#A8C4EC]">
            <span className="text-[#5379AE] text-xs">Amber Dots:</span>
            <span className="text-amber-400 font-bold">
              {pfzs.filter((p) => p.safety_rating === 'CAUTION').length} Caution Zones
            </span>
          </div>
        )}
        <div className="flex items-center gap-4 text-[#A8C4EC]">
          <span className="text-[#5379AE] text-xs">Blue Dot:</span>
          <span className="text-[#0474C4] font-bold">Port Fix</span>
        </div>
      </div>

      {/* ── Bottom-Right Floating Controls (Zoom & Recenter) ── */}
      <div className="absolute bottom-6 right-6 z-[400] flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={handleRecenter}
          className="w-9 h-9 rounded-xl bg-[#181e2e]/95 hover:bg-[#20273a] text-[#A8C4EC] hover:text-white border border-[#5379AE]/35 flex items-center justify-center shadow-2xl transition-colors cursor-pointer"
          title="Center Departure Harbor"
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-xl bg-[#181e2e]/95 hover:bg-[#20273a] text-[#A8C4EC] hover:text-white border border-[#5379AE]/35 flex items-center justify-center text-sm font-bold shadow-2xl transition-colors cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-xl bg-[#181e2e]/95 hover:bg-[#20273a] text-[#A8C4EC] hover:text-white border border-[#5379AE]/35 flex items-center justify-center text-sm font-bold shadow-2xl transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Leaflet Satellite Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

    </div>
  );
};
