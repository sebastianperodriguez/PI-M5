export interface GitHubRepository {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    private: boolean;
    html_url: string;
    created_at: string;
    updated_at: string;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
}
export interface GitHubIssue {
    id: number;
    number: number;
    title: string;
    body: string | null;
    state: 'open' | 'closed';
    html_url: string;
    created_at: string;
    updated_at: string;
    user: {
        login: string;
        avatar_url: string;
    } | null;
    labels: Array<{
        name: string;
        color: string;
    }>;
}
export interface GitHubCommit {
    sha: string;
    node_id: string;
    url: string;
    message: string;
    author: {
        name: string;
        email: string;
        date: string;
    };
    committer: {
        name: string;
        email: string;
        date: string;
    };
    tree: {
        sha: string;
        url: string;
    };
    parents: Array<{
        sha: string;
        url: string;
    }>;
    verification: {
        verified: boolean;
        reason: string;
        signature: string | null;
        payload: string | null;
    };
    html_url: string;
}
export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    name: string | null;
    email: string | null;
    public_repos: number;
}
export interface CreateRepositoryParams {
    name: string;
    description?: string;
    private?: boolean;
}
export interface CreateIssueParams {
    owner: string;
    repo: string;
    title: string;
    body?: string;
}
export interface CreateCommitParams {
    owner: string;
    repo: string;
    message: string;
    content: string;
    path: string;
    branch?: string;
}
export interface ListIssuesParams {
    owner: string;
    repo: string;
    state?: 'open' | 'closed' | 'all';
}
//# sourceMappingURL=types.d.ts.map