import { IMedicamento } from './medicamento';
import { IMedico } from './medico';
import { IPaciente } from './paciente';

export interface IReceita {
  id: string;
  medico: IMedico;
  paciente: IPaciente;
  medicamento: IMedicamento;
  dataPrescricao: Date;
}
