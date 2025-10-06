import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  marker?: [number, number] | null;
  onLocationSelect?: (lat: number, lon: number) => void;
  onZoomChange?: (zoom: number) => void;
}

export const MapView = ({ center, zoom = 4, marker, onLocationSelect, onZoomChange }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const currentZoomRef = useRef<number>(zoom);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Track zoom changes
    map.on('zoomend', () => {
      const newZoom = map.getZoom();
      currentZoomRef.current = newZoom;
      if (onZoomChange) {
        onZoomChange(newZoom);
      }
    });

    // Add click event listener
    if (onLocationSelect) {
      map.on('click', (e) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onLocationSelect]);

  // Update map view when center changes, but preserve current zoom unless explicitly changed
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      // Use current zoom if zoom prop hasn't changed, otherwise use the new zoom
      const targetZoom = zoom === currentZoomRef.current ? currentZoomRef.current : zoom;
      mapInstanceRef.current.setView(center, targetZoom, { animate: true });
    }
  }, [center, zoom]);

  // Update marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // Add new marker if position provided
    if (marker) {
      const newMarker = L.marker(marker).addTo(mapInstanceRef.current);
      markerRef.current = newMarker;
    }
  }, [marker]);

  return (
    <div 
      ref={mapRef} 
      style={{ height: '100%', width: '100%' }} 
      className="rounded-lg"
    />
  );
};
