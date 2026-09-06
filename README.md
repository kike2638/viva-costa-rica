# Terra Capital — San Ramón, Alajuela

Portal inmobiliario + gestión de avalúos certificados CFIA. Base **San Ramón**.

- **Frontend:** React 19 + Vite 5 + Tailwind 3 + React Router 6 + Zustand + Formik/Yup + Recharts + Framer Motion
- **Avalúos:** Virtual gratis / Presencial ₡45k + desplazamiento / Hipotecario ₡95k + desplazamiento (calculado desde San Ramón)
- **SuperAdmin:** `/admin/login` → `admin@terracapital.cr` / `Terra2026` — dashboard con pagos, visitas y trazabilidad

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # dist/
```

## Vercel Deploy
Ver `vercel.json` para SPA rewrites. Storage: Vercel Postgres + Blob (ver docs en `/docs`).

## Estructura
- `src/utils/constants.ts` — tarifas desplazamiento
- `src/store/avaluos.ts` — `terra-avaluos-v3-sanramon`
- `src/store/auth.ts` — `terra-auth`
