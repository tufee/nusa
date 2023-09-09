import { IPaciente } from './interfaces/paciente';

export class Paciente implements IPaciente {
  id: string;
  nome: string;
  cpf: string;
  data_nascimento: Date;

  constructor(properties: IPaciente) {
    this.id = properties.id;
    this.nome = properties.nome;
    this.cpf = properties.cpf;
    this.data_nascimento = properties.data_nascimento;
  }
}
