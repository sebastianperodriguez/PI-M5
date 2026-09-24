import { ListIssuesSchema } from "../schemas/index.js";
import { listIssues } from "../github/operations.js";
import { handleGitHubError, getErrorMessage } from "../errors/handler.js";
import { logger } from "../utils/logging.js";

export async function listIssuesTool(input: unknown) {
  logger.info(
    `listIssuesTool invocada con input: ${JSON.stringify({
      owner: (input as { owner?: string })?.owner,
      repo: (input as { repo?: string })?.repo,
      state: (input as { state?: string })?.state,
    })}`
  );

  const result = ListIssuesSchema.safeParse(input);

  if (!result.success) {
    return {
      data: `Error de validación: ${result.error.message}`,
      isError: true,
    };
  }

  try {
    const issues = await listIssues({
      owner: result.data.owner,
      repo: result.data.repo,
      state: result.data.state,
    });

    const issuesList = issues
      .map((issue) => `- #${issue.number}: ${issue.title} [${issue.state}]`)
      .join("\n");

    return {
      data: issuesList || "No hay issues en este repositorio.",
    };
  } catch (error) {
    const appError = handleGitHubError(error);
    return {
      data: getErrorMessage(appError),
      isError: true,
    };
  }
}
