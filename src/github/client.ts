import { Octokit } from '@octokit/rest';
import { retry } from '@octokit/plugin-retry';
import dotenv from 'dotenv';

dotenv.config();

const GitHubClient = Octokit.plugin(retry);

let octokit: Octokit | null = null;

export function getOctokit(): Octokit {
  if (octokit) {
    return octokit;
  }

  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error(
      'GITHUB_TOKEN no está configurado. ' +
      'Crea un archivo .env con tu GitHub Personal Access Token.'
    );
  }

  octokit = new GitHubClient({
    auth: token,
    retry: {
      doNotRetry: [400, 401, 404, 422],
      retries: 3,
    },
  });
  return octokit;
}

export function resetOctokit(): void {
  octokit = null;
}