import { IPessoa } from './pessoa';

export interface IMedico extends IPessoa {
  tipo: string;
  senha: string;
}
