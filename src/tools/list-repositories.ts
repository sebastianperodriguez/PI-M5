import { ListRepositoriesSchema } from '../schemas/index.js';
import { listRepositories } from '../github/operations.js';
import { handleGitHubError, getErrorMessage } from '../errors/handler.js';

export async function listRepositoriesTool(input: unknown) {
  const result = ListRepositoriesSchema.safeParse(input);

  if (!result.success) {
    return {
      data: `Error de validación: ${result.error.message}`,
      isError: true,
    };
  }

  try {
    const repos = await listRepositories();

    const reposList = repos
      .map(
        (repo) =>
          `- ${repo.name}: ${repo.description || 'Sin descripción'} (${repo.private ? 'Privado' : 'Público'})`
      )
      .join('\n');

    return {
      data: `Tus repositorios:\n${reposList}`,
    };
  } catch (error) {
    const appError = handleGitHubError(error);
    return {
      data: getErrorMessage(appError),
      isError: true,
    };
  }
}
