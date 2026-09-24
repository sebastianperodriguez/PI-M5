import { CreateRepositorySchema } from "../schemas/index.js";
import { createRepository as createRepo } from "../github/operations.js";
import { getErrorMessage, handleGitHubError } from "../errors/handler.js";
import { logger } from "../utils/logging.js";



export async function createRepositoryTool(input:unknown) {
    logger.info(
      `createRepositoryTool invocada con input: ${JSON.stringify({
        name: (input as { name?: string })?.name,
        private: (input as { private?: boolean })?.private,
      })}`
    );

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
} catch (error) {
  const appError = handleGitHubError(error);
  return {
    data: getErrorMessage(appError),
    isError: true,
  };
}
}