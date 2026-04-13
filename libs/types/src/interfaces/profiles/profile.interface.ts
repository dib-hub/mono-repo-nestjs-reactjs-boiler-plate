export interface IProfileFormData {
  name: string;
  email: string;
  linkedInUrl?: string;
  githubUrl?: string;
}

export interface IProfile extends IProfileFormData {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProfileState {
  profile: IProfile | null;
  profileUserId: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}
