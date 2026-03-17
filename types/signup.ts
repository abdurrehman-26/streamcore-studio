export type SignupData = {
  _id: string;
  name: string;
  email: string,
  emailVerified: boolean,
  password: string,
};

export type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirm_password?: string;
};