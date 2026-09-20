# Sitio Asociación Los Quilmeros

Next.js 14 + Sanity (panel de administración embebido en `/studio`).

## 1. Instalar

```bash
npm install
```

## 2. Crear el proyecto de Sanity (gratis)

1. Andá a https://www.sanity.io/ → creá una cuenta → "Create new project".
2. Copiá el **Project ID** que te da.
3. Copiá `.env.local.example` a `.env.local` y pegá ese Project ID.

No hace falta instalar nada aparte del `npm install` del paso 1: Sanity Studio
ya viaja embebido en el proyecto (carpeta `sanity/`, ruta `/studio`).

## 3. Correr en local

```bash
npm run dev
```

- El sitio: http://localhost:3000
- El panel de administración: http://localhost:3000/studio
  (la primera vez te va a pedir loguearte con la cuenta de Sanity que creaste)

Desde `/studio` ya podés crear:
- **Publicación**: título, resumen, texto, foto.
- **Efeméride**: día, mes, año histórico (opcional), título, texto, categoría, foto.
  El calendario y la tarjeta "Una fecha para recordar" de la home leen directo de acá.

## 4. Importar las ~1000 notas del blogspot

```bash
npm install @sanity/client dotenv
```

Generá un token de Sanity con permisos de **Editor**: sanity.io/manage → tu
proyecto → API → Tokens → Add API token. Pegalo en `.env.local` como:

```
SANITY_API_TOKEN=sk_...
```

Corré:

```bash
npm run import-blogspot
```

Recorre el feed público de `elquilmero.blogspot.com` de punta a punta y crea
un documento `archivoEntry` por cada nota (título, fecha, resumen, etiquetas
y link a la nota original). Se puede correr de nuevo más adelante para traer
solo las notas nuevas que se publiquen en el blog — no duplica, porque usa el
ID del post de Blogger para actualizar en vez de crear de cero.

## 5. Desplegar en Vercel

1. Subí este proyecto a un repositorio de GitHub.
2. En https://vercel.com → "Add New Project" → importá el repo.
3. Cargá las mismas variables de `.env.local` en Vercel (Settings → Environment
   Variables): `NEXT_PUBLIC_SANITY_PROJECT_ID` y `NEXT_PUBLIC_SANITY_DATASET`.
4. Deploy.

## 6. Conectar el dominio .com.ar

Una vez comprado en nic.ar: Vercel → tu proyecto → Settings → Domains →
agregá el dominio → Vercel te va a dar un registro (A o CNAME) para cargar en
nic.ar. Tarda de minutos a un par de horas en propagar.

## Pendiente de contenido real (no técnico)

- Texto definitivo de "Quiénes somos".
- Mail de contacto de la asociación.
- Link exacto de la página de Facebook (para reemplazar el placeholder de la
  sección "En las redes" por el plugin oficial de Meta).
- Primeras publicaciones y efemérides reales, cargadas desde `/studio`.
- Logo en formato vectorial (SVG/AI/PDF) si existe, para reemplazar el PNG
  usado por ahora en `public/isotipo.png`.
