import { CreateCommitSchema } from "../schemas/index.js";
import { createCommit } from "../github/operations.js";
import { handleGitHubError, getErrorMessage } from "../errors/handler.js";
export async function createCommitTool(input) {
    const result = CreateCommitSchema.safeParse(input);
    if (!result.success) {
        return {
            data: `Error de validación: ${result.error.message}`,
            isError: true,
        };
    }
    try {
        const commit = await createCommit({
            owner: result.data.owner,
            repo: result.data.repo,
            message: result.data.message,
            content: result.data.content,
            path: result.data.path,
            branch: result.data.branch,
        });
        return {
            data: `Commit creado exitosamente.\nSHA: ${commit.sha}\nMensaje: ${commit.message}`,
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
//# sourceMappingURL=create-commit.js.map