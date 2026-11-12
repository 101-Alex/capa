# CAPA — Proyecto colaborativo modular

CAPA es un proyecto colaborativo desarrollado con **React, Vite, Node.js, Express, TypeScript y Turso (libSQL)**. Su arquitectura permite que cada integrante desarrolle un módulo independiente y almacene sus registros en una única tabla compartida llamada `records`.

## 1. Equipo y asignación

| Integrante | Responsabilidad | Rama | Carpeta autorizada |
|---|---|---|---|
| PAOLA | Líder — Películas | `peliculas` | `backend/src/modules/peliculas/` |
| CANEK | Aves | `aves` | `backend/src/modules/aves/` |
| ALY | Comida | `comida` | `backend/src/modules/comida/` |
| AMBAR | Anime | `anime` | `backend/src/modules/anime/` |

La rama, el valor `modulo` y la carpeta deben coincidir. El valor `autor` debe corresponder al integrante asignado.

## 2. Requisitos

- Node.js 20 o superior.
- npm.
- Git.
- Visual Studio Code (recomendado).
- Acceso al repositorio de GitHub.
- Credenciales de Turso proporcionadas de forma privada por la líder.

## 3. Clonar el repositorio

Clona el proyecto y entra en su carpeta:

```bash
git clone https://github.com/101-Alex/capa.git
cd capa
```

Instala las dependencias del backend:

```bash
npm install
```

Para instalar las dependencias del frontend:

```bash
cd frontend
npm install
cd ..
```

## 4. Cambiar a la rama asignada

Cada integrante debe trabajar exclusivamente en su rama.

Primero actualiza la información de las ramas:

```bash
git fetch origin
```

Después cambia a la rama que corresponda:

```bash
git switch aves
```

Otras ramas disponibles:

- `peliculas`
- `comida`
- `anime`

No desarrolles tu módulo directamente en `main`.

## 5. Variables de entorno

La líder proporcionará las credenciales de Turso de forma privada.

Crea un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`:

```env
TURSO_DATABASE_URL=libsql://tu-base-de-datos.turso.io
TURSO_AUTH_TOKEN=tu_token_de_turso
```

No compartas el token ni lo incluyas en Git. El archivo `.env` está excluido mediante `.gitignore`.

## 6. Base de datos compartida

La líder inicializa la base de datos una sola vez mediante:

```bash
npm run db:init
```

Los colaboradores no deben modificar el esquema ni ejecutar scripts que alteren la estructura de la base de datos sin autorización.

Todos los módulos utilizan la misma tabla `records`, con estas columnas:

| Columna | Tipo | Uso |
|---|---|---|
| `id` | `TEXT PRIMARY KEY` | Identificador UUID |
| `created_at` | `DATETIME DEFAULT CURRENT_TIMESTAMP` | Fecha de creación |
| `autor` | `TEXT NOT NULL` | Integrante propietario |
| `modulo` | `TEXT NOT NULL` | Módulo propietario |
| `content` | `BLOB NOT NULL` | Documento JSONB |

La tabla cuenta con índices para `modulo` y `autor`.

## 7. Arquitectura del repositorio

El proyecto está organizado de la siguiente manera:

```text
capa/
├── .github/
│   └── pull_request_template.md
├── backend/
│   ├── tsconfig.json
│   └── src/
│       ├── config/
│       │   └── database.ts
│       ├── database/
│       │   └── init.ts
│       ├── repositories/
│       │   └── ModuleRepository.ts
│       ├── modules/
│       │   ├── peliculas/
│       │   │   ├── index.ts
│       │   │   └── example.ts
│       │   ├── aves/
│       │   ├── comida/
│       │   └── anime/
│       ├── routes/
│       │   └── peliculas.routes.ts
│       └── server.ts
├── frontend/
│   ├── src/
│   ├── index.html
│   └── vite.config.ts
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 8. Crear un módulo

Cada integrante puede crear y modificar archivos exclusivamente dentro de su carpeta autorizada:

```text
backend/src/modules/<tu-modulo>/
```

Por ejemplo, CANEK trabaja en:

```text
backend/src/modules/aves/
```

Puede organizar su módulo con archivos como:

- `index.ts`: interfaz de datos e instancia del repositorio.
- `service.ts`: lógica propia del módulo.
- `example.ts`: pruebas de las operaciones CRUD.

### Ejemplo de index.ts para CANEK

```ts
import { ModuleRepository } from '../../repositories/ModuleRepository.js';

export interface Ave {
  nombre: string;
  nombreCientifico: string;
  habitat: string[];
  caracteristicas: {
    alimentacion: string;
    migratoria: boolean;
  };
}

export const avesRepository = new ModuleRepository<Ave>({
  modulo: 'aves',
  autor: 'CANEK'
});
```

Para los demás integrantes:

| Integrante | `modulo` | `autor` |
|---|---|---|
| PAOLA | `peliculas` | `PAOLA` |
| CANEK | `aves` | `CANEK` |
| ALY | `comida` | `ALY` |
| AMBAR | `anime` | `AMBAR` |

## 9. Operaciones CRUD disponibles

El repositorio genérico `ModuleRepository` proporciona los siguientes métodos:

```ts
// Crear un registro
const nuevo = await avesRepository.create(datos);

// Consultar todos los registros del módulo
const todos = await avesRepository.findAll();

// Consultar por UUID
const uno = await avesRepository.findById(nuevo.id);

// Buscar por propiedad de primer nivel
const encontrados = await avesRepository.findByField(
  'nombre',
  'Colibrí'
);

// Actualizar el documento completo
const actualizado = await avesRepository.update(nuevo.id, {
  ...nuevo.content,
  nombre: 'Colibrí garganta rubí'
});

// Eliminar por UUID
const eliminado = await avesRepository.delete(nuevo.id);
```

No es necesario escribir consultas SQL dentro de cada módulo.

`findByField` busca propiedades de primer nivel dentro de `content`. Para campos anidados se necesita ampliar el repositorio con una API de rutas JSON validada.

## 10. Ejecutar y comprobar el proyecto

### Backend

Desde la raíz del proyecto:

```bash
npm run dev:backend
```

El servidor se ejecuta en:

```text
http://localhost:3000
```

### Frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

Vite mostrará la dirección local del frontend, normalmente:

```text
http://localhost:5173
```

### Comprobación de tipos del backend

Desde la raíz:

```bash
npm run typecheck
```

### Ejemplo CRUD de la líder

Desde la raíz:

```bash
npm run dev:peliculas
```

Este ejemplo demuestra las operaciones de creación, consulta, búsqueda, actualización y eliminación.

## 11. Reglas obligatorias de colaboración

1. Trabaja únicamente en tu rama asignada.
2. Modifica exclusivamente `backend/src/modules/<tu-modulo>/`.
3. No modifiques `ModuleRepository.ts`, `database.ts`, `init.ts`, `server.ts`, las rutas compartidas ni los archivos de configuración sin autorización de la líder.
4. No modifiques `package.json` ni agregues dependencias sin autorización.
5. No crees tablas adicionales en Turso.
6. No guardes credenciales ni tokens en el código.
7. No incluyas `.env`, `node_modules` ni `dist` en tus commits.
8. Ejecuta `npm run typecheck` antes de enviar tus cambios.
9. Prueba las operaciones CRUD que utilice tu módulo.
10. Envía un Pull Request hacia `main` y espera la revisión de la líder.

## 12. Subir cambios y abrir un Pull Request

Comprueba primero tus archivos modificados:

```bash
git status
```

Agrega únicamente tu carpeta:

```bash
git add backend/src/modules/<tu-modulo>/
```

Crea el commit:

```bash
git commit -m "feat(<tu-modulo>): implementa módulo"
```

Sube los cambios:

```bash
git push -u origin <tu-modulo>
```

En GitHub crea un Pull Request con:

- **Base:** `main`
- **Compare:** tu rama asignada.

Espera la revisión y aprobación de PAOLA antes de integrar los cambios.

## 13. Consideraciones técnicas

- Todos los módulos utilizan una única tabla compartida `records`.
- El repositorio filtra las operaciones por `modulo`.
- `autor` y `modulo` se inyectan desde el constructor de `ModuleRepository`.
- Los datos se almacenan mediante `jsonb(?)` y se consultan mediante `json(content)`.
- El JSONB de SQLite/libSQL es un formato propio y no debe confundirse con el JSONB de PostgreSQL.
- La líder es responsable de los cambios en la infraestructura compartida y de revisar los Pull Requests.