export interface IProfile {
  id: string;
  name: string;
  email: string;
  linkedInUrl: string | null;
  githubUrl: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
