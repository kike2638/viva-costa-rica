import React, { useState } from 'react';
import { MapPin, Navigation, Search, Check, X, ExternalLink, HelpCircle } from 'lucide-react';
import MapPicker from './MapPicker';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (data: { latitude: number; longitude: number; mapLink: string; locationText?: string }) => void;
  initialLatitude?: number;
  initialLongitude?: number;
  initialLocationText?: string;
  initialMapLink?: string;
}

// Ubicaciones de referencia en Costa Rica para acceso rápido
const PRESET_REGIONS = [
  { name: 'San José Centro', lat: 9.9333, lng: -84.0833 },
  { name: 'Escazú / Santa Ana', lat: 9.9189, lng: -84.1386 },
  { name: 'Heredia', lat: 10.0024, lng: -84.1165 },
  { name: 'Alajuela', lat: 10.0163, lng: -84.2116 },
  { name: 'Cartago', lat: 9.8644, lng: -83.9194 },
  { name: 'Pérez Zeledón', lat: 9.3736, lng: -83.7058 },
  { name: 'Jaco / Garabito', lat: 9.6150, lng: -84.6297 },
  { name: 'Manuel Antonio / Quepos', lat: 9.3900, lng: -84.1480 },
  { name: 'Tamarindo / Guanacaste', lat: 10.2993, lng: -85.8400 },
  { name: 'La Fortuna / San Carlos', lat: 10.4717, lng: -84.6450 },
  { name: 'Limón / Puerto Viejo', lat: 9.6560, lng: -82.7538 },
];

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  initialLatitude,
  initialLongitude,
  initialLocationText = '',
  initialMapLink = '',
}) => {
  const [lat, setLat] = useState<number>(initialLatitude || 9.9333);
  const [lng, setLng] = useState<number>(initialLongitude || -84.0833);
  const [mapType, setMapType] = useState<'m' | 'k'>('m'); // 'm' normal, 'k' satélite
  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const [searchQuery, setSearchQuery] = useState<string>(initialLocationText);
  const [pasteLinkInput, setPasteLinkInput] = useState<string>(initialMapLink);
  const [pasteFeedback, setPasteFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // Extraer coordenadas de enlaces o texto pegado de Google Maps
  const handleParseGoogleMapsLink = (input: string) => {
    setPasteLinkInput(input);
    if (!input.trim()) return;

    // Patrón 1: Coordenadas directas "9.9333, -84.0833" o "9.9333 -84.0833"
    const coordDirectMatch = input.match(/(-?\d+\.\d+)[\s,]+(-?\d+\.\d+)/);
    
    // Patrón 2: URL de Google Maps con @lat,lng,zoom (ej. https://www.google.com/maps/@9.9348,-84.0875,15z)
    const urlAtMatch = input.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

    // Patrón 3: URL con q=lat,lng o destination=lat,lng o ll=lat,lng
    const urlQueryMatch = input.match(/[?&](?:q|destination|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);

    let parsedLat: number | null = null;
    let parsedLng: number | null = null;

    if (urlAtMatch) {
      parsedLat = parseFloat(urlAtMatch[1]);
      parsedLng = parseFloat(urlAtMatch[2]);
    } else if (urlQueryMatch) {
      parsedLat = parseFloat(urlQueryMatch[1]);
      parsedLng = parseFloat(urlQueryMatch[2]);
    } else if (coordDirectMatch) {
      parsedLat = parseFloat(coordDirectMatch[1]);
      parsedLng = parseFloat(coordDirectMatch[2]);
    }

    if (parsedLat !== null && parsedLng !== null && !isNaN(parsedLat) && !isNaN(parsedLng)) {
      setLat(parsedLat);
      setLng(parsedLng);
      setPasteFeedback(`¡Coordenadas detectadas! (${parsedLat.toFixed(5)}, ${parsedLng.toFixed(5)})`);
      setTimeout(() => setPasteFeedback(null), 4000);
    } else {
      setPasteFeedback('Enlace guardado. Si es enlace corto (maps.app.goo.gl), se usará directamente para navegación del cliente.');
      setTimeout(() => setPasteFeedback(null), 5000);
    }
  };

  // Usar GPS actual del dispositivo
  const handleUseCurrentGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setZoomLevel(16);
          setPasteFeedback(`GPS obtenido con precisión: ±${Math.round(position.coords.accuracy)} metros`);
          setTimeout(() => setPasteFeedback(null), 3000);
        },
        () => {
          alert('No se pudo obtener la ubicación GPS actual. Verifica los permisos de tu navegador.');
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización.');
    }
  };

  // Aplicar selección y guardar
  const handleConfirm = () => {
    const finalMapLink = pasteLinkInput.trim() || `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    onSelectLocation({
      latitude: Number(lat),
      longitude: Number(lng),
      mapLink: finalMapLink,
      locationText: searchQuery.trim() || undefined,
    });
    onClose();
  };

  // Abrir Google Maps oficial en otra pestaña
  const openExternalGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-sm flex justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl my-auto border border-stone-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                Seleccionar Ubicación Exacta en Google Maps
              </h3>
              <p className="text-xs text-stone-500">
                Permite a los clientes ver el mapa satelital y presionar "Cómo llegar" directamente hacia el inmueble con Google Maps o Waze.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Opción Rápida: Pegar link de Google Maps o Coordenadas */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-600" />
                Opción Rápida: Pega enlace de Google Maps, Waze o Coordenadas
              </label>
              <button
                type="button"
                onClick={openExternalGoogleMaps}
                className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 underline cursor-pointer"
              >
                Abrir Google Maps Web <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={pasteLinkInput}
                onChange={(e) => handleParseGoogleMapsLink(e.target.value)}
                placeholder="Ejemplo: https://maps.app.goo.gl/... o pega coordenadas: 9.9333, -84.0833"
                className="flex-1 px-3.5 py-2 bg-white rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono text-stone-800"
              />
              <button
                type="button"
                onClick={handleUseCurrentGPS}
                className="px-3 py-2 bg-white hover:bg-amber-100 border border-amber-300 text-amber-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm cursor-pointer"
                title="Tomar ubicación GPS actual de este dispositivo"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-600" />
                Mi GPS
              </button>
            </div>

            {pasteFeedback && (
              <p className="text-xs font-semibold text-emerald-700 mt-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                ✓ {pasteFeedback}
              </p>
            )}
          </div>

          {/* Selector rápido de zonas de Costa Rica */}
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
              Accesos rápidos por región:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_REGIONS.map((region) => (
                <button
                  key={region.name}
                  type="button"
                  onClick={() => {
                    setLat(region.lat);
                    setLng(region.lng);
                    setZoomLevel(14);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    Math.abs(lat - region.lat) < 0.01 && Math.abs(lng - region.lng) < 0.01
                      ? 'bg-amber-600 text-white border-amber-600 font-bold'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
          </div>

          {/* Ajuste fino de coordenadas numéricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs">
            <div>
              <label className="block text-stone-600 font-semibold mb-1">Latitud (°N)</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-stone-600 font-semibold mb-1">Longitud (°O)</label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-stone-600 font-semibold mb-1">Capa Visual</label>
              <div className="flex bg-white rounded-lg border border-stone-200 p-0.5">
                <button
                  type="button"
                  onClick={() => setMapType('m')}
                  className={`flex-1 py-1 rounded text-center font-medium cursor-pointer ${mapType === 'm' ? 'bg-amber-600 text-white font-bold' : 'text-stone-600'}`}
                >
                  Mapa
                </button>
                <button
                  type="button"
                  onClick={() => setMapType('k')}
                  className={`flex-1 py-1 rounded text-center font-medium cursor-pointer ${mapType === 'k' ? 'bg-amber-600 text-white font-bold' : 'text-stone-600'}`}
                >
                  Satélite
                </button>
              </div>
            </div>
            <div>
              <label className="block text-stone-600 font-semibold mb-1">Zoom ({zoomLevel})</label>
              <input
                type="range"
                min="10"
                max="19"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                className="w-full accent-amber-600 mt-1"
              />
            </div>
          </div>

          {/* Mapa interactivo: haz clic o arrastra el marcador para elegir el punto exacto */}
          <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md bg-stone-100 z-0">
            <MapPicker
              latitude={lat}
              longitude={lng}
              mapType={mapType}
              zoom={zoomLevel}
              onPick={(newLat, newLng) => {
                setLat(newLat);
                setLng(newLng);
              }}
              onZoomChange={setZoomLevel}
            />

            {/* Overlay indicador central */}
            <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Punto Seleccionado: <strong className="font-mono text-amber-300">{lat.toFixed(5)}, {lng.toFixed(5)}</strong></span>
            </div>
          </div>

          <div className="text-[11px] text-stone-500 flex items-start gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
            <span>
              <strong>Haz clic o arrastra el marcador</strong> directamente sobre el mapa para marcar el punto exacto del inmueble, o usa las opciones rápidas de arriba. Cuando guardes, el cliente verá el botón <strong>"Cómo llegar"</strong> (Google Maps / Waze) con ruta automática en tiempo real.
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-800 text-sm font-semibold hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Confirmar y Asignar Ubicación
          </button>
        </div>

      </div>
    </div>
  );
};

export default LocationPickerModal;
