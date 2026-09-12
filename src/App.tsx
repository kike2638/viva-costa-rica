import React, { useState, useEffect, lazy, Suspense } from 'react';
import { 
  Building2, Phone, Mail, Compass, HelpCircle, CheckCircle, 
  ChevronRight, ArrowRight, Star, RefreshCcw, Home as HomeIcon, MapPin, FileText, AlertCircle, MessageCircle 
} from 'lucide-react';
import { Property, SearchFilters } from './types';
import { getProperties, getLastPropertiesError, isAppwriteConfigured } from './lib/appwrite';
import Navbar from './components/Navbar';
import PropertyFilters from './components/PropertyFilters';
import PropertyCard from './components/PropertyCard';

// Vistas y modales pesados se cargan solo cuando se usan (menos datos en el celular).
const PropertyDetails = lazy(() => import('./components/PropertyDetails'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const CommercialProposalModal = lazy(() => import('./components/CommercialProposalModal'));

function ViewLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
    </div>
  );
}

export default function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [currentView, setView] = useState<'catalog' | 'details' | 'admin'>('catalog');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isProposalOpen, setIsProposalOpen] = useState(false);

  // Filtros de búsqueda
  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: '',
    property_type: '',
    transaction_type: '',
    rental_period: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });

  // Cargar propiedades de Appwrite Cloud
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await getProperties();
      setProperties(data);
      setDataError(getLastPropertiesError());
      
      // Comprobar si hay un ID en la URL para abrir la propiedad directamente (?id=MAG-1001 o ?property=MAG-1001)
      const urlParams = new URLSearchParams(window.location.search);
      const targetId = urlParams.get('id') || urlParams.get('property') || urlParams.get('ref');
      
      if (targetId) {
        const found = data.find(p => p.id.toLowerCase() === targetId.toLowerCase());
        if (found) {
          setSelectedProperty(found);
          setView('details');
        }
      }
    } catch (e) {
      console.error('Error al cargar propiedades:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();

    // Manejar el botón 'Atrás' / 'Adelante' del navegador
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const targetId = urlParams.get('id') || urlParams.get('property');
      if (targetId && properties.length > 0) {
        const found = properties.find(p => p.id.toLowerCase() === targetId.toLowerCase());
        if (found) {
          setSelectedProperty(found);
          setView('details');
          return;
        }
      }
      if (!targetId) {
        setView('catalog');
        setSelectedProperty(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Refrescar datos al volver a esta pestaña/ventana (para que los cambios hechos
  // desde otro dispositivo se reflejen sin recargar manualmente la página).
  useEffect(() => {
    const refreshOnReturn = () => {
      if (document.visibilityState === 'visible' && currentView !== 'admin') {
        fetchProperties();
      }
    };
    window.addEventListener('focus', refreshOnReturn);
    document.addEventListener('visibilitychange', refreshOnReturn);
    return () => {
      window.removeEventListener('focus', refreshOnReturn);
      document.removeEventListener('visibilitychange', refreshOnReturn);
    };
  });

  // Extraer ubicaciones únicas para rellenar el dropdown de filtros
  const uniqueLocations: string[] = Array.from(
    new Set(properties.map((p) => p.location).filter(Boolean))
  ) as string[];

  // Filtrar las propiedades en base a la selección del usuario
  const filteredProperties = properties.filter((property) => {
    // 1. Filtro por palabra clave (título, descripción o ID de referencia único)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase().trim();
      const matchTitle = property.title?.toLowerCase().includes(query);
      const matchDesc = property.description?.toLowerCase().includes(query);
      const matchId = property.id?.toLowerCase().includes(query);
      const matchLocation = property.location?.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchId && !matchLocation) return false;
    }

    // 2. Filtro por tipo de propiedad
    if (filters.property_type && property.property_type !== filters.property_type) {
      return false;
    }

    // 3. Filtro por tipo de transacción (venta o alquiler)
    if (filters.transaction_type && property.transaction_type !== filters.transaction_type) {
      return false;
    }

    // 3.5. Filtro por modalidad de alquiler (mes o día)
    if (filters.rental_period && property.transaction_type === 'alquiler') {
      const currentPeriod = property.rental_period || 'mes';
      if (currentPeriod !== filters.rental_period) {
        return false;
      }
    }

    // 4. Filtro por ubicación
    if (filters.location && property.location !== filters.location) {
      return false;
    }

    // 5. Filtro por precio mínimo
    if (filters.minPrice && property.price < Number(filters.minPrice)) {
      return false;
    }

    // 6. Filtro por precio máximo
    if (filters.maxPrice && property.price > Number(filters.maxPrice)) {
      return false;
    }

    // 7. Filtro por habitaciones
    if (filters.bedrooms && property.bedrooms < Number(filters.bedrooms)) {
      return false;
    }

    // 8. Filtro por plantas / niveles
    if (filters.floors && (property.floors || 1) < Number(filters.floors)) {
      return false;
    }

    return true;
  });

  // Propiedades destacadas para mostrar en un grid destacado inicial
  const featuredProperties = properties.filter((p) => p.featured && p.status === 'disponible');

  // Navegar a los detalles de una propiedad
  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setView('details');
    // Actualizar URL limpia sin recargar la página
    const newUrl = `${window.location.pathname}?id=${encodeURIComponent(property.id)}`;
    window.history.pushState({ id: property.id }, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Volver al catálogo y limpiar parámetro URL
  const handleBackToCatalog = () => {
    setView('catalog');
    setSelectedProperty(null);
    window.history.pushState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Botón CTA para vender propiedad con WhatsApp preestablecido
  const handleSellCTA = () => {
    const phoneNumber = '50660027000';
    const message = 'Hola Viva Costa Rica, tengo interés en agendar una asesoría para promocionar y vender mi propiedad con ustedes. ¿Me podrían indicar los requisitos?';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50/50 text-stone-800 flex flex-col font-sans" id="VIVA-app">
      {/* Barra de Navegación superior */}
      <Navbar 
        currentView={currentView} 
        setView={setView} 
      />

      {/* Contenido Principal con transiciones de vista manuales */}
      <main className="flex-grow">
        {currentView === 'catalog' && (
            <div id="catalog-view">
            
            {/* Aviso si Appwrite no responde (muestra por qué el catálogo podría estar vacío) */}
            {dataError && (
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-sm">
                  <div className="flex items-start gap-2.5 text-amber-900">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold">No se pudo conectar con el servidor de propiedades.</p>
                      <p className="text-xs text-amber-800 mt-0.5">{dataError}</p>
                    </div>
                  </div>
                  <button
                    onClick={fetchProperties}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Reintentar
                  </button>
                </div>
              </div>
            )}
            
            {/* SECCIÓN HERO EDITORIAL DE PRESTIGIO */}
            <section className="relative overflow-hidden bg-stone-900 text-stone-100 py-16 sm:py-24" id="hero-section">
              {/* Overlay decorativo de textura sutil */}
              <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1.5px)] [background-size:16px_16px] opacity-15"></div>
              
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 px-3.5 py-1 text-xs font-semibold tracking-wider text-amber-400 uppercase mb-5">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>Excelencia Inmobiliaria</span>
                </div>
                
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl text-white">
                  Encuentra tu próximo hogar con la seguridad de un <span className="text-amber-400">Líder</span>
                </h1>
                
                <p className="mt-5 text-sm sm:text-lg text-stone-300 max-w-2xl font-medium leading-relaxed">
                  Viva Costa Rica ofrece un portafolio selecto de casas de lujo, departamentos ejecutivos y terrenos comerciales con absoluta certeza legal y plusvalía garantizada.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                  <a
                    href="#properties-catalog"
                    className="rounded-xl bg-amber-600 hover:bg-amber-700 px-6 py-3 text-sm font-bold text-white shadow-md transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>Ver Catálogo Completo</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <button
                    onClick={handleSellCTA}
                    className="rounded-xl border border-stone-700 hover:border-stone-500 bg-stone-800 hover:bg-stone-850 px-6 py-3 text-sm font-bold text-stone-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Phone className="h-4 w-4 text-amber-400" />
                    <span>Asesoría de Venta</span>
                  </button>
                </div>
              </div>
            </section>

            {/* CONTENEDOR DEL CATÁLOGO E INTERACCIÓN */}
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" id="properties-catalog">
              
              {/* Sección de Propiedades Destacadas (Sólo si existen) */}
              {featuredProperties.length > 0 && !filters.searchQuery && !filters.property_type && !filters.transaction_type && !filters.location && (
                <section className="mb-12" id="featured-section">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="h-1 w-8 rounded bg-amber-600"></span>
                    <h2 className="text-lg sm:text-xl font-black text-stone-950 uppercase tracking-wider">
                      Propiedades Destacadas
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {featuredProperties.slice(0, 3).map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onSelect={handleSelectProperty}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* SECCIÓN DE FILTROS Y GRID GENERAL */}
              <section className="mt-4" id="main-listings-section">
                <div className="flex items-center gap-2 mb-6">
                  <span className="h-1 w-8 rounded bg-stone-900"></span>
                  <h2 className="text-lg sm:text-xl font-black text-stone-950 uppercase tracking-wider">
                    Catálogo de Propiedades
                  </h2>
                </div>

                {/* Filtros avanzados */}
                <PropertyFilters
                  filters={filters}
                  setFilters={setFilters}
                  locations={uniqueLocations}
                />

                {/* Grid General */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-stone-200">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
                    <p className="mt-4 text-xs font-semibold text-stone-500">Cargando portafolio de VIVA...</p>
                  </div>
                ) : filteredProperties.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-stone-200" id="no-results-card">
                    <HelpCircle className="h-12 w-12 text-stone-300 mb-3" />
                    <h3 className="text-base font-bold text-stone-800">No se encontraron propiedades</h3>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm">
                      Ningún inmueble coincide con tus criterios de filtrado actuales. Intenta cambiar de ubicación o ampliar el rango de precio.
                    </p>
                    <button
                      onClick={() => setFilters({
                        searchQuery: '',
                        property_type: '',
                        transaction_type: '',
                        location: '',
                        minPrice: '',
                        maxPrice: '',
                        bedrooms: '',
                      })}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-stone-100 hover:bg-stone-200 px-4 py-2 text-xs font-bold text-stone-700 transition-colors cursor-pointer border border-stone-200"
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                      <span>Limpiar todos los filtros</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Indicador de número de resultados */}
                    <div className="flex items-center justify-between mb-4 px-1">
                      <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                        Mostrando {filteredProperties.length} propiedades encontradas
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {filteredProperties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          onSelect={handleSelectProperty}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* SECCIÓN INSTITUCIONAL Y CTA "VENDER CON NOSOTROS" */}
              <section className="mt-20 border-t border-stone-200 pt-16" id="institutional-section">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs">
                  <div className="lg:col-span-7 space-y-5">
                    <span className="inline-flex items-center rounded-full bg-stone-900 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-stone-100">
                      VIVA Real Estate
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-stone-950 leading-tight">
                      ¿Deseas vender o rentar tu propiedad de manera ágil?
                    </h2>
                    <p className="text-sm sm:text-base text-stone-500 leading-relaxed font-medium">
                      En Viva Costa Rica diseñamos estrategias de marketing digital personalizadas para maximizar la visibilidad de tu inmueble. Brindamos asesoría integral que cubre avalúos comerciales, gestiones notariales y filtrado riguroso de prospectos para garantizar cierres 100% seguros.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-2">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-stone-900 uppercase">Valuación y Avalúo Profesional</h4>
                          <p className="text-[11px] text-stone-500">Estudios de mercado y peritajes certificados (servicio profesional con costo según tipo y extensión de propiedad).</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-stone-900 uppercase">Promoción de Alto Impacto</h4>
                          <p className="text-[11px] text-stone-500">Fotografía profesional, recorridos en video y campañas digitales.</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSellCTA}
                      className="rounded-xl bg-stone-950 hover:bg-stone-850 px-6 h-12 text-sm font-bold text-white shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                      id="btn-institutional-cta"
                    >
                      <span>Aprende cómo vender tu propiedad con nosotros</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="lg:col-span-5 relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-stone-200">
                    <img
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                      alt="Negociación Inmobiliaria"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-stone-950/20"></div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        )}

        {/* VISTA FICHA DE LA PROPIEDAD */}
        {currentView === 'details' && selectedProperty && (
          <Suspense fallback={<ViewLoader />}>
            <PropertyDetails
              property={selectedProperty}
              onBack={handleBackToCatalog}
            />
          </Suspense>
        )}

        {/* VISTA PANEL DE CONTROL ADMINISTRATIVO */}
        {currentView === 'admin' && (
          <Suspense fallback={<ViewLoader />}>
            <AdminPanel
              properties={properties}
              onRefresh={fetchProperties}
              onSelectProperty={handleSelectProperty}
              onOpenProposal={() => setIsProposalOpen(true)}
            />
          </Suspense>
        )}
      </main>

      {/* MODAL DE PROPUESTA COMERCIAL DESCARGABLE & IMPRIMIBLE */}
      {isProposalOpen && (
        <Suspense fallback={null}>
          <CommercialProposalModal
            isOpen={isProposalOpen}
            onClose={() => setIsProposalOpen(false)}
          />
        </Suspense>
      )}

      {/* PIE DE PÁGINA (FOOTER) */}
      <footer className="bg-stone-950 text-stone-400 border-t border-stone-800 mt-20" id="VIVA-footer">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-stone-800 pb-10">
            {/* Branding */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-800 text-stone-100 border border-stone-700">
                  <Building2 className="h-5 w-5 text-amber-400" />
                </div>
                <div className="text-left">
                  <span className="block text-base font-black tracking-tight text-white leading-none">VIVA</span>
                  <span className="block text-[9px] font-bold tracking-widest text-amber-500 uppercase leading-none mt-0.5">Bienes Raíces</span>
                </div>
              </div>
              <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
                Asesoría inmobiliaria de élite especializada en la comercialización de residencias premium, desarrollos residenciales y espacios comerciales de vanguardia.
              </p>
            </div>

            {/* Enlaces de interés */}
            <div className="md:col-span-3 space-y-3.5">
              <h4 className="text-[10px] font-black uppercase text-stone-200 tracking-wider">Menú del Catálogo</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => { setView('catalog'); setFilters(prev => ({ ...prev, property_type: 'casa' })); }} className="hover:text-amber-400 transition-colors cursor-pointer"> Casas en Venta </button>
                </li>
                <li>
                  <button onClick={() => { setView('catalog'); setFilters(prev => ({ ...prev, property_type: 'apartamento' })); }} className="hover:text-amber-400 transition-colors cursor-pointer"> Departamentos en Renta </button>
                </li>
                <li>
                  <button onClick={() => { setView('catalog'); setFilters(prev => ({ ...prev, property_type: 'lote' })); }} className="hover:text-amber-400 transition-colors cursor-pointer"> Terrenos de Inversión </button>
                </li>
                <li>
                  <button onClick={() => { setView('catalog'); setFilters(prev => ({ ...prev, property_type: '' })); }} className="hover:text-amber-400 transition-colors cursor-pointer"> Todos los Inmuebles </button>
                </li>
              </ul>
            </div>

            {/* Contacto directo */}
            <div className="md:col-span-4 space-y-3.5">
              <h4 className="text-[10px] font-black uppercase text-stone-200 tracking-wider">Atención Directa</h4>
              <p className="text-xs leading-relaxed text-stone-400 font-medium">
                ¿Tienes alguna consulta o deseas agendar una visita?<br />
                Email: <a href="mailto:VIVAbr.cr@gmail.com?subject=Consulta%20General%20VIVA%20Bienes%20Ra%C3%ADces" className="text-amber-400 font-bold hover:underline">VIVAbr.cr@gmail.com</a>
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1.5">
                <a
                  href="https://wa.me/50660027000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700/10 border border-emerald-600/30 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-600/20 transition-all cursor-pointer"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>WhatsApp: +506 60027000</span>
                </a>
                <a
                  href="mailto:VIVAbr.cr@gmail.com?subject=Consulta%20General%20VIVA%20Bienes%20Ra%C3%ADces"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Enviar Correo</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-stone-500 font-medium">
            <p>© 2026 Viva Costa Rica. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <span className="hover:text-stone-300 transition-colors cursor-pointer">Aviso de Privacidad</span>
              <span>•</span>
              <span className="hover:text-stone-300 transition-colors cursor-pointer">Términos y Condiciones</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Botón flotante de WhatsApp (siempre visible en móvil y escritorio) */}
      {currentView !== 'admin' && (
        <a
          href="https://wa.me/50660027000?text=Hola%20VIVA%20Bienes%20Ra%C3%ADces%2C%20me%20interesa%20una%20propiedad."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white pl-4 pr-5 py-3 text-sm font-bold shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 cursor-pointer"
          aria-label="Contactar por WhatsApp"
          id="floating-whatsapp-btn"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      )}
    </div>
  );
}

