Consigna
Detalle
Crear un MCP Server en Node.js con TypeScript que exponga tools para automatizar operaciones comunes en GitHub.

El server debe conectarse con Antigravity permitiendo que un agente AI (Gemini, Claude, u otro LLM soportado) ejecute acciones en GitHub mediante comandos en lenguaje natural.
El proyecto debe incluir: validación de inputs con Zod, manejo robusto de errores, tests unitarios con Vitest, documentación completa, y una presentación en vivo donde demuestres y defiendas tu implementación.
Requerimientos funcionales (mínimos)
🛠️Tools de GitHub (mínimo 5 tools):
create_repository: crear un nuevo repositorio con nombre y descripción
create_issue: abrir un issue en un repositorio con título y body
list_repositories: listar repositorios del usuario autenticado
create_commit: hacer un commit agregando o modificando un archivo en un repositorio
list_issues: listar issues abiertos de un repositorio específico
✅Validación de inputs:
Cada tool debe tener un schema de Zod que valide los parámetros
Nombres de repositorios deben cumplir reglas de GitHub (3-100 caracteres, alfanuméricos y guiones)
Mensajes de error claros cuando la validación falla
Los schemas deben prevenir inputs que causarían errores en la API de GitHub
🙅🏽‍♀️Manejo de errores:
Distinción entre tipos de errores: ValidationError, GitHubAPIError, AuthenticationError, NetworkError
Transformación de errores técnicos a lenguaje natural que el LLM pueda comunicar
Ejemplo: error 404 debe retornar "El repositorio [nombre] no fue encontrado. Verifica el nombre e intenta de nuevo"
Retry logic cuidando errores de rate limiting
Logging apropiado para debugging sin exponer información sensible
👩🏽‍💻Configuración en Antigravity:
El MCP server debe ser configurable en Antigravity siguiendo la estructura de configuración de MCP
Debe comunicarse correctamente con el LLM que ocupes
Variables de entorno para el GitHub token deben estar correctamente configuradas
✍🏽Testing:
Mínimo 8 unit tests con Vitest cubriendo:
Validación de schemas (inputs válidos pasan, inválidos fallan)
Funciones de GitHub con Octokit mockeado
Casos edge (repositorio no existe, credenciales inválidas)
Transformación de errores a mensajes en lenguaje natural
📁Documentación:
README comprehensivo con descripción del proyecto, requisitos, instalación paso a paso, configuración, ejemplos de uso
Documentación de cada tool con ejemplos de prompts efectivos
Diagrama de arquitectura mostrando: Antigravity (Host) -> LLM (Client) → MCP Server → GitHub API
Instrucciones claras para obtener GitHub Personal Access Token
El README debe ser suficiente para que otro/a desarrollador/a instale y use tu MCP server sin ayuda adicional
📑Presentación y defensa:
Preparar presentación que incluya:
Demostración en vivo del MCP server funcionando en Antigravity
Explicación de la arquitectura y decisiones técnicas
Walkthrough del código más interesante o desafiante
Aprendizajes clave del proyecto
Desafíos enfrentados y cómo los resolviste
Estar preparado/a para responder preguntas técnicas sobre tu implementación
Mostrar tests pasando y explicar estrategia de testing
😎Extra credit
Tools avanzados de GitHub (agregar al menos 3):
create_pull_request: crear PR entre branches
add_collaborator: agregar colaborador a un repositorio
create_branch: crear nueva branch en un repositorio
close_issue: cerrar un issue específico
add_comment_to_issue: comentar en un issue
list_commits: listar commits recientes de un repositorio
create_label: crear labels personalizados
assign_issue: asignar issue a un usuario
Configuración flexible y multi-usuario:
Soporte para múltiples GitHub accounts (configuración por usuario)
Configuración de organizaciones de GitHub además de repos personales
Caché de resultados para reducir llamadas a la API (almacenar lista de repos en memoria por X minutos)
Rate limiting interno para no exceder límites de GitHub
Métricas de uso: trackear qué tools se usan más frecuentemente
Experiencia de desarrollador mejorada:
Logging estructurado con niveles (debug, info, warn, error)
Modo verbose para debugging detallado
Validaciones pre-flight que verifican permisos antes de ejecutar (ejemplo: verificar que tienes permisos de escritura antes de intentar crear issue)
Sugerencias automáticas cuando un comando falla (ejemplo: si intentas crear repo en org sin permisos, sugerir crear en tu cuenta personal)
Health check endpoint que verifica conectividad con GitHub
Documentación interactiva: generar documentación de tools automáticamente desde los schemas de Zod
Implementa una, dos, o las tres opciones según tu interés y disponibilidad. Puedes escoger la que más te llame la atención.

Estos extras no son obligatorios, pero pueden ayudarte a demostrar iniciativa y profundidad técnica.