-- Terra Capital — San Ramón — Vercel Postgres (Neon)
-- Ejecuta esto en Vercel > Storage > Postgres > Query

CREATE TABLE IF NOT EXISTS avaluos (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  direccion TEXT NOT NULL,
  superficie INT,
  tipo TEXT,
  descripcion TEXT,
  modalidad TEXT CHECK (modalidad IN ('virtual','presencial','hipotecario')),
  urgencia TEXT CHECK (urgencia IN ('normal','express')),
  status TEXT DEFAULT 'pendiente_pago',
  pago_status TEXT DEFAULT 'pendiente',
  costo_total INT DEFAULT 0,
  desplazamiento_costo INT DEFAULT 0,
  metodologia TEXT,
  doc_completitud INT DEFAULT 0,
  documentos JSONB DEFAULT '{}',
  valor_estimado BIGINT,
  tasador TEXT,
  fecha_visita DATE,
  notas TEXT,
  metodo_pago TEXT
);

CREATE TABLE IF NOT EXISTS propiedades (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  ubicacion TEXT,
  ciudad TEXT,
  precio BIGINT,
  tipo TEXT,
  habitaciones INT,
  banos INT,
  area INT,
  descripcion TEXT,
  imagen_url TEXT,
  imagenes JSONB DEFAULT '[]',
  destacada BOOLEAN DEFAULT false,
  commission_tipo TEXT DEFAULT 'terra_select',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_avaluos_status ON avaluos(status);
CREATE INDEX IF NOT EXISTS idx_avaluos_modalidad ON avaluos(modalidad);
