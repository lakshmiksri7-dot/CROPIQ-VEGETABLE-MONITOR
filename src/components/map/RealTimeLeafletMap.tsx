import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { UserGeoLocation } from '../../utils/locationUtils';

export interface StorageMapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  temp: number;
  humidity: number;
  solarBatteryPercent: number;
  backupHours: number;
  capacityKg: number;
  occupiedKg: number;
  status: 'optimal' | 'cooling' | 'warning';
  zone?: string;
}

export interface MandiMapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  currentPrice: number;
  trend: string;
  demand: string;
  distanceKm: number;
}

export interface VehicleMapMarker {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  lat: number;
  lng: number;
  destinationName: string;
  crop: string;
  reeferTemp: number;
  speedKmH: number;
  progressPercent: number;
  etaMinutes: number;
}

interface RealTimeLeafletMapProps {
  userLocation: UserGeoLocation;
  storageUnits: StorageMapMarker[];
  mandis: MandiMapMarker[];
  vehicles: VehicleMapMarker[];
  selectedUnitId?: string;
  selectedVehicleId?: string;
  onSelectUnit?: (id: string) => void;
  onSelectVehicle?: (id: string) => void;
  onSelectMandi?: (mandi: MandiMapMarker) => void;
  viewMode?: 'local' | 'transit';
  showRoutes?: boolean;
}

export const RealTimeLeafletMap: React.FC<RealTimeLeafletMapProps> = ({
  userLocation,
  storageUnits,
  mandis,
  vehicles,
  selectedUnitId,
  selectedVehicleId,
  onSelectUnit,
  onSelectVehicle,
  onSelectMandi,
  viewMode = 'local',
  showRoutes = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const routeGroupRef = useRef<L.LayerGroup | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapType, setMapType] = useState<'streets' | 'satellite' | 'terrain'>('streets');
  const [isAutoCentered, setIsAutoCentered] = useState<boolean>(true);
  const [filterLayer, setFilterLayer] = useState<'all' | 'storage' | 'mandis' | 'vehicles'>('all');

  // Tile layers definitions
  const tileUrls = {
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  };

  const attributions = {
    streets: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    terrain: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)'
  };

  // 1. Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.latitude, userLocation.longitude],
        zoom: 13,
        zoomControl: false,
        attributionControl: true
      });

      // Add Tile Layer
      const initialLayer = L.tileLayer(tileUrls[mapType], {
        attribution: attributions[mapType],
        maxZoom: 19
      }).addTo(map);
      tileLayerRef.current = initialLayer;

      // Add Layer Groups
      const routesGroup = L.layerGroup().addTo(map);
      const markersGroup = L.layerGroup().addTo(map);
      routeGroupRef.current = routesGroup;
      markersGroupRef.current = markersGroup;

      mapInstanceRef.current = map;

      // Handle user manual pan/zoom to disable auto-centering
      map.on('dragstart', () => {
        setIsAutoCentered(false);
      });
    }

    // Resize observer to prevent tile loading issues in tabs or resizing
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Handle Base Tile Layer change (Streets vs Satellite vs Terrain)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const newLayer = L.tileLayer(tileUrls[mapType], {
      attribution: attributions[mapType],
      maxZoom: 19
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [mapType]);

  // 3. Render Real-time Markers and Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    const routesGroup = routeGroupRef.current;

    if (!map || !markersGroup || !routesGroup) return;

    markersGroup.clearLayers();
    routesGroup.clearLayers();

    // ---------------- A. USER LIVE LOCATION PIN ----------------
    const userLat = userLocation.latitude;
    const userLng = userLocation.longitude;

    // Real GPS Accuracy Circle
    if (userLocation.accuracy && userLocation.accuracy > 0) {
      const circle = L.circle([userLat, userLng], {
        radius: Math.min(500, Math.max(20, userLocation.accuracy)),
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: '4, 4'
      });
      markersGroup.addLayer(circle);
      accuracyCircleRef.current = circle;
    }

    // Custom Live User HTML Marker
    const userIcon = L.divIcon({
      className: 'custom-live-user-marker',
      html: `
        <div class="relative flex flex-col items-center group -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          <div class="relative flex items-center justify-center">
            <span class="absolute -inset-2.5 rounded-full bg-emerald-500/40 animate-ping"></span>
            <div class="w-9 h-9 rounded-full bg-emerald-600 text-white border-2 border-white shadow-xl flex items-center justify-center">
              <span class="text-base">📍</span>
            </div>
          </div>
          <div class="mt-1 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-mono font-bold whitespace-nowrap shadow-lg border border-emerald-400 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>MY LIVE GPS</span>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const userMarker = L.marker([userLat, userLng], { icon: userIcon, zIndexOffset: 1000 });
    userMarker.bindPopup(`
      <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 200px;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
          <span style="background: #059669; color: white; border-radius: 6px; padding: 2px 6px; font-size: 10px; font-weight: bold;">LIVE GPS</span>
          <strong style="color: #0f172a; font-size: 13px;">Your Farm Location</strong>
        </div>
        <p style="margin: 0; font-size: 11px; color: #475569; line-height: 1.4;">${userLocation.address || 'Real GPS Coordinates'}</p>
        <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0; font-family: monospace; font-size: 10px; color: #64748b;">
          Lat: ${userLat.toFixed(5)}° • Lng: ${userLng.toFixed(5)}° (±${userLocation.accuracy}m)
        </div>
      </div>
    `);
    markersGroup.addLayer(userMarker);

    // ---------------- B. COLD STORAGE HUBS ----------------
    if (filterLayer === 'all' || filterLayer === 'storage') {
      storageUnits.forEach((unit) => {
        const isSelected = unit.id === selectedUnitId;
        const storageIcon = L.divIcon({
          className: `custom-storage-marker ${isSelected ? 'selected' : ''}`,
          html: `
            <div class="relative flex flex-col items-center group -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform ${
              isSelected ? 'scale-110 z-50' : 'hover:scale-105'
            }">
              <div class="relative flex items-center justify-center">
                <div class="w-8 h-8 rounded-xl ${
                  isSelected ? 'bg-emerald-600 ring-4 ring-emerald-300' : 'bg-white border-2 border-emerald-600'
                } ${isSelected ? 'text-white' : 'text-emerald-800'} shadow-lg flex items-center justify-center font-bold text-xs">
                  ❄️
                </div>
                <span class="absolute -top-1.5 -right-2 px-1 py-0.2 bg-emerald-700 text-white rounded text-[8px] font-mono font-bold shadow-xs">
                  ${unit.temp}°C
                </span>
              </div>
              <div class="mt-0.5 px-2 py-0.5 rounded-md bg-white/95 text-slate-900 border border-emerald-300 text-[9px] font-mono font-bold whitespace-nowrap shadow-sm">
                ${unit.name.split('(')[0].trim()}
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        const sMarker = L.marker([unit.lat, unit.lng], { icon: storageIcon, zIndexOffset: isSelected ? 800 : 500 });
        sMarker.on('click', () => {
          if (onSelectUnit) onSelectUnit(unit.id);
        });

        sMarker.bindPopup(`
          <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 210px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <strong style="color: #065f46; font-size: 13px;">${unit.name}</strong>
              <span style="background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; border-radius: 4px; padding: 1px 5px; font-size: 10px; font-weight: bold;">
                ${unit.status.toUpperCase()}
              </span>
            </div>
            <div style="font-size: 11px; color: #334155; line-height: 1.5; margin-bottom: 6px;">
              <div>🌡️ Chamber: <strong>${unit.temp}°C</strong> | 💧 RH: <strong>${unit.humidity}%</strong></div>
              <div>⚡ Solar Battery: <strong>${unit.solarBatteryPercent}%</strong> (~${unit.backupHours}h backup)</div>
              <div>📦 Stored: <strong>${unit.occupiedKg} kg</strong> / ${unit.capacityKg} kg</div>
            </div>
            <button id="btn-select-storage-${unit.id}" style="width: 100%; background: #059669; color: white; border: none; border-radius: 6px; padding: 5px 8px; font-size: 11px; font-weight: bold; cursor: pointer;">
              Select & Monitor Storage
            </button>
          </div>
        `);

        sMarker.on('popupopen', () => {
          const btn = document.getElementById(`btn-select-storage-${unit.id}`);
          if (btn) {
            btn.onclick = () => {
              if (onSelectUnit) onSelectUnit(unit.id);
              sMarker.closePopup();
            };
          }
        });

        markersGroup.addLayer(sMarker);

        // Draw Route Line from user to selected storage unit
        if (showRoutes && isSelected) {
          const routePolyline = L.polyline(
            [
              [userLat, userLng],
              [unit.lat, unit.lng]
            ],
            {
              color: '#059669',
              weight: 4,
              opacity: 0.85,
              dashArray: '6, 8',
              lineCap: 'round'
            }
          );
          routesGroup.addLayer(routePolyline);
        }
      });
    }

    // ---------------- C. WHOLESALE MANDIS ----------------
    if (filterLayer === 'all' || filterLayer === 'mandis') {
      mandis.forEach((mandi) => {
        const mandiIcon = L.divIcon({
          className: 'custom-mandi-marker',
          html: `
            <div class="relative flex flex-col items-center group -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-105 transition-transform">
              <div class="w-8 h-8 rounded-xl bg-amber-500 text-white border-2 border-white shadow-md flex items-center justify-center font-bold text-xs">
                🏛️
              </div>
              <div class="mt-0.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-300 text-[9px] font-mono font-bold whitespace-nowrap shadow-sm">
                ${mandi.name.split(' ')[0]} • ₹${mandi.currentPrice}/kg
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        const mMarker = L.marker([mandi.lat, mandi.lng], { icon: mandiIcon, zIndexOffset: 400 });
        mMarker.on('click', () => {
          if (onSelectMandi) onSelectMandi(mandi);
        });

        mMarker.bindPopup(`
          <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 200px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <strong style="color: #92400e; font-size: 13px;">${mandi.name}</strong>
              <span style="background: #fef3c7; color: #b45309; border-radius: 4px; padding: 1px 5px; font-size: 10px; font-weight: bold;">
                ${mandi.trend}
              </span>
            </div>
            <div style="font-size: 11px; color: #334155; line-height: 1.5; margin-bottom: 6px;">
              <div>💰 Tomato Wholesale Price: <strong style="color: #059669; font-size: 13px;">₹${mandi.currentPrice}/kg</strong></div>
              <div>📈 Buyer Demand: <strong>${mandi.demand}</strong></div>
              <div>🚗 Distance from farm: <strong>${mandi.distanceKm.toFixed(1)} km</strong></div>
            </div>
          </div>
        `);

        markersGroup.addLayer(mMarker);
      });
    }

    // ---------------- D. LIVE MOVING REEFER VEHICLES ----------------
    if (filterLayer === 'all' || filterLayer === 'vehicles') {
      vehicles.forEach((veh) => {
        const isSelectedVeh = veh.id === selectedVehicleId;
        const vehicleIcon = L.divIcon({
          className: `custom-vehicle-marker ${isSelectedVeh ? 'selected' : ''}`,
          html: `
            <div class="relative flex flex-col items-center group -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform ${
              isSelectedVeh ? 'scale-115 z-50' : 'hover:scale-105'
            }">
              <div class="relative flex items-center justify-center">
                <span class="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping"></span>
                <div class="w-9 h-9 rounded-2xl bg-slate-900 text-white border-2 border-emerald-400 shadow-xl flex items-center justify-center">
                  <span class="text-sm">🚚</span>
                </div>
                <span class="absolute -top-1.5 -right-2 px-1 py-0.2 bg-emerald-600 text-white rounded text-[8px] font-mono font-bold shadow-xs">
                  ${veh.reeferTemp}°C
                </span>
              </div>
              <div class="mt-0.5 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[9px] font-mono whitespace-nowrap shadow-md border border-slate-700 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>${veh.vehicleNumber} • ${veh.etaMinutes}m</span>
              </div>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19]
        });

        const vMarker = L.marker([veh.lat, veh.lng], { icon: vehicleIcon, zIndexOffset: 700 });
        vMarker.on('click', () => {
          if (onSelectVehicle) onSelectVehicle(veh.id);
        });

        vMarker.bindPopup(`
          <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 210px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <strong style="color: #0f172a; font-size: 13px;">${veh.vehicleNumber}</strong>
              <span style="background: #ecfdf5; color: #047857; border-radius: 4px; padding: 1px 5px; font-size: 10px; font-weight: bold;">
                IN TRANSIT
              </span>
            </div>
            <div style="font-size: 11px; color: #334155; line-height: 1.5; margin-bottom: 6px;">
              <div>👤 Driver: <strong>${veh.driverName}</strong> (${veh.driverPhone})</div>
              <div>🥦 Produce: <strong>${veh.crop}</strong></div>
              <div>❄️ Internal Reefer Temp: <strong style="color: #059669;">${veh.reeferTemp}°C</strong></div>
              <div>⚡ Speed: <strong>${veh.speedKmH} km/h</strong> • ETA: <strong>${veh.etaMinutes} mins</strong></div>
              <div>🎯 Heading to: <strong>${veh.destinationName}</strong></div>
            </div>
          </div>
        `);

        markersGroup.addLayer(vMarker);
      });
    }

    // Auto-center map if enabled
    if (isAutoCentered) {
      map.panTo([userLat, userLng], { animate: true, duration: 0.5 });
    }
  }, [userLocation, storageUnits, mandis, vehicles, selectedUnitId, selectedVehicleId, filterLayer, showRoutes, isAutoCentered]);

  // Center on User GPS
  const handleRecenter = () => {
    setIsAutoCentered(true);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userLocation.latitude, userLocation.longitude], 14, {
        animate: true,
        duration: 1
      });
    }
  };

  // Zoom In / Out handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border-2 border-emerald-300 shadow-md">
      {/* 1. Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* 2. Top-Left: Map Style & Layer Filter Bar */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-slate-200">
        {/* Style switch */}
        <div className="flex items-center bg-slate-100 rounded-xl p-0.5 text-[11px] font-mono">
          <button
            onClick={() => setMapType('streets')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mapType === 'streets' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🗺️ Map
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mapType === 'satellite' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛰️ Satellite
          </button>
        </div>

        {/* Filter categories */}
        <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-0.5 text-[11px] font-mono">
          <button
            onClick={() => setFilterLayer('all')}
            className={`px-2 py-1 rounded-lg transition-all ${
              filterLayer === 'all' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterLayer('storage')}
            className={`px-2 py-1 rounded-lg transition-all ${
              filterLayer === 'storage' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ❄️ Storage
          </button>
          <button
            onClick={() => setFilterLayer('mandis')}
            className={`px-2 py-1 rounded-lg transition-all ${
              filterLayer === 'mandis' ? 'bg-amber-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏛️ Mandis
          </button>
          <button
            onClick={() => setFilterLayer('vehicles')}
            className={`px-2 py-1 rounded-lg transition-all ${
              filterLayer === 'vehicles' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🚚 Reefer
          </button>
        </div>
      </div>

      {/* 3. Top-Right: Live GPS Status Badge */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg border border-emerald-300">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-[11px] font-mono font-extrabold text-emerald-900">
          {userLocation.isLiveGps ? '🟢 LIVE GPS STREAM' : '📍 AGRI REGION'}
        </span>
      </div>

      {/* 4. Bottom-Right: Map Floating Action Controls */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col items-center gap-2">
        {/* Recenter to Live GPS button ⭐ */}
        <button
          onClick={handleRecenter}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-xl hover:bg-emerald-700 active:scale-95 transition-all border-2 border-white"
          title="Center map on my live GPS location"
        >
          <span className="material-symbols-outlined text-lg">my_location</span>
          <span className="hidden sm:inline">Center on My Location</span>
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:bg-slate-200 font-bold border-b border-slate-100 text-base"
            title="Zoom in"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:bg-slate-200 font-bold text-base"
            title="Zoom out"
          >
            -
          </button>
        </div>
      </div>

      {/* 5. Bottom-Left: Live Geographic Coordinates HUD */}
      <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-2xl shadow-xl border border-emerald-500/40 max-w-[280px] sm:max-w-xs">
        <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1 mb-1">
          <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold">
            Real GPS Fix
          </span>
          <span className="text-[9px] font-mono text-slate-300">
            ±{userLocation.accuracy}m accuracy
          </span>
        </div>
        <p className="text-xs font-bold text-slate-100 truncate">
          {userLocation.address || `${userLocation.latitude.toFixed(4)}°N, ${userLocation.longitude.toFixed(4)}°E`}
        </p>
        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-400">
          <span>{userLocation.latitude.toFixed(5)}°N</span>
          <span>•</span>
          <span>{userLocation.longitude.toFixed(5)}°E</span>
          {userLocation.speed !== null && userLocation.speed !== undefined && userLocation.speed > 0 && (
            <>
              <span>•</span>
              <span className="text-emerald-400">{userLocation.speed} km/h</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
