export type UserRole = "user" | "admin";

export interface PublicUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}
