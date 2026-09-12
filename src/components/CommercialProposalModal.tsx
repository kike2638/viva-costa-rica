import React from 'react';
import { 
  Building2, 
  Printer, 
  Download, 
  X, 
  TrendingUp, 
  Zap, 
  Smartphone, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  Clock,
  Sparkles,
  Layers,
  Users,
  Search,
  Share2,
  CheckCircle2
} from 'lucide-react';

interface CommercialProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommercialProposalModal({ isOpen, onClose }: CommercialProposalModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textContent = `
================================================================================
DOSSIER EJECUTIVO: SOLUCIÓN DIGITAL INTEGRAL
PLATAFORMA INMOBILIARIA DE ALTA CONVERSIÓN & GESTIÓN AUTÓNOMA
PREPARADO PARA: Viva Costa Rica
================================================================================

1. RESUMEN ESTRATÉGICO
Viva Costa Rica cuenta ahora con un ecosistema digital propietario diseñado 
para superar las limitaciones de portales tradicionales y redes sociales, 
transformando visitas pasivas en oportunidades de cierre inmediatas.

2. PROBLEMÁTICAS RESUELTAS POR LA PLATAFORMA

A. REBOTES POR LENTITUD Y PORTALES PESADOS
- Problema: Portales lentos pierden hasta el 70% de compradores potenciales.
- Solución VIVA: Arquitectura ultrarrápida (Vite + React) que carga en menos de 0.8s en cualquier celular.

B. PÉRDIDA DE LEADS Y FRICCIÓN EN EL CONTACTO
- Problema: Formularios largos que nadie llena o llamadas que se pierden.
- Solución VIVA: Botones de conversión directa a WhatsApp con mensajes pre-redactados incluyendo código, título y precio exacto.

C. CLIENTES DESORIENTADOS EN UBICACIONES
- Problema: Explicar cómo llegar a quintas, lotes o residencias complejas toma tiempo y genera confusión.
- Solución VIVA: Geolocalización GPS integrada con botones directos para abrir la ruta en Waze y Google Maps.

D. DEPENDENCIAS TÉCNICAS Y COSTOS DE PROGRAMADORES
- Problema: Pagarle a un técnico cada vez que se quiere cambiar un precio, pausar un inmueble o subir fotos.
- Solución VIVA: Panel de Control Administrativo privado para gestionar inventario, estados (Disponible, Reservado, Vendido) y fotos al instante.

E. FICHAS TÉCNICAS DESORGANIZADAS PARA VISITAS
- Problema: Armar documentos en Word o PDF manualmente para cada cliente interesado.
- Solución VIVA: Generador instantáneo de Fichas Técnicas Oficiales en PDF con diseño arquitectónico en 1 solo clic.

F. COSTOS MENSUALES DE INFRAESTRUCTURA
- Problema: Servidores dedicados costosos y caídas de servicio.
- Solución VIVA: Alojamiento en la nube (Vercel + Appwrite Cloud) con disponibilidad 24/7 y costo de servidor $0/mes.

3. RESUMEN DE MÓDULOS ACTIVOS
- Catálogo interactivo con filtrado inteligente (Venta/Renta, Tipos, Rangos de Precio y Áreas).
- Ficha de propiedad inmersiva con Lightbox fotográfico HD.
- Mapas interactivos satelitales y trazado de rutas GPS.
- Panel administrativo con autenticación segura y base de datos en tiempo real.
- Generador de Dossiers Técnicos descargables e imprimibles.

================================================================================
`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Dossier_Solucion_Digital_VIVA_Bienes_Raices.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 flex justify-center items-start">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        {/* Barra superior de acciones (No se imprime) */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-stone-900 text-white border-b border-stone-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-stone-950 font-black">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Dossier Ejecutivo: Solución Digital Inmobiliaria</h2>
              <p className="text-[11px] text-stone-400">Diagnóstico, Capacidades & Soluciones Clave para Viva Costa Rica</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
              title="Descargar documento en texto"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Descargar Texto</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 shadow transition-all cursor-pointer"
              title="Imprimir o Guardar en PDF"
            >
              <Printer className="h-4 w-4" />
              <span>Guardar como PDF / Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors ml-1 cursor-pointer"
              title="Cerrar ventana"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* CUERPO DEL DOCUMENTO (Formato Ejecutivo Imprimible) */}
        <div className="p-8 sm:p-12 text-stone-800 space-y-10 print:p-0 print:text-black">
          
          {/* Encabezado del Documento */}
          <div className="border-b-2 border-amber-500 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-950 text-stone-100">
                  <Building2 className="h-7 w-7 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-stone-950 leading-none">VIVA</h1>
                  <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">Bienes Raíces</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-stone-600 pt-1">
                Dossier Ejecutivo: Capacidades y Soluciones que Resuelve la Plataforma Web
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-stone-500 space-y-1">
              <p><strong className="text-stone-800">Fecha:</strong> Agosto 2026</p>
              <p><strong className="text-stone-800">Destinatario:</strong> Dirección General & Equipo Comercial</p>
              <p><strong className="text-stone-800">Ecosistema:</strong> 100% Funcional y Listo para Producción</p>
            </div>
          </div>

          {/* 1. Resumen Estratégico */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span>1. Visión & Enfoque Estratégico</span>
            </div>
            <h3 className="text-xl font-bold text-stone-950">
              Transformando el Catálogo Inmobiliario en una Herramienta Activa de Captación y Cierre
            </h3>
            <p className="text-sm leading-relaxed text-stone-600 text-justify">
              En el sector inmobiliario de alta gama, los clientes buscan agilidad, claridad y profesionalismo. Esta plataforma resuelve de raíz los cuellos de botella que sufren las agencias tradicionales, integrando en una sola herramienta velocidad de carga de nivel internacional, geolocalización satelital precisa, conversión directa a WhatsApp y autonomía total para el equipo de ventas sin requerir conocimientos de programación.
            </p>
          </section>

          {/* 2. Soluciones Concretas a Problemas Reales */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span>2. Principales Retos Inmobiliarios que la Plataforma Resuelve</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Solución 1 */}
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <div className="p-1.5 bg-amber-100 rounded-lg text-amber-800">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span>1. Cero Tiempos de Espera y Rebote de Clientes</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed text-justify">
                  <strong>El Reto:</strong> Los sitios en WordPress o portales sobrecargados tardan entre 4 y 7 segundos en cargar, perdiendo hasta el 70% de prospectos móviles.
                </p>
                <p className="text-xs text-stone-700 leading-relaxed bg-white p-2.5 rounded-lg border border-stone-200 text-justify">
                  <strong>La Solución:</strong> Construida sobre arquitectura moderna React + Vite, la plataforma carga en menos de <strong>0.8 segundos</strong>, reteniendo al visitante de inmediato.
                </p>
              </div>

              {/* Solución 2 */}
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-800">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <span>2. Conversión Inmediata a WhatsApp Sin Fricción</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed text-justify">
                  <strong>El Reto:</strong> Los formularios de contacto tradicionales son ignorados por el 85% de los usuarios que navegan desde teléfonos celulares.
                </p>
                <p className="text-xs text-stone-700 leading-relaxed bg-white p-2.5 rounded-lg border border-stone-200 text-justify">
                  <strong>La Solución:</strong> Cada propiedad genera un enlace personalizado que abre WhatsApp con el <strong>título, código de propiedad y precio ya redactados</strong>.
                </p>
              </div>

              {/* Solución 3 */}
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <div className="p-1.5 bg-blue-100 rounded-lg text-blue-800">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span>3. Geolocalización Satelital & Rutas GPS</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed text-justify">
                  <strong>El Reto:</strong> Explicar ubicaciones de terrenos, quintas o condominios por teléfono genera pérdida de tiempo y clientes desorientados.
                </p>
                <p className="text-xs text-stone-700 leading-relaxed bg-white p-2.5 rounded-lg border border-stone-200 text-justify">
                  <strong>La Solución:</strong> Mapas satelitales interactivos y botón directo para trazar la ruta de navegación en <strong>Waze o Google Maps</strong> con un solo toque.
                </p>
              </div>

              {/* Solución 4 */}
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <div className="p-1.5 bg-purple-100 rounded-lg text-purple-800">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span>4. Dosieres y Fichas Técnicas PDF en 1 Clic</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed text-justify">
                  <strong>El Reto:</strong> Armar documentos o presentaciones individuales para enviar por correo o llevar a visitas presenciales consume horas valiosas de los asesores.
                </p>
                <p className="text-xs text-stone-700 leading-relaxed bg-white p-2.5 rounded-lg border border-stone-200 text-justify">
                  <strong>La Solución:</strong> Generación instantánea de la <strong>Ficha Técnica Oficial</strong> con diseño de alta costura, especificaciones y fotografías lista para imprimir o compartir.
                </p>
              </div>

              {/* Solución 5 */}
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5 md:col-span-2">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <div className="p-1.5 bg-amber-100 rounded-lg text-amber-800">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span>5. Control Total e Independencia Técnica (Panel Administrativo Autónomo)</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed text-justify">
                  <strong>El Reto:</strong> Depender de un programador o agencia externa para actualizar precios, subir fotos nuevas o dar de baja inmuebles vendidos genera demoras y costos recurrentes innecesarios.
                </p>
                <p className="text-xs text-stone-700 leading-relaxed bg-white p-2.5 rounded-lg border border-stone-200 text-justify">
                  <strong>La Solución:</strong> Un Panel de Control intuitivo donde cualquier miembro del equipo puede subir propiedades, cambiar estados (Disponible, Reservado, Vendido), destacar inmuebles y ordenar galerías en segundos.
                </p>
              </div>

            </div>
          </section>

          {/* 3. Módulos y Arquitectura Integrada */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <Layers className="h-4 w-4 text-amber-600" />
              <span>3. Resumen de Módulos Operativos</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <Search className="h-3.5 w-3.5 text-amber-600" />
                  <span>Buscador & Filtros Multi-Criterio</span>
                </div>
                <p className="text-stone-500 text-[11px] leading-relaxed">
                  Búsqueda por tipo (casas, apartamentos, lotes), modalidad (venta/renta), rangos de precio, habitaciones y metrajes.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <Share2 className="h-3.5 w-3.5 text-amber-600" />
                  <span>Galería Fotográfica HD & Lightbox</span>
                </div>
                <p className="text-stone-500 text-[11px] leading-relaxed">
                  Visor inmersivo a pantalla completa con navegación táctil fluida y soporte para enlaces de video de recorridos.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <Users className="h-3.5 w-3.5 text-amber-600" />
                  <span>Base de Datos Cloud 24/7</span>
                </div>
                <p className="text-stone-500 text-[11px] leading-relaxed">
                  Almacenamiento seguro en la nube con respaldo continuo de información e imágenes, sin costo de mantenimiento mensual.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Conclusión */}
          <div className="p-5 rounded-2xl bg-stone-900 text-stone-100 space-y-2">
            <h4 className="text-sm font-bold text-amber-400">Impacto Comercial Esperado para Viva Costa Rica</h4>
            <p className="text-xs text-stone-300 leading-relaxed text-justify">
              Esta solución consolida a Viva Costa Rica como una firma inmobiliaria de vanguardia, maximizando el valor de su inventario, acelerando los tiempos de respuesta con los compradores y brindando a los agentes una herramienta de trabajo ágil y profesional.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

