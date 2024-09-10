export interface User {
  email: string;
  roles: string[];
  token?: string;
  extra?: any;
}