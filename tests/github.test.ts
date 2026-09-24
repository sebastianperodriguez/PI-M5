import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createRepository,
  listRepositories,
  createIssue,
  listIssues,
} from '../src/github/operations.js';
import { getOctokit, resetOctokit } from '../src/github/client.js';

vi.mock('../src/github/client.js', () => ({
  getOctokit: vi.fn(),
  resetOctokit: vi.fn(),
}));

const mockOctokit = {
  repos: {
    createForAuthenticatedUser: vi.fn(),
    listForAuthenticatedUser: vi.fn(),
  },
  issues: {
    create: vi.fn(),
    listForRepo: vi.fn(),
  },
};

describe('createRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getOctokit as ReturnType<typeof vi.fn>).mockReturnValue(mockOctokit);
  });

  it('crea un repositorio y retorna los datos', async () => {
    mockOctokit.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        id: 1,
        name: 'mi-repo',
        full_name: 'usuario/mi-repo',
        html_url: 'https://github.com/usuario/mi-repo',
      },
    });

    const repo = await createRepository({
      name: 'mi-repo',
      description: 'Test',
      private: true,
    });

    expect(mockOctokit.repos.createForAuthenticatedUser).toHaveBeenCalledWith({
      name: 'mi-repo',
      description: 'Test',
      private: true,
    });
    expect(repo.name).toBe('mi-repo');
    expect(repo.full_name).toBe('usuario/mi-repo');
  });

  it('usa private false por defecto', async () => {
    mockOctokit.repos.createForAuthenticatedUser.mockResolvedValue({ data: {} });
    await createRepository({ name: 'mi-repo' });
    expect(mockOctokit.repos.createForAuthenticatedUser).toHaveBeenCalledWith({
      name: 'mi-repo',
      description: undefined,
      private: false,
    });
  });
});

describe('listRepositories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getOctokit as ReturnType<typeof vi.fn>).mockReturnValue(mockOctokit);
  });

  it('lista los repositorios del usuario', async () => {
    mockOctokit.repos.listForAuthenticatedUser.mockResolvedValue({
      data: [
        { id: 1, name: 'repo-a' },
        { id: 2, name: 'repo-b' },
      ],
    });

    const repos = await listRepositories();
    expect(repos).toHaveLength(2);
    expect(repos[0].name).toBe('repo-a');
    expect(mockOctokit.repos.listForAuthenticatedUser).toHaveBeenCalledWith({
      sort: 'updated',
      per_page: 30,
    });
  });
});

describe('createIssue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getOctokit as ReturnType<typeof vi.fn>).mockReturnValue(mockOctokit);
  });

  it('crea un issue con los parámetros correctos', async () => {
    mockOctokit.issues.create.mockResolvedValue({
      data: { id: 10, number: 3, title: 'Bug', html_url: 'https://github.com/o/r/issues/3' },
    });

    const issue = await createIssue({
      owner: 'usuario',
      repo: 'mi-repo',
      title: 'Bug',
      body: 'Detalle',
    });

    expect(mockOctokit.issues.create).toHaveBeenCalledWith({
      owner: 'usuario',
      repo: 'mi-repo',
      title: 'Bug',
      body: 'Detalle',
    });
    expect(issue.number).toBe(3);
    expect(issue.title).toBe('Bug');
  });
});

describe('listIssues', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getOctokit as ReturnType<typeof vi.fn>).mockReturnValue(mockOctokit);
  });

  it('lista issues abiertos por defecto', async () => {
    mockOctokit.issues.listForRepo.mockResolvedValue({
      data: [
        { id: 1, number: 1, title: 'Issue 1', state: 'open' },
        { id: 2, number: 2, title: 'Issue 2', state: 'open' },
      ],
    });

    const issues = await listIssues({ owner: 'usuario', repo: 'mi-repo' });
    expect(issues).toHaveLength(2);
    expect(mockOctokit.issues.listForRepo).toHaveBeenCalledWith({
      owner: 'usuario',
      repo: 'mi-repo',
      state: 'open',
    });
  });
});

describe('casos edge', () => {
  afterEach(() => {
    resetOctokit();
  });

  it('lanza error cuando la API responde 404 (repo no existe)', async () => {
    (getOctokit as ReturnType<typeof vi.fn>).mockReturnValue({
      repos: {
        createForAuthenticatedUser: vi.fn().mockImplementation(() => {
          const err = new Error('Not Found') as Error & { status?: number };
          err.status = 404;
          throw err;
        }),
      },
    });

    await expect(
      createRepository({ name: 'no-existe' })
    ).rejects.toBeDefined();
  });

  it('encuentra el error de autenticación cuando el token falla', async () => {
    (getOctokit as ReturnType<typeof vi.fn>).mockReturnValue({
      issues: {
        create: vi.fn().mockImplementation(() => {
          const err = new Error('Bad credentials') as Error & { status?: number };
          err.status = 401;
          throw err;
        }),
      },
    });

    await expect(
      createIssue({ owner: 'u', repo: 'r', title: 't' })
    ).rejects.toBeDefined();
  });
});