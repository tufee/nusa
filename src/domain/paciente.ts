import { IPaciente } from './interfaces/paciente';

export class Paciente implements IPaciente {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: Date;

  constructor(properties: IPaciente) {
    this.id = properties.id;
    this.nome = properties.nome;
    this.cpf = properties.cpf;
    this.dataNascimento = properties.dataNascimento;
  }
}
