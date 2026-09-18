import { z } from 'zod';
export declare const GitHubRepoNameSchema: z.ZodString;
export declare const CreateRepositorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    private: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const CreateIssueSchema: z.ZodObject<{
    owner: z.ZodString;
    repo: z.ZodString;
    title: z.ZodString;
    body: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const ListIssuesSchema: z.ZodObject<{
    owner: z.ZodString;
    repo: z.ZodString;
    state: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        all: "all";
        closed: "closed";
        open: "open";
    }>>>;
}, z.core.$strip>;
export declare const CreateCommitSchema: z.ZodObject<{
    owner: z.ZodString;
    repo: z.ZodString;
    message: z.ZodString;
    content: z.ZodString;
    path: z.ZodString;
    branch: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const ListRepositoriesSchema: z.ZodObject<{}, z.core.$strip>;
export type CreateRepositoryInput = z.infer<typeof CreateRepositorySchema>;
export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;
export type ListIssuesInput = z.infer<typeof ListIssuesSchema>;
export type CreateCommitInput = z.infer<typeof CreateCommitSchema>;
//# sourceMappingURL=index.d.ts.map