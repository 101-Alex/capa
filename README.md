# CAPA — Proyecto colaborativo modular

CAPA utiliza Node.js, TypeScript y Turso (libSQL). Cada integrante desarrolla su módulo en una carpeta aislada y almacena sus registros en la tabla compartida `records`.

## 1. Equipo y asignación

| Integrante | Rama | Carpeta autorizada |
|---|---|---|
| PAOLA (Líder) | `peliculas` | `src/modules/peliculas/` |
| CANEK | `aves` | `src/modules/aves/` |
| ALY | `comida` | `src/modules/comida/` |
| AMBAR | `anime` | `src/modules/anime/` |

La rama y el valor `modulo` deben coincidir exactamente. El valor `autor` debe ser el nombre asignado en esta tabla.

## 2. Requisitos

- Node.js 20 o superior (recomendado).
- npm.
- Git.
- Acceso al repositorio GitHub.
- Credenciales de Turso proporcionadas por PAOLA.

## 3. Instalación

Clona el repositorio y entra en la carpeta:

```bash
git clone https://github.com/USUARIO-GITHUB/capa.git
cd capa
npm install
```

Cambia a tu rama (sustituye por la asignada):

```bash
git checkout aves
```

Otras ramas: `peliculas`, `comida`, `anime`.

## 4. Variables de entorno

Copia `.env.example` como `.env` y completa los valores que te entregará PAOLA:

```env
TURSO_DATABASE_URL=libsql://tu-base-de-datos.turso.io
TURSO_AUTH_TOKEN=tu_token_de_turso
```

No compartas el token ni lo subas a Git. El archivo `.env` está excluido mediante `.gitignore`.

## 5. Inicialización de la base de datos (solo líder)

PAOLA ejecuta una sola vez, después de configurar sus credenciales:

```bash
npm run db:init
```

Esto crea `records` y los índices `idx_records_modulo` e `idx_records_autor`. Los demás integrantes no deben ejecutar scripts que alteren el esquema.

La tabla tiene exactamente estas columnas:

| Columna | Tipo | Uso |
|---|---|---|
| `id` | TEXT PRIMARY KEY | UUID del registro |
| `created_at` | DATETIME DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `autor` | TEXT NOT NULL | Integrante propietario |
| `modulo` | TEXT NOT NULL | Módulo propietario |
| `content` | BLOB NOT NULL | Documento JSONB |

## 6. Cómo crear tu módulo

Crea únicamente tu carpeta dentro de `src/modules/`. Ejemplo para CANEK:

```text
src/modules/aves/
  index.ts
  service.ts
```

En `index.ts`, define el tipo de tu contenido y crea tu repositorio:

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

Para ALY usa `modulo: 'comida'` y `autor: 'ALY'`. Para AMBAR usa `modulo: 'anime'` y `autor: 'AMBAR'`. PAOLA ya tiene un ejemplo completo en `src/modules/peliculas/`.

## 7. Operaciones CRUD

Todos los métodos reciben/devuelven objetos TypeScript; no necesitas escribir SQL en tu módulo.

```ts
// Crear
const nuevo = await avesRepository.create({
  nombre: 'Colibrí',
  nombreCientifico: 'Trochilidae',
  habitat: ['bosque', 'jardín'],
  caracteristicas: { alimentacion: 'néctar', migratoria: false }
});

// Listar registros de aves
const todos = await avesRepository.findAll();

// Buscar por UUID
const uno = await avesRepository.findById(nuevo.id);

// Buscar por propiedad de primer nivel dentro de content
const colibries = await avesRepository.findByField('nombre', 'Colibrí');

// Actualizar el documento completo
const actualizado = await avesRepository.update(nuevo.id, {
  ...nuevo.content,
  habitat: ['bosque', 'jardín', 'montaña']
});

// Eliminar
const eliminado = await avesRepository.delete(nuevo.id);
```

`findByField` busca claves de primer nivel (por ejemplo `nombre`, `anio`, `disponible`). Los nombres de clave admiten letras, números y guion bajo, y deben comenzar con letra o guion bajo. Para campos anidados se puede ampliar el repositorio con una API de rutas JSON validada.

## 8. Ejecutar y comprobar

El ejemplo de PAOLA realiza CREATE, FIND ALL, FIND BY ID, FIND BY FIELD y UPDATE:

```bash
npm run dev:peliculas
```

Comprobación de tipos:

```bash
npm run typecheck
```

## 9. Reglas obligatorias de colaboración

1. Trabaja exclusivamente en tu rama: `git checkout <tu-modulo>`.
2. Modifica únicamente `src/modules/<tu-modulo>/`.
3. No cambies `src/repositories/`, `src/config/`, `src/database/`, `package.json` ni el esquema de Turso sin autorización del líder.
4. No crees tablas adicionales: todos usan `records`.
5. No guardes credenciales en el código ni en Git.
6. Antes de subir, ejecuta `npm run typecheck`.
7. Abre un Pull Request desde tu rama hacia `main` y completa la plantilla.

## 10. Subir cambios y abrir PR

```bash
git status
git add src/modules/<tu-modulo>/
git commit -m "feat(<tu-modulo>): implementa módulo"
git push -u origin <tu-modulo>
```

En GitHub crea un Pull Request con:

- **base:** `main`
- **compare:** tu rama (`aves`, `comida`, `anime` o `peliculas`)

Espera la revisión y aprobación de PAOLA antes de integrar.

## 11. Consideraciones técnicas

- El repositorio filtra por `modulo` en todas las lecturas, actualizaciones y eliminaciones para evitar que un módulo modifique registros de otro.
- `autor` y `modulo` se inyectan desde el constructor; no los envíes dentro de `content`.
- `content` se convierte con `jsonb(?)` al insertar/actualizar y se devuelve con `json(content)` al consultar.
- El JSONB de SQLite/libSQL es un formato binario propio de SQLite; no es compatible con el JSONB de PostgreSQL.
- `db:init` comprueba que la función `jsonb()` esté disponible en el motor remoto. Si falla, no continúes con el CRUD hasta validar la compatibilidad de la instancia Turso/libSQL.
- `findByField` permite filtrar por propiedades de primer nivel; no es un buscador genérico de rutas anidadas.

## 12. Estructura general

```text
capa/
├── .github/
│   └── pull_request_template.md
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── database/
│   │   └── init.ts
│   ├── repositories/
│   │   └── ModuleRepository.ts
│   └── modules/
│       └── peliculas/
│           ├── index.ts
│           └── example.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```
