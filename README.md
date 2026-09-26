# GitHub MCP Server

Un servidor **MCP (Model Context Protocol)** construido con Node.js y TypeScript que expone tools para automatizar operaciones comunes en GitHub. Permite que un agente de IA (Gemini, Claude, Antigravity, o cualquier LLM compatible) ejecute acciones en GitHub mediante comandos en lenguaje natural.

## Arquitectura

```
┌────────────────────┐      ┌────────────────────┐      ┌────────────────────┐      ┌────────────────────┐
│    Antigravity     │      │        LLM         │      │    MCP Server      │      │     GitHub API     │
│      (Host)        │ ───► │      (Client)      │ ───► │  (Este proyecto)   │ ───► │                    │
│                    │      │  Gemini / Claude   │      │   Node.js + TS     │      │   api.github.com   │
└────────────────────┘      └────────────────────┘      └────────────────────┘      └────────────────────┘
```

1. **Antigravity (Host)** inicia el MCP server como proceso local (stdio).
2. El **LLM (Client)** recibe el lenguaje natural del usuario y decide qué tool llamar.
3. El **MCP Server** valida los parámetros con Zod y ejecuta la operación.
4. **GitHub API** procesa la operación y devuelve el resultado al LLM, que lo comunica al usuario.

## Requisitos

- **Node.js** 20 o superior
- **npm** (incluido con Node.js)
- Un **GitHub Personal Access Token** con permisos de `repo` y `read:user`

## Instalación

1. Clona o descarga este repositorio.

2. Instala las dependencias:

```bash
npm install
```

3. Crea el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

4. Agrega tu GitHub token en `.env`:

```
GITHUB_TOKEN=ghp_tu_token_aqui
```

## Configuración del token de GitHub

### Obtener un Personal Access Token (classic)

1. Ingresa a [GitHub](https://github.com) y entra a **Settings** → **Developer settings**.
2. Selecciona **Personal access tokens** → **Tokens (classic)**.
3. Haz clic en **Generate new token** → **Generate new token (classic)**.
4. Configura:
   - **Note**: `mcp-server`
   - **Expiration**: elige una duración (recomendado 90 días).
5. Selecciona los **scopes**:
   - `repo` (acceso completo a repositorios, commits e issues).
   - `read:user` (información básica del usuario autenticado).
6. Haz clic en **Generate token**.
7. **Copia el token inmediatamente** (solo se muestra una vez) y pégalo en tu `.env`.

> ⚠️ Si cambias los permisos de un token existente, debes **regenerar el token** para que los cambios tomen efecto.

### Variables de entorno

| Variable | Requerido | Descripción |
|----------|-----------|-------------|
| `GITHUB_TOKEN` | ✅ | Token de acceso de GitHub |
| `LOG_LEVEL` | ❌ | Nivel de logging: `debug`, `info`, `warn`, `error` (por defecto `info`) |

## Uso

### Ejecutar como servidor de desarrollo

```bash
npm run dev
```

### Compilar a JavaScript

```bash
npm run build
npm start
```

### Probar con MCP Inspector

```bash
npm run inspector
```

Se abrirá el inspector en tu navegador. Haz clic en **Connect** y luego en la pestaña **Tools** para ver las 5 tools disponibles.

### Probar en Antigravity (u otro host MCP)

Configura el servidor MCP apuntando al comando:

```bash
npx tsx src/index.ts
```

Con el servidor conectado, el agente puede ejecutar las tools con lenguaje natural. Por ejemplo:

> "Creame un repositorio llamado mi-proyecto con descripción Prueba MCP"

## Tools disponibles

### 1. `list-repositories`

Lista los repositorios del usuario autenticado.

**Parámetros:** ninguno.

**Prompt de ejemplo:**
> "Cuales son mis repositorios mas recientes?"

---

### 2. `create-repository`

Crea un nuevo repositorio.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `name` | string | ✅ | Nombre (3-100 caracteres, alfanumérico con guiones) |
| `description` | string | ❌ | Descripción del repositorio |
| `private` | boolean | ❌ | `true` para privado (por defecto `false`) |

**Prompt de ejemplo:**
> "Crea un repositorio privado llamado portfolio con la descripcion Mis proyectos"

---

### 3. `create-issue`

Abre un issue en un repositorio.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `owner` | string | ✅ | Propietario del repositorio |
| `repo` | string | ✅ | Nombre del repositorio |
| `title` | string | ✅ | Título del issue (máx. 256 caracteres) |
| `body` | string | ❌ | Descripción del issue |

**Prompt de ejemplo:**
> "Abre un issue en el repositorio usuario/mi-repo titulado Bug en el login con esta descripcion: No permite ingresar con Google"

---

### 4. `list-issues`

Lista los issues de un repositorio.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `owner` | string | ✅ | Propietario del repositorio |
| `repo` | string | ✅ | Nombre del repositorio |
| `state` | string | ❌ | `open`, `closed` o `all` (por defecto `open`) |

**Prompt de ejemplo:**
> "Listame los issues abiertos del repositorio usuario/mi-repo"

---

### 5. `create-commit`

Crea un commit agregando o modificando un archivo.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `owner` | string | ✅ | Propietario del repositorio |
| `repo` | string | ✅ | Nombre del repositorio |
| `message` | string | ✅ | Mensaje del commit (máx. 72 caracteres) |
| `content` | string | ✅ | Contenido del archivo |
| `path` | string | ✅ | Ruta del archivo (ej. `README.md`) |
| `branch` | string | ❌ | Rama destino (por defecto `main`) |

**Prompt de ejemplo:**
> "Crea un commit en usuario/mi-repo con el mensaje 'feat: agrega readme', un archivo README.md con el contenido '# Mi proyecto' en la rama main"

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Ejecuta el servidor con `tsx` (modo desarrollo) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta el código compilado |
| `npm test` | Corre los tests con Vitest |
| `npm run inspector` | Abre el MCP Inspector para probar las tools |

## Testing

El proyecto incluye **37 tests unitarios** con Vitest:

| Archivo | Cobertura |
|---------|-----------|
| `tests/tool.test.ts` | Validación de schemas (inputs válidos e inválidos) |
| `tests/github.test.ts` | Operaciones de GitHub con Octokit mockeado y casos edge |
| `tests/error.test.ts` | Transformación de errores a mensajes amigables |
| `tests/retry.test.ts` | Retry con exponential backoff (rate limiting y errores de red) |

Ejecutá los tests:

```bash
npm test
```

## Logging

El servidor incluye un logger estructurado en `src/utils/logging.ts` con niveles configurables (`debug`, `info`, `warn`, `error`) a través de la variable `LOG_LEVEL`.

- Cada tool registra su invocación con `logger.info` (antes de validar el input).
- Los logs escriben a **stderr** para no corromper el protocolo stdio del MCP.
- El logger **sanitiza la salida**: si el `GITHUB_TOKEN` aparece en un mensaje, se reemplaza por `[REDACTED]`.

```bash
LOG_LEVEL=debug npm run dev
```

## Estrategia de retry (resiliencia)

El proyecto implementa **dos capas de reintento** ante errores transitorios:

### Capa 1: Plugin de Octokit (`src/github/client.ts`)

Usa `@octokit/plugin-retry` para reintentar automáticamente a nivel HTTP cada llamada a la API de GitHub:

- `403` por rate limit (respeta el header `Retry-After`).
- `429` (too many requests).
- Errores `5xx` transitorios (`500`, `502`, `503`, `504`).
- Errores de red (`ENOTFOUND`, `ECONNRESET`, etc.).

Los errores permanentes (`400`, `401`, `404`, `422`) **no** se reintentan porque sería inútil:

```typescript
octokit = new GitHubClient({
  auth: token,
  retry: { doNotRetry: [400, 401, 404, 422] },
});
```

### Capa 2: `withRetry` con exponential backoff (`src/utils/retry.ts`)

Refuerzo propio que reintenta cuando la operación lanza `RateLimitError` o `NetworkError` (ya transformados por el manejador de errores):

- Backoff exponencial: `baseDelay * 2^n`, con tope máximo.
- Respeta el `retryAfter` indicado en `RateLimitError`.
- Loguea cada reintento con `logger.warn`.
- Configurable: `maxRetries`, `baseDelayMs`, `maxDelayMs`.

Ambas capas coexisten: Octokit reintenta a nivel HTTP y `withRetry` cubre los errores que llegan transformados a la capa de operaciones.

## Estructura del proyecto

```
src/
├── index.ts              # Entry point: conecta el servidor con el transporte stdio
├── errors/               # Clases de error y transformación a mensajes claros
│   ├── index.ts          #   ValidationError, GitHubAPIError, AuthenticationError,
│   │                     #   NetworkError, RateLimitError
│   └── handler.ts        #   handleGitHubError(), getErrorMessage()
├── github/               # Capa de integración con la API de GitHub
│   ├── client.ts         #   Octokit autenticado + @octokit/plugin-retry
│   ├── operations.ts     #   Operaciones con withRetry: createRepository, createIssue, etc.
│   └── types.ts          #   Interfaces TypeScript de GitHub
├── schemas/              # Schemas de validación con Zod
│   └── index.ts
├── tools/                # Tools del MCP server
│   ├── register.ts       #   Registro de todas las tools + logger.info por invocación
│   ├── list-repositories.ts
│   ├── create-repository.ts
│   ├── create-issue.ts
│   ├── list-issues.ts
│   └── create-commit.ts
└── utils/                # Utilidades comunes
    ├── logging.ts         #   Logger estructurado con niveles y sanitización de token
    ├── retry.ts           #   withRetry con exponential backoff (rate limiting)
    ├── server.ts          #   Factory createServer()
    └── types.ts           #   Tipos TypeScript compartidos
tests/                     # Tests unitarios con Vitest (37 tests en 4 archivos)
```

## Manejo de errores

El servidor distingue cuatro tipos de errores y los convierte en mensajes claros que el LLM puede comunicar:

| Error | Mensaje al LLM |
|-------|----------------|
| `ValidationError` | "Los datos proporcionados no son válidos..." |
| `GitHubAPIError` (404) | "El repositorio [nombre] no fue encontrado. Verifica el nombre e intenta de nuevo" |
| `AuthenticationError` | "Tu token de GitHub es inválido o ha expirado. Genera uno nuevo..." |
| `NetworkError` | "No se pudo conectar a GitHub. Verifica tu conexión a internet." |
| `RateLimitError` | "Límite de peticiones a GitHub alcanzado" |