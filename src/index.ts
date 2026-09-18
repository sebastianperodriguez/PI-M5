import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CreateRepositorySchema,
  CreateIssueSchema,
  ListIssuesSchema,
  CreateCommitSchema,
  ListRepositoriesSchema,
} from './schemas/index.js';
import {
  createRepository,
  createIssue,
  listIssues,
  createCommit,
  listRepositories,
} from './github/operations.js';
import { handleGitHubError, getErrorMessage } from './errors/handler.js';

const server = new McpServer({
  name: 'github-mcp-server',
  version: '1.0.0',
});

server.tool(
  'list-repositories',
  'Lista los repositorios del usuario autenticado',
  {},
  async () => {
    try {
      const repos = await listRepositories();
      const reposList = repos
        .map(
          (repo) =>
            `- ${repo.name}: ${repo.description || 'Sin descripción'} (${repo.private ? 'Privado' : 'Público'})`
        )
        .join('\n');
      return {
        content: [{ type: 'text' as const, text: `Tus repositorios:\n${reposList}` }],
      };
    } catch (error) {
      const appError = handleGitHubError(error);
      return {
        content: [{ type: 'text' as const, text: getErrorMessage(appError) }],
        isError: true,
      };
    }
  }
);

server.tool(
  'create-repository',
  'Crea un nuevo repositorio en GitHub',
  {
    name: CreateRepositorySchema.shape.name,
    description: CreateRepositorySchema.shape.description,
    private: CreateRepositorySchema.shape.private,
  },
  async ({ name, description, private: isPrivate }) => {
    try {
      const repo = await createRepository({ name, description, private: isPrivate });
      return {
        content: [
          {
            type: 'text' as const,
            text: `Repositorio "${repo.name}" creado exitosamente.\nURL: ${repo.html_url}`,
          },
        ],
      };
    } catch (error) {
      const appError = handleGitHubError(error);
      return {
        content: [{ type: 'text' as const, text: getErrorMessage(appError) }],
        isError: true,
      };
    }
  }
);

server.tool(
  'create-issue',
  'Abre un issue en un repositorio',
  {
    owner: CreateIssueSchema.shape.owner,
    repo: CreateIssueSchema.shape.repo,
    title: CreateIssueSchema.shape.title,
    body: CreateIssueSchema.shape.body,
  },
  async ({ owner, repo, title, body }) => {
    try {
      const issue = await createIssue({ owner, repo, title, body });
      return {
        content: [
          {
            type: 'text' as const,
            text: `Issue #${issue.number} creado exitosamente.\nTítulo: ${issue.title}\nURL: ${issue.html_url}`,
          },
        ],
      };
    } catch (error) {
      const appError = handleGitHubError(error);
      return {
        content: [{ type: 'text' as const, text: getErrorMessage(appError) }],
        isError: true,
      };
    }
  }
);

server.tool(
  'list-issues',
  'Lista issues de un repositorio',
  {
    owner: ListIssuesSchema.shape.owner,
    repo: ListIssuesSchema.shape.repo,
    state: ListIssuesSchema.shape.state,
  },
  async ({ owner, repo, state }) => {
    try {
      const issues = await listIssues({ owner, repo, state });
      const issuesList = issues
        .map((issue) => `- #${issue.number}: ${issue.title} [${issue.state}]`)
        .join('\n');
      return {
        content: [
          {
            type: 'text' as const,
            text: issuesList || 'No hay issues en este repositorio.',
          },
        ],
      };
    } catch (error) {
      const appError = handleGitHubError(error);
      return {
        content: [{ type: 'text' as const, text: getErrorMessage(appError) }],
        isError: true,
      };
    }
  }
);

server.tool(
  'create-commit',
  'Crea un commit con cambios en un archivo',
  {
    owner: CreateCommitSchema.shape.owner,
    repo: CreateCommitSchema.shape.repo,
    message: CreateCommitSchema.shape.message,
    content: CreateCommitSchema.shape.content,
    path: CreateCommitSchema.shape.path,
    branch: CreateCommitSchema.shape.branch,
  },
  async ({ owner, repo, message, content, path, branch }) => {
    try {
      const commit = await createCommit({ owner, repo, message, content, path, branch });
      return {
        content: [
          {
            type: 'text' as const,
            text: `Commit creado exitosamente.\nSHA: ${commit.sha}\nMensaje: ${commit.message}`,
          },
        ],
      };
    } catch (error) {
      const appError = handleGitHubError(error);
      return {
        content: [{ type: 'text' as const, text: getErrorMessage(appError) }],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GitHub MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
