import { IProfileResponse } from './profile-response.interface';

export interface IProfileFormData {
  name: string;
  email: string;
  linkedInUrl: string;
  githubUrl: string;
}

export interface ProfileState {
  profile: IProfileResponse | null;
  profileUserId: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}
