export type Role =
  | "ADMIN"
  | "GESTOR"
  | "ALMOXARIFE"
  | "TECNICO_SST"
  | "SUPERVISOR"
  | "COLABORADOR";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
