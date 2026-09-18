import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

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

  octokit = new Octokit({ auth: token });
  return octokit;
}

export function resetOctokit(): void {
  octokit = null;
}
