import type { GitHubRepository, GitHubIssue, GitHubCommit, GitHubUser, CreateRepositoryParams, CreateIssueParams, CreateCommitParams, ListIssuesParams } from './types.js';
export declare function createRepository(params: CreateRepositoryParams): Promise<GitHubRepository>;
export declare function listRepositories(): Promise<GitHubRepository[]>;
export declare function createIssue(params: CreateIssueParams): Promise<GitHubIssue>;
export declare function listIssues(params: ListIssuesParams): Promise<GitHubIssue[]>;
export declare function createCommit(params: CreateCommitParams): Promise<GitHubCommit>;
export declare function getCurrentUser(): Promise<GitHubUser>;
//# sourceMappingURL=operations.d.ts.map