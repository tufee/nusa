import { IReceita } from './interfaces/receita';

export class Receita implements IReceita {
  id: string;
  medico_id: string;
  paciente_id: string;
  medicamento_id: string;
  data_prescricao: Date;

  constructor(properties: IReceita) {
    this.id = properties.id;
    this.medico_id = properties.medico_id;
    this.paciente_id = properties.paciente_id;
    this.medicamento_id = properties.medicamento_id;
    this.data_prescricao = properties.data_prescricao;
  }
}
