import { z } from 'zod';
export const GitHubRepoNameSchema = z
    .string()
    .min(3, 'El nombre del repositorio debe tener al menos 3 caracteres')
    .max(100, 'El nombre del repositorio no puede tener más de 100 caracteres')
    .regex(/^[a-zA-Z0-9._-]+$/, 'El nombre solo puede contener letras, números, puntos, guiones y guiones bajos');
export const CreateRepositorySchema = z.object({
    name: GitHubRepoNameSchema,
    description: z
        .string()
        .max(350, 'La descripción no puede tener más de 350 caracteres')
        .optional(),
    private: z.boolean().optional().default(false),
});
export const CreateIssueSchema = z.object({
    owner: z
        .string()
        .min(1, 'El propietario del repositorio es requerido'),
    repo: GitHubRepoNameSchema,
    title: z
        .string()
        .min(1, 'El título del issue es requerido')
        .max(256, 'El título no puede tener más de 256 caracteres'),
    body: z
        .string()
        .max(65536, 'El cuerpo del issue es demasiado largo')
        .optional(),
});
export const ListIssuesSchema = z.object({
    owner: z
        .string()
        .min(1, 'El propietario del repositorio es requerido'),
    repo: GitHubRepoNameSchema,
    state: z.enum(['open', 'closed', 'all']).optional().default('open'),
});
export const CreateCommitSchema = z.object({
    owner: z
        .string()
        .min(1, 'El propietario del repositorio es requerido'),
    repo: GitHubRepoNameSchema,
    message: z
        .string()
        .min(1, 'El mensaje del commit es requerido')
        .max(72, 'El mensaje no puede tener más de 72 caracteres'),
    content: z
        .string()
        .min(1, 'El contenido del archivo es requerido'),
    path: z
        .string()
        .min(1, 'La ruta del archivo es requerida')
        .regex(/^[a-zA-Z0-9/_.-]+$/, 'La ruta contiene caracteres no válidos'),
    branch: z
        .string()
        .optional()
        .default('main'),
});
export const ListRepositoriesSchema = z.object({});
//# sourceMappingURL=index.js.map