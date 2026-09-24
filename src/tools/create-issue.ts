import { CreateIssueSchema } from "../schemas/index.js";
import { createIssue } from "../github/operations.js";
import { handleGitHubError, getErrorMessage } from "../errors/handler.js";
import { logger } from "../utils/logging.js";

export async function createIssueTool(input: unknown) {
  logger.info(
    `createIssueTool invocada con input: ${JSON.stringify({
      owner: (input as { owner?: string })?.owner,
      repo: (input as { repo?: string })?.repo,
      title: (input as { title?: string })?.title,
    })}`
  );

  const result = CreateIssueSchema.safeParse(input);

  if (!result.success) {
    return {
      data: `Error de validación: ${result.error.message}`,
      isError: true,
    };
  }

  try {
    const issue = await createIssue({
      owner: result.data.owner,
      repo: result.data.repo,
      title: result.data.title,
      body: result.data.body,
    });

    return {
      data: `Issue #${issue.number} creado exitosamente.\nTítulo: ${issue.title}\nURL: ${issue.html_url}`,
    };
  } catch (error) {
    const appError = handleGitHubError(error);
    return {
      data: getErrorMessage(appError),
      isError: true,
    };
  }
}
