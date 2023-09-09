import { IMedicamento } from './interfaces/medicamento';
import { IMedico } from './interfaces/medico';
import { IPaciente } from './interfaces/paciente';
import { IReceita } from './interfaces/receita';

export class Receita implements IReceita {
  id: string;
  medico: IMedico;
  paciente: IPaciente;
  medicamento: IMedicamento;
  data_prescricao: Date;

  constructor(properties: IReceita) {
    this.id = properties.id;
    this.medico = properties.medico;
    this.paciente = properties.paciente;
    this.medicamento = properties.medicamento;
    this.data_prescricao = properties.data_prescricao;
  }
}
