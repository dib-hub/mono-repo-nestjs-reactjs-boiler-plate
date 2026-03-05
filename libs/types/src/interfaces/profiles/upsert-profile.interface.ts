export interface IUpsertProfile {
  name: string;
  email: string;
  linkedInUrl?: string | null;
  githubUrl?: string | null;
}
