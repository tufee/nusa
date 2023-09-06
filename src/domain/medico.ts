import { IMedico } from './interfaces/medico';

export class Medico implements IMedico {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: Date;

  constructor(properties: IMedico) {
    this.id = properties.id;
    this.nome = properties.nome;
    this.cpf = properties.cpf;
    this.dataNascimento = properties.dataNascimento;
  }
}
