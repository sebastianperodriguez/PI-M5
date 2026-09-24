import { describe, it, expect } from 'vitest';
import {
  CreateRepositorySchema,
  CreateIssueSchema,
  ListIssuesSchema,
  CreateCommitSchema,
} from '../src/schemas/index.js';

describe('CreateRepositorySchema', () => {
  it('acepta un input válido', () => {
    const result = CreateRepositorySchema.safeParse({
      name: 'mi-repositorio',
      description: 'Un repo de prueba',
      private: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('mi-repositorio');
      expect(result.data.private).toBe(true);
    }
  });

  it('completa private con false por defecto', () => {
    const result = CreateRepositorySchema.safeParse({ name: 'mi-repo' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.private).toBe(false);
    }
  });

  it('rechaza un nombre de menos de 3 caracteres', () => {
    const result = CreateRepositorySchema.safeParse({ name: 'ab' });
    expect(result.success).toBe(false);
  });

  it('rechaza un nombre con caracteres inválidos', () => {
    const result = CreateRepositorySchema.safeParse({ name: 'repo invalido!' });
    expect(result.success).toBe(false);
  });

  it('rechaza un nombre de más de 100 caracteres', () => {
    const result = CreateRepositorySchema.safeParse({
      name: 'a'.repeat(101),
    });
    expect(result.success).toBe(false);
  });
});

describe('CreateIssueSchema', () => {
  it('acepta un input válido', () => {
    const result = CreateIssueSchema.safeParse({
      owner: 'mi-usuario',
      repo: 'mi-repositorio',
      title: 'Bug encontrado',
      body: 'Descripción del bug',
    });
    expect(result.success).toBe(true);
  });

  it('body es opcional', () => {
    const result = CreateIssueSchema.safeParse({
      owner: 'mi-usuario',
      repo: 'mi-repositorio',
      title: 'Solo título',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza inputs sin título', () => {
    const result = CreateIssueSchema.safeParse({
      owner: 'mi-usuario',
      repo: 'mi-repositorio',
    });
    expect(result.success).toBe(false);
  });
});

describe('ListIssuesSchema', () => {
  it('acepta estado "open" por defecto', () => {
    const result = ListIssuesSchema.safeParse({
      owner: 'mi-usuario',
      repo: 'mi-repositorio',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.state).toBe('open');
    }
  });

  it('acepta estados válidos', () => {
    for (const state of ['open', 'closed', 'all']) {
      const result = ListIssuesSchema.safeParse({
        owner: 'mi-usuario',
        repo: 'mi-repositorio',
        state,
      });
      expect(result.success).toBe(true);
    }
  });

  it('rechaza un estado inválido', () => {
    const result = ListIssuesSchema.safeParse({
      owner: 'mi-usuario',
      repo: 'mi-repositorio',
      state: 'pendiente',
    });
    expect(result.success).toBe(false);
  });
});

describe('CreateCommitSchema', () => {
  it('acepta un input válido', () => {
    const result = CreateCommitSchema.safeParse({
      owner: 'mi-usuario',
      repo: 'mi-repositorio',
      message: 'feat: agrega readme',
      content: 'Hola mundo',
      path: 'README.md',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.branch).toBe('main');
    }
  });

  it('rechaza un mensaje vacío', () => {
    const result = CreateCommitSchema.safeParse({
      owner: 'mi-usuario',
      repo: 'mi-repositorio',
      message: '',
      content: 'Hola',
      path: 'README.md',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza una ruta con caracteres inválidos', () => {
    const result = CreateCommitSchema.safeParse({
      owner: 'mi-usuario',
      repo: 'mi-repositorio',
      message: 'feat: agrega readme',
      content: 'Hola',
      path: 'un archivo con espacios!.md',
    });
    expect(result.success).toBe(false);
  });
});