export interface ISignIn {
  email: string;
  password: string;
}

export interface ISignUp extends ISignIn {
  firstName: string;
  lastName: string;
  confirmPassword: string;
}
