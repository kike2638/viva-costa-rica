import React, { useState, useEffect } from 'react';
import { 
  Lock, LayoutDashboard, Plus, Pencil, Trash2, X, Upload, Check, 
  AlertCircle, ShieldCheck, HelpCircle, Eye, EyeOff, RefreshCw, Star, CheckCircle, Globe, ExternalLink, Video, Play, Copy, Search, Hash, MapPin, Navigation, Compass, FileText, Printer, LogOut 
} from 'lucide-react';
import { Property, PropertyType, TransactionType, PropertyStatus, CurrencyType } from '../types';
import { saveProperty, deleteProperty, uploadPropertyImage, adminLogin, formatPropertyPrice, generateNextPropertyId } from '../lib/appwrite';
import LocationPickerModal from './LocationPickerModal';
import { handleImageError, FALLBACK_IMAGE } from '../lib/mediaUtils';

const DEFAULT_PRESET_FEATURES = [
  'Servicios de agua potable y drenaje instalados',
  'Acometida eléctrica de alta tensión lista',
  'Libre de gravamen y escrituración inmediata',
  'Accesos viales de asfalto / concreto hidráulico',
  'Zonificación autorizada y permisos al corriente',
  'Excelente conectividad y transporte cercano'
];

interface AdminPanelProps {
  properties: Property[];
  onRefresh: () => void;
  onSelectProperty: (property: Property) => void;
  onOpenProposal?: () => void;
}

export default function AdminPanel({ properties, onRefresh, onSelectProperty, onOpenProposal }: AdminPanelProps) {
  // Estado de autenticación (sesión guardada en sessionStorage, nunca en el bundle)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!sessionStorage.getItem('VIVA_admin_token'));
  const [adminToken, setAdminToken] = useState<string | null>(() => sessionStorage.getItem('VIVA_admin_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Filtro de búsqueda en la tabla de administración
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Estado del CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Estado del formulario
  const [propertyCustomId, setPropertyCustomId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [propertyType, setPropertyType] = useState<PropertyType>('casa');
  const [transactionType, setTransactionType] = useState<TransactionType>('venta');
  const [rentalPeriod, setRentalPeriod] = useState<'mes' | 'dia'>('mes');
  const [status, setStatus] = useState<PropertyStatus>('disponible');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [floors, setFloors] = useState('1');
  const [landArea, setLandArea] = useState('200');
  const [buildingArea, setBuildingArea] = useState('180');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [mapLink, setMapLink] = useState('');
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [virtualTourUrl, setVirtualTourUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(DEFAULT_PRESET_FEATURES);
  const [customFeatureInput, setCustomFeatureInput] = useState<string>('');
  
  // Estado de carga de archivos y compresión
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Manejar Login (valida contra el servidor, no contra datos del bundle)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const token = await adminLogin(email, password);
      sessionStorage.setItem('VIVA_admin_token', token);
      setAdminToken(token);
      setIsAuthenticated(true);
    } catch (err: any) {
      setLoginError(err.message || 'Credenciales incorrectas. Verifique el correo electrónico y la contraseña.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    sessionStorage.removeItem('VIVA_admin_token');
    setAdminToken(null);
    setIsAuthenticated(false);
  };

  // Copiar ID rápido
  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Abrir modal para agregar propiedad
  const handleOpenAddModal = () => {
    const nextId = generateNextPropertyId(properties);
    setIsEditing(false);
    setEditingId(null);
    setPropertyCustomId(nextId);
    setTitle('');
    setDescription('');
    setPrice('');
    setCurrency('USD');
    setPropertyType('casa');
    setTransactionType('venta');
    setRentalPeriod('mes');
    setStatus('disponible');
    setBedrooms('3');
    setBathrooms('2');
    setFloors('1');
    setLandArea('200');
    setBuildingArea('180');
    setLocation('');
    setLatitude(undefined);
    setLongitude(undefined);
    setMapLink('');
    setWebsiteUrl('');
    setVideoUrl('');
    setVirtualTourUrl('');
    setFeatured(false);
    setSelectedFeatures([...DEFAULT_PRESET_FEATURES]);
    setCustomFeatureInput('');
    setImageUrls([
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ]);
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  // Abrir modal para editar propiedad
  const handleOpenEditModal = (property: Property) => {
    setIsEditing(true);
    setEditingId(property.id);
    setPropertyCustomId(property.id);
    setTitle(property.title);
    setDescription(property.description);
    setPrice(property.price.toString());
    setCurrency(property.currency || 'USD');
    setPropertyType(property.property_type);
    setTransactionType(property.transaction_type);
    setRentalPeriod(property.rental_period || 'mes');
    setStatus(property.status);
    setBedrooms(property.bedrooms.toString());
    setBathrooms(property.bathrooms.toString());
    setFloors(property.floors ? property.floors.toString() : '1');
    setLandArea(property.land_area_sqm.toString());
    setBuildingArea(property.building_area_sqm.toString());
    setLocation(property.location);
    setLatitude(property.latitude);
    setLongitude(property.longitude);
    setMapLink(property.map_link || '');
    setWebsiteUrl(property.website_url || '');
    setVideoUrl(property.video_url || '');
    setVirtualTourUrl(property.virtual_tour_360_url || '');
    setFeatured(property.featured);
    setSelectedFeatures(property.features !== undefined ? property.features : [...DEFAULT_PRESET_FEATURES]);
    setCustomFeatureInput('');
    setImageUrls(property.images || []);
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  // Manejo de alternancia de características/servicios
  const handleToggleFeature = (featureText: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureText)
        ? prev.filter(f => f !== featureText)
        : [...prev, featureText]
    );
  };

  const handleAddCustomFeature = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customFeatureInput.trim();
    if (trimmed && !selectedFeatures.includes(trimmed)) {
      setSelectedFeatures(prev => [...prev, trimmed]);
      setCustomFeatureInput('');
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setSelectedFeatures(prev => prev.filter(f => f !== featureToRemove));
  };

  // Función para comprimir imágenes antes de subir
  const compressAndUploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      setUploadProgress('Comprimiendo imagen en el navegador...');
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_size = 1200; // Resolución máx óptima
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }

          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject('No se pudo obtener el contexto 2D del canvas');
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir a blob con calidad reducida (0.75) para ahorrar peso en base de datos o storage
          canvas.toBlob((blob) => {
            if (!blob) {
              reject('No se pudo generar el blob de la imagen');
              return;
            }
            
            // Re-convertir blob a un objeto File
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });

            setUploadProgress('Subiendo imagen optimizada...');
            uploadPropertyImage(compressedFile, adminToken)
              .then(url => {
                resolve(url);
              })
              .catch(err => {
                reject(err);
              });
          }, 'image/jpeg', 0.75);
        };
        img.onerror = () => {
          reject('Error al cargar la imagen en memoria');
        };
      };
      reader.onerror = () => {
        reject('Error al leer el archivo');
      };
    });
  };

  // Manejar subida de archivos (múltiple)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setFormError('');

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Procesando archivo ${i + 1} de ${files.length}...`);
        const url = await compressAndUploadImage(files[i]);
        uploadedUrls.push(url);
      }

      setImageUrls(prev => [...prev, ...uploadedUrls]);
      setFormSuccess('¡Imágenes subidas y optimizadas exitosamente!');
      setTimeout(() => setFormSuccess(''), 4000);
    } catch (err: any) {
      console.error(err);
      setFormError(`Error al procesar imágenes: ${err.message || err}`);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  // Eliminar imagen de la lista actual en el formulario
  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Guardar datos de propiedad (Agregar o Editar)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !location) {
      setFormError('Por favor complete los campos obligatorios: Título, Precio y Ubicación.');
      return;
    }

    try {
      const finalId = propertyCustomId.trim() || editingId || generateNextPropertyId(properties);
      
      const payload: Partial<Property> = {
        id: finalId,
        title,
        description,
        price: Number(price),
        currency,
        property_type: propertyType,
        transaction_type: transactionType,
        rental_period: transactionType === 'alquiler' ? rentalPeriod : 'mes',
        status,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        floors: Number(floors) || 1,
        land_area_sqm: Number(landArea),
        building_area_sqm: Number(buildingArea),
        location,
        latitude: latitude !== undefined ? Number(latitude) : undefined,
        longitude: longitude !== undefined ? Number(longitude) : undefined,
        map_link: mapLink.trim() || (latitude && longitude ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}` : undefined),
        website_url: websiteUrl.trim(),
        video_url: videoUrl.trim(),
        virtual_tour_360_url: virtualTourUrl.trim(),
        featured,
        features: selectedFeatures,
        images: imageUrls.length > 0 ? imageUrls : [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
        ]
      };

      await saveProperty(payload, adminToken);
      
      setFormSuccess(isEditing ? '¡Propiedad actualizada con éxito!' : '¡Nueva propiedad agregada con éxito!');
      onRefresh(); // Recargar datos
      
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess('');
      }, 1000);
    } catch (err: any) {
      setFormError(`Error al guardar la propiedad: ${err.message || err}`);
    }
  };

  // Eliminar Propiedad
  const handleDelete = async (id: string, propTitle: string) => {
    if (window.confirm(`¿Está seguro de que desea eliminar permanentemente la propiedad "${propTitle}"?`)) {
      try {
        const success = await deleteProperty(id, adminToken);
        if (success) {
          onRefresh();
        } else {
          alert('No se pudo eliminar la propiedad.');
        }
      } catch (err: any) {
        alert(`Error al eliminar: ${err.message || err}`);
      }
    }
  };

  // Cambio rápido de estado directamente en la tabla
  const handleQuickStatusChange = async (property: Property, newStatus: PropertyStatus) => {
    try {
      await saveProperty({
        id: property.id,
        status: newStatus
      }, adminToken);
      onRefresh();
    } catch (err: any) {
      alert(`Error al cambiar estado: ${err.message}`);
    }
  };

  // Cambio rápido de Destacado
  const handleQuickFeaturedToggle = async (property: Property) => {
    try {
      await saveProperty({
        id: property.id,
        featured: !property.featured
      }, adminToken);
      onRefresh();
    } catch (err: any) {
      alert(`Error al cambiar destacado: ${err.message}`);
    }
  };

  // Pantalla de Login si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16" id="admin-login-view">
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white p-8 shadow-md">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800 mb-3">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Viva Costa Rica</h2>
            <p className="text-xs text-stone-500 mt-1 font-semibold uppercase tracking-wider">Acceso Administrativo Privado</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-stone-600 uppercase">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@VIVA.com"
                required
                className="w-full rounded-xl border border-stone-200 py-2.5 px-3.5 text-sm text-stone-900 transition-all focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                id="login-input-email"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-stone-600 uppercase">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-stone-200 py-2.5 pl-3.5 pr-10 text-sm text-stone-900 transition-all focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  id="login-input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer p-1"
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  id="btn-toggle-show-password"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-100 p-3.5 text-xs text-rose-700 font-medium">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-600" />
                <p>{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="mt-2 w-full rounded-xl bg-stone-900 hover:bg-stone-800 py-3 text-sm font-bold text-white transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              id="btn-submit-login"
            >
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>{loginLoading ? 'Verificando...' : 'Ingresar al Sistema'}</span>
            </button>
          </form>

          {onOpenProposal && (
            <div className="mt-6 pt-5 border-t border-stone-200 text-center">
              <button
                type="button"
                onClick={onOpenProposal}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                id="btn-login-open-proposal"
              >
                <FileText className="h-4 w-4 text-amber-700" />
                <span>📄 Ver Dossier de Soluciones & Capacidades (PDF)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vista del Panel de Control
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" id="admin-dashboard-view">
      
      {/* Header del Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-amber-600" />
            <span>Panel de Administración</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Gestiona la cartera de propiedades de Viva Costa Rica, cambia disponibilidad e inserta nuevas captaciones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenProposal && (
            <button
              onClick={onOpenProposal}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 h-11 text-xs sm:text-sm font-black text-stone-950 transition-all cursor-pointer shadow-xs border border-amber-600/30"
              title="Descargar dossier de soluciones en PDF"
              id="btn-admin-open-proposal"
            >
              <FileText className="h-4 w-4 text-stone-950" />
              <span>Dossier de Soluciones (PDF)</span>
            </button>
          )}

          {/* Botón de Refrescar */}
          <button
            onClick={onRefresh}
            className="flex items-center justify-center h-11 w-11 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
            title="Sincronizar propiedades"
            id="btn-dashboard-sync"
          >
            <RefreshCw className="h-4.5 w-4.5" />
          </button>
          
          {/* Botón Agregar Propiedad */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-5 h-11 text-sm font-bold text-white transition-all cursor-pointer shadow-xs"
            id="btn-dashboard-add-property"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Propiedad</span>
          </button>

          {/* Botón Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white hover:bg-rose-50 hover:text-rose-700 px-4 h-11 text-xs font-bold text-stone-600 transition-colors cursor-pointer"
            title="Cerrar sesión del administrador"
            id="btn-admin-logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda Rápida en Administración */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-stone-50/80 p-3 rounded-2xl border border-stone-200">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={adminSearchQuery}
            onChange={(e) => setAdminSearchQuery(e.target.value)}
            placeholder="Filtrar por Código ID (ej. MAG-1001), título, ubicación..."
            className="w-full rounded-xl border border-stone-200 bg-white py-2 pl-9 pr-4 text-xs sm:text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 text-stone-900"
            id="input-admin-search"
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 px-2">
          <span>Total en cartera: <strong className="text-stone-900">{properties.length}</strong></span>
          {adminSearchQuery && (
            <button
              onClick={() => setAdminSearchQuery('')}
              className="text-amber-700 hover:underline cursor-pointer font-bold"
            >
              Limpiar filtro
            </button>
          )}
        </div>
      </div>

      {/* Tabla General de Propiedades */}
      <div className="overflow-hidden bg-white border border-stone-200 rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="p-4 sm:p-5">Propiedad & ID</th>
                <th className="p-4 sm:p-5">Ubicación / Tipo</th>
                <th className="p-4 sm:p-5">Precio</th>
                <th className="p-4 sm:p-5">Destacado</th>
                <th className="p-4 sm:p-5">Estado</th>
                <th className="p-4 sm:p-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {properties.filter(p => {
                if (!adminSearchQuery) return true;
                const q = adminSearchQuery.toLowerCase();
                return p.id.toLowerCase().includes(q) || 
                  p.title.toLowerCase().includes(q) || 
                  p.location.toLowerCase().includes(q);
              }).length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-stone-400 font-medium">
                    No se encontraron propiedades que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                properties
                  .filter(p => {
                    if (!adminSearchQuery) return true;
                    const q = adminSearchQuery.toLowerCase();
                    return p.id.toLowerCase().includes(q) || 
                      p.title.toLowerCase().includes(q) || 
                      p.location.toLowerCase().includes(q);
                  })
                  .map((property) => (
                  <tr key={property.id} className="hover:bg-stone-50/50 transition-colors">
                    {/* Celda Propiedad (Miniatura + Título + ID Copiable) */}
                    <td className="p-4 sm:p-5 max-w-xs sm:max-w-md">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={property.images && property.images.length > 0 ? property.images[0] : FALLBACK_IMAGE}
                          alt={property.title}
                          referrerPolicy="no-referrer"
                          onError={handleImageError}
                          className="h-12 w-16 shrink-0 rounded-lg object-cover bg-stone-100 border border-stone-200"
                        />
                        <div className="truncate">
                          <span className="block font-bold text-stone-900 truncate">{property.title}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <button
                              onClick={(e) => handleCopyId(property.id, e)}
                              className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2 py-0.5 rounded transition-colors cursor-pointer"
                              title="Haga clic para copiar el ID de referencia"
                            >
                              <Hash className="h-3 w-3 text-amber-600" />
                              <span>{property.id}</span>
                              {copiedId === property.id ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3 text-amber-500 opacity-70" />
                              )}
                            </button>
                            {copiedId === property.id && (
                              <span className="text-[10px] text-emerald-600 font-bold">¡Copiado!</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Celda Ubicación / Tipo */}
                    <td className="p-4 sm:p-5 whitespace-nowrap">
                      <span className="block font-semibold text-stone-800">{property.location}</span>
                      <span className="inline-flex items-center rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600 uppercase mt-1">
                        {property.property_type} • {property.transaction_type === 'venta' ? 'venta' : (property.rental_period === 'dia' ? 'alquiler/día' : 'alquiler/mes')}
                      </span>
                    </td>

                    {/* Celda Precio */}
                    <td className="p-4 sm:p-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-black text-stone-900">
                          {formatPropertyPrice(property.price, property.currency || 'USD', property.transaction_type, property.rental_period)}
                        </span>
                        <span className="text-[10px] font-bold text-stone-400 uppercase">
                          {property.currency === 'CRC' ? 'Colones ₡' : 'Dólares $'}
                        </span>
                      </div>
                    </td>

                    {/* Celda Destacada */}
                    <td className="p-4 sm:p-5 whitespace-nowrap">
                      <button
                        onClick={() => handleQuickFeaturedToggle(property)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                          property.featured 
                            ? 'bg-amber-50 border-amber-300 text-amber-600' 
                            : 'bg-white border-stone-200 text-stone-300 hover:text-stone-500'
                        }`}
                        title="Alternar propiedad destacada"
                      >
                        <Star className={`h-4.5 w-4.5 ${property.featured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Celda Estado (Select rápido) */}
                    <td className="p-4 sm:p-5 whitespace-nowrap">
                      <select
                        value={property.status}
                        onChange={(e) => handleQuickStatusChange(property, e.target.value as PropertyStatus)}
                        className={`appearance-none rounded-lg border py-1.5 pl-3 pr-7 text-xs font-bold uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-500 ${
                          property.status === 'disponible' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                            : property.status === 'reservada'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-stone-100 border-stone-200 text-stone-600'
                        }`}
                      >
                        <option value="disponible">Disponible</option>
                        <option value="reservada">Reservada</option>
                        <option value="vendida">Vendida</option>
                      </select>
                    </td>

                    {/* Celda Acciones */}
                    <td className="p-4 sm:p-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Botón Ver Ficha */}
                        <button
                          onClick={() => onSelectProperty(property)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 cursor-pointer"
                          title="Previsualizar Ficha"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {/* Botón Editar */}
                        <button
                          onClick={() => handleOpenEditModal(property)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 cursor-pointer"
                          title="Editar propiedad"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {/* Botón Eliminar */}
                        <button
                          onClick={() => handleDelete(property.id, property.title)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                          title="Eliminar propiedad"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE AGREGAR / EDITAR PROPIEDAD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto" id="admin-crud-modal">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-stone-200 p-6 shadow-xl flex flex-col max-h-[90vh] overflow-y-auto">
            
            {/* Cabecera del Modal */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-stone-950">
                  {isEditing ? 'Editar Registro de Propiedad' : 'Agregar Nueva Propiedad al Catálogo'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Rellene la ficha técnica del inmueble con precisión.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-400 hover:text-stone-700 cursor-pointer hover:bg-stone-50"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSave} className="space-y-5 flex-1 pr-1">
              {/* Código de Referencia / ID Único */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-stone-700 uppercase flex items-center gap-1.5">
                      <Hash className="h-4 w-4 text-amber-600" />
                      Código de Referencia / ID Único <span className="text-amber-600">*</span>
                    </label>
                    <p className="text-[11px] text-stone-500 font-medium">
                      Identificador único usado en enlaces compartidos, fichas imprimibles y consultas directas de clientes por WhatsApp.
                    </p>
                  </div>
                  <input
                    type="text"
                    value={propertyCustomId}
                    onChange={(e) => setPropertyCustomId(e.target.value.toUpperCase())}
                    placeholder="Ej. MAG-1006"
                    required
                    className="w-full sm:w-44 font-mono font-bold text-sm tracking-wider uppercase bg-white border border-amber-300 rounded-xl py-2 px-3 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 text-stone-900"
                    id="input-property-custom-id"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Título de la Propiedad */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase">Título de la Propiedad <span className="text-amber-600">*</span></label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Residencia de Lujo con Alberca y Jardín"
                    required
                    className="rounded-xl border border-stone-200 py-2.5 px-3.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                {/* Ubicación Física y Selector GPS Google Maps */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-600 uppercase">
                      Ubicación / Zona <span className="text-amber-600">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsLocationPickerOpen(true)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Seleccionar punto GPS exacto en Google Maps"
                    >
                      <MapPin className="h-3.5 w-3.5 text-amber-600" />
                      <span>{latitude && longitude ? '📍 Cambiar Punto en Maps' : '📍 Marcar en Google Maps'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej. Escazú, San José / Pérez Zeledón"
                    required
                    className="rounded-xl border border-stone-200 py-2.5 px-3.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                  {latitude && longitude && (
                    <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg mt-0.5">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                        Punto GPS asignado: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setLatitude(undefined);
                          setLongitude(undefined);
                          setMapLink('');
                        }}
                        className="text-stone-400 hover:text-rose-600 text-[10px] uppercase font-bold cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  )}
                </div>

                {/* Precio Numérico y Moneda */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-600 uppercase">Precio <span className="text-amber-600">*</span></label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder={currency === 'CRC' ? 'Ej. 185000000' : 'Ej. 450000'}
                      required
                      min="0"
                      className="rounded-xl border border-stone-200 py-2.5 px-3.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-600 uppercase">Moneda</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as CurrencyType)}
                      className="appearance-none rounded-xl border border-stone-200 py-2.5 px-3 text-sm font-bold text-stone-800 bg-stone-50 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer"
                    >
                      <option value="USD">$ USD (Dólares)</option>
                      <option value="CRC">₡ CRC (Colones)</option>
                    </select>
                  </div>
                </div>

                {/* Tipo de Inmueble */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase">Tipo de Inmueble</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="appearance-none rounded-xl border border-stone-200 py-2.5 px-3.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer"
                  >
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="lote">Terreno / Lote</option>
                    <option value="local">Local Comercial</option>
                    <option value="oficina">Oficina</option>
                  </select>
                </div>

                {/* Tipo de Transacción */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase">Tipo de Operación</label>
                  <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                    className="appearance-none rounded-xl border border-stone-200 py-2.5 px-3.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer"
                  >
                    <option value="venta">Venta</option>
                    <option value="alquiler">Alquiler / Renta</option>
                  </select>
                </div>

                {/* Modalidad de Alquiler (Por Mes o Por Día) */}
                {transactionType === 'alquiler' && (
                  <div className="flex flex-col gap-1.5 animate-fadeIn">
                    <label className="text-xs font-bold text-amber-800 uppercase flex items-center justify-between">
                      <span>Modalidad de Alquiler</span>
                      <span className="text-[10px] font-normal text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Frecuencia de pago</span>
                    </label>
                    <select
                      value={rentalPeriod}
                      onChange={(e) => setRentalPeriod(e.target.value as 'mes' | 'dia')}
                      className="appearance-none rounded-xl border border-amber-300 bg-amber-50/50 py-2.5 px-3.5 text-sm font-semibold text-stone-900 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer"
                    >
                      <option value="mes">Por Mes (/mes)</option>
                      <option value="dia">Por Día (/día)</option>
                    </select>
                  </div>
                )}

                {/* Estado Inicial */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-600 uppercase">Estado inicial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                    className="appearance-none rounded-xl border border-stone-200 py-2.5 px-3.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="reservada">Reservada</option>
                    <option value="vendida">Vendida</option>
                  </select>
                </div>

                {/* Destacado */}
                <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-100 rounded-xl p-3.5 mt-4">
                  <input
                    type="checkbox"
                    id="featured-checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="featured-checkbox" className="text-xs font-bold text-stone-700 cursor-pointer select-none">
                    Marcar como Propiedad Destacada (Grid de Inicio)
                  </label>
                </div>
              </div>

              {/* Atributos adicionales (solo si no es terreno) */}
              {propertyType !== 'lote' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-stone-50 border border-stone-100 rounded-xl">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Recámaras</label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      min="0"
                      className="rounded-lg border border-stone-200 bg-white py-1.5 px-2.5 text-xs focus:border-amber-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Baños</label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      min="0"
                      step="0.5"
                      className="rounded-lg border border-stone-200 bg-white py-1.5 px-2.5 text-xs focus:border-amber-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Plantas / Niveles</label>
                    <input
                      type="number"
                      value={floors}
                      onChange={(e) => setFloors(e.target.value)}
                      min="1"
                      placeholder="1"
                      className="rounded-lg border border-stone-200 bg-white py-1.5 px-2.5 text-xs focus:border-amber-600 focus:outline-none"
                      id="input-floors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Área Construcción (m²)</label>
                    <input
                      type="number"
                      value={buildingArea}
                      onChange={(e) => setBuildingArea(e.target.value)}
                      min="0"
                      className="rounded-lg border border-stone-200 bg-white py-1.5 px-2.5 text-xs focus:border-amber-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Superficie Terreno (m²)</label>
                    <input
                      type="number"
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
                      min="0"
                      className="rounded-lg border border-stone-200 bg-white py-1.5 px-2.5 text-xs focus:border-amber-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Descripción */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase">Descripción detallada</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre amenidades, acabados, vialidades de acceso, servicios integrados, etc."
                  rows={4}
                  className="rounded-xl border border-stone-200 py-2.5 px-3.5 text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>

              {/* Hipervínculo / Página Web / Landing Page de la propiedad */}
              <div className="flex flex-col gap-1.5 bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/80">
                <label className="text-xs font-bold text-stone-700 uppercase flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-amber-600" />
                  Sitio Web o Landing Page (Opcional)
                </label>
                <p className="text-[11px] text-stone-500 font-medium">
                  Si este bien o desarrollo cuenta con una página web oficial o un folleto digital, agrega la URL aquí para que los clientes puedan visitarla.
                </p>
                <div className="relative mt-1">
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://ejemplo.com/landing-propiedad"
                    className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-3.5 pr-10 text-xs sm:text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono text-stone-800"
                  />
                  {websiteUrl && (
                    <a
                      href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-600 transition-colors"
                      title="Probar enlace"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Multimedia: Video / Dron y Tour Virtual 360° */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Video / Dron */}
                <div className="flex flex-col gap-1.5 bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/80">
                  <label className="text-xs font-bold text-stone-700 uppercase flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Video className="h-4 w-4 text-red-600" />
                      Video / Dron (YouTube o Vimeo)
                    </span>
                    <span className="text-[10px] text-stone-400 font-normal">Opcional</span>
                  </label>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Pega el enlace de YouTube o Vimeo para activar la pestaña de video y dron en la ficha.
                  </p>
                  <div className="relative mt-1">
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-3.5 pr-10 text-xs sm:text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono text-stone-800"
                      id="input-video-url"
                    />
                    {videoUrl && (
                      <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-red-600 transition-colors"
                        title="Probar video"
                      >
                        <Play className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Tour Virtual 360° */}
                <div className="flex flex-col gap-1.5 bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/80">
                  <label className="text-xs font-bold text-stone-700 uppercase flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4 text-blue-600" />
                      Tour Virtual 360° (Matterport, Kuula)
                    </span>
                    <span className="text-[10px] text-stone-400 font-normal">Opcional</span>
                  </label>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Pega la URL de Matterport, Kuula o recorrido 3D para activar el visor inmersivo 360°.
                  </p>
                  <div className="relative mt-1">
                    <input
                      type="url"
                      value={virtualTourUrl}
                      onChange={(e) => setVirtualTourUrl(e.target.value)}
                      placeholder="https://my.matterport.com/show/?m=..."
                      className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-3.5 pr-10 text-xs sm:text-sm focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono text-stone-800"
                      id="input-tour-360-url"
                    />
                    {virtualTourUrl && (
                      <a
                        href={virtualTourUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-blue-600 transition-colors"
                        title="Probar tour 360"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Servicios y Equipamiento Incluidos (Selector Interactivo) */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 uppercase flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Servicios y Equipamiento Incluidos
                  </label>
                  <span className="text-[11px] text-stone-500 font-medium bg-stone-200/60 px-2 py-0.5 rounded-md">
                    {selectedFeatures.length} seleccionados
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEFAULT_PRESET_FEATURES.map((item, idx) => {
                    const isChecked = selectedFeatures.includes(item);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleFeature(item)}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all select-none ${
                          isChecked
                            ? 'bg-amber-50/90 border-amber-300 text-stone-900 shadow-2xs font-semibold'
                            : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="mt-0.5 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer shrink-0 pointer-events-none"
                        />
                        <span>{item}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Mostrar otras características personalizadas agregadas */}
                {selectedFeatures.filter(f => !DEFAULT_PRESET_FEATURES.includes(f)).length > 0 && (
                  <div className="pt-2 border-t border-stone-200/60">
                    <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1.5">Servicios Personalizados Adicionales:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFeatures.filter(f => !DEFAULT_PRESET_FEATURES.includes(f)).map((customFeature, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 rounded-lg bg-stone-900 text-stone-50 px-2.5 py-1 text-xs font-medium">
                          {customFeature}
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(customFeature)}
                            className="hover:text-amber-400 cursor-pointer ml-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agregar nueva característica personalizada */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customFeatureInput}
                    onChange={(e) => setCustomFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomFeature();
                      }
                    }}
                    placeholder="Agregar otro servicio o equipamiento..."
                    className="flex-1 rounded-xl border border-stone-200 bg-white py-2 px-3 text-xs focus:border-amber-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomFeature}
                    className="rounded-xl bg-stone-900 text-stone-50 hover:bg-stone-800 px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shrink-0"
                  >
                    + Agregar
                  </button>
                </div>
              </div>

              {/* Subida Múltiple de Imágenes */}
              <div className="border border-stone-200 rounded-xl p-4 space-y-3 bg-white">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-stone-700 uppercase">Fotografías del Inmueble</span>
                  <span className="text-[11px] text-stone-400">
                    Sube archivos JPEG o PNG. Se comprimirán automáticamente en el navegador a 1200px con un 75% de calidad para un rendimiento ultra-rápido.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Botón de subida de archivo */}
                  <div className="sm:col-span-4">
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed border-stone-200 hover:border-amber-500 rounded-xl p-4 cursor-pointer bg-stone-50 hover:bg-amber-50/20 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload className="h-6 w-6 text-stone-400 mb-1.5" />
                      <span className="text-xs font-bold text-stone-700">Subir Imágenes</span>
                      <span className="text-[10px] text-stone-400 mt-0.5">JPEG / PNG</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  {/* Lista de URLs de imágenes activas */}
                  <div className="sm:col-span-8 flex flex-wrap gap-2.5 overflow-y-auto max-h-[150px] p-2 border border-stone-100 rounded-xl bg-stone-50/50">
                    {imageUrls.length === 0 ? (
                      <span className="text-xs text-stone-400 italic m-auto">Sin imágenes cargadas. Se usará una por defecto.</span>
                    ) : (
                      imageUrls.map((url, index) => (
                        <div key={index} className="relative h-14 w-20 rounded-lg overflow-hidden border border-stone-200 group">
                          <img
                            src={url}
                            alt={`Inmueble ${index + 1}`}
                            referrerPolicy="no-referrer"
                            onError={handleImageError}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 h-5.5 w-5.5 bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center rounded-md cursor-pointer transition-colors"
                            title="Eliminar esta foto"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {isUploading && (
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 p-2.5 rounded-lg">
                    <div className="h-4 w-4 rounded-full border-2 border-amber-600 border-t-transparent animate-spin"></div>
                    <span>{uploadProgress || 'Subiendo y optimizando archivos...'}</span>
                  </div>
                )}
              </div>

              {/* Mensajes de feedback */}
              {formError && (
                <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-100 p-3.5 text-xs text-rose-700 font-semibold">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-600" />
                  <p>{formError}</p>
                </div>
              )}

              {formSuccess && (
                <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 text-xs text-emerald-700 font-semibold">
                  <Check className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
                  <p>{formSuccess}</p>
                </div>
              )}

              {/* Botones de acción del Modal */}
              <div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-stone-200 bg-white hover:bg-stone-50 py-2.5 px-5 text-sm font-semibold text-stone-700 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 py-2.5 px-6 text-sm font-bold text-white transition-all cursor-pointer shadow-xs"
                >
                  {isEditing ? 'Guardar Cambios' : 'Publicar Propiedad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal interactivo de Google Maps */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onSelectLocation={(data) => {
          setLatitude(data.latitude);
          setLongitude(data.longitude);
          setMapLink(data.mapLink);
          if (data.locationText && !location.trim()) {
            setLocation(data.locationText);
          }
        }}
        initialLatitude={latitude}
        initialLongitude={longitude}
        initialLocationText={location}
        initialMapLink={mapLink}
      />
    </div>
  );
}

