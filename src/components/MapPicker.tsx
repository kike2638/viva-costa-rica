import React, { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPickerProps {
  latitude: number;
  longitude: number;
  mapType: 'm' | 'k';
  zoom: number;
  onPick: (latitude: number, longitude: number) => void;
  onZoomChange?: (zoom: number) => void;
}

const PIN_ICON_HTML = `<div style="background:transparent;border:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45))"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 24 24" fill="#d97706" stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#d97706" stroke-width="1.6"/></svg></div>`;

export const MapPicker: React.FC<MapPickerProps> = ({
  latitude,
  longitude,
  mapType,
  zoom,
  onPick,
  onZoomChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([latitude, longitude], zoom);

    const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    });
    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19,
      }
    );

    (mapType === 'k' ? satellite : streets).addTo(map);
    (map as any)._VIVALayers = { streets, satellite };

    const icon = L.divIcon({
      className: 'VIVA-map-pin',
      html: PIN_ICON_HTML,
      iconSize: [36, 46],
      iconAnchor: [18, 46],
      popupAnchor: [0, -46],
    });

    const marker = L.marker([latitude, longitude], { icon, draggable: true }).addTo(map);
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onPick(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
    });
    markerRef.current = marker;

    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      onPick(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
    });

    map.on('zoomend', () => {
      onZoomChange?.(map.getZoom());
    });

    mapRef.current = map;

    const timer = window.setTimeout(() => map.invalidateSize(), 150);

    return () => {
      window.clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    const current = markerRef.current.getLatLng();
    if (
      Math.abs(current.lat - latitude) > 1e-6 ||
      Math.abs(current.lng - longitude) > 1e-6
    ) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapRef.current.setView([latitude, longitude], mapRef.current.getZoom());
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (!mapRef.current) return;
    const layers = (mapRef.current as any)._VIVALayers as {
      streets: L.TileLayer;
      satellite: L.TileLayer;
    };
    const target = mapType === 'k' ? layers.satellite : layers.streets;
    const current = mapType === 'k' ? layers.streets : layers.satellite;
    if (mapRef.current.hasLayer(current)) mapRef.current.removeLayer(current);
    if (!mapRef.current.hasLayer(target)) mapRef.current.addLayer(target);
  }, [mapType]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapRef.current.getZoom() !== zoom) {
      mapRef.current.setZoom(zoom);
    }
  }, [zoom]);

  return <div ref={containerRef} className="w-full h-full z-0" />;
};

export default MapPicker;

