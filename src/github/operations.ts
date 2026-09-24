import { getOctokit } from './client.js';
import { withRetry } from '../utils/retry.js';
import { logger } from '../utils/logging.js';
import type {
  GitHubRepository,
  GitHubIssue,
  GitHubCommit,
  GitHubUser,
  CreateRepositoryParams,
  CreateIssueParams,
  CreateCommitParams,
  ListIssuesParams,
} from './types.js';

export async function createRepository(
  params: CreateRepositoryParams
): Promise<GitHubRepository> {
  logger.debug(`createRepository: ${params.name}`);
  return withRetry(async () => {
    const octokit = getOctokit();
    const { data } = await octokit.repos.createForAuthenticatedUser({
      name: params.name,
      description: params.description,
      private: params.private ?? false,
    });
    return data as GitHubRepository;
  });
}

export async function listRepositories(): Promise<GitHubRepository[]> {
  logger.debug('listRepositories');
  return withRetry(async () => {
    const octokit = getOctokit();
    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 30,
    });
    return data as GitHubRepository[];
  });
}

export async function createIssue(params: CreateIssueParams): Promise<GitHubIssue> {
  logger.debug(`createIssue: ${params.owner}/${params.repo}: ${params.title}`);
  return withRetry(async () => {
    const octokit = getOctokit();
    const { data } = await octokit.issues.create({
      owner: params.owner,
      repo: params.repo,
      title: params.title,
      body: params.body,
    });
    return data as GitHubIssue;
  });
}

export async function listIssues(params: ListIssuesParams): Promise<GitHubIssue[]> {
  logger.debug(`listIssues: ${params.owner}/${params.repo}`);
  return withRetry(async () => {
    const octokit = getOctokit();
    const { data } = await octokit.issues.listForRepo({
      owner: params.owner,
      repo: params.repo,
      state: params.state ?? 'open',
    });
    return data as GitHubIssue[];
  });
}

export async function createCommit(params: CreateCommitParams): Promise<GitHubCommit> {
  logger.debug(`createCommit: ${params.owner}/${params.repo}`);
  const branch = params.branch ?? 'main';

  return withRetry(async () => {
    const octokit = getOctokit();

    const { data: refData } = await octokit.git.getRef({
      owner: params.owner,
      repo: params.repo,
      ref: `heads/${branch}`,
    });

    const latestCommitSha = refData.object.sha;

    const { data: commitData } = await octokit.git.createCommit({
      owner: params.owner,
      repo: params.repo,
      message: params.message,
      tree: latestCommitSha,
      content: Buffer.from(params.content).toString('base64'),
      path: params.path,
    });

    await octokit.git.updateRef({
      owner: params.owner,
      repo: params.repo,
      ref: `heads/${branch}`,
      sha: commitData.sha,
    });

    const { data: fullCommit } = await octokit.git.getCommit({
      owner: params.owner,
      repo: params.repo,
      commit_sha: commitData.sha,
    });

    return {
      sha: fullCommit.sha,
      node_id: fullCommit.node_id,
      url: fullCommit.url,
      message: fullCommit.message,
      author: fullCommit.author,
      committer: fullCommit.committer,
      tree: fullCommit.tree,
      parents: fullCommit.parents,
      verification: fullCommit.verification as GitHubCommit['verification'],
      html_url: fullCommit.html_url,
    };
  });
}

export async function getCurrentUser(): Promise<GitHubUser> {
  logger.debug('getCurrentUser');
  return withRetry(async () => {
    const octokit = getOctokit();
    const { data } = await octokit.users.getAuthenticated();
    return data as GitHubUser;
  });
}