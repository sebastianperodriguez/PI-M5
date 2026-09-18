import { CreateRepositorySchema } from "../schemas/index.js";
import { createRepository as createRepo } from "../github/operations.js";
import { getErrorMessage, handleGitHubError } from "../errors/handler.js";
export async function createRepositoryTool(input) {
    const result = CreateRepositorySchema.safeParse(input);
    if (!result.success) {
        return {
            data: `Error de validación: ${result.error.message}`,
            isError: true,
        };
    }
    try {
        const repo = await createRepo({
            name: result.data.name,
            description: result.data.description,
            private: result.data.private,
        });
        return {
            data: `Repositorio "${repo.name}" creado exitosamente.\nURL: ${repo.html_url}`,
        };
    }
    catch (error) {
        const appError = handleGitHubError(error);
        return {
            data: getErrorMessage(appError),
            isError: true,
        };
    }
}
//# sourceMappingURL=create-repository.js.map