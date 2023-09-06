import { IMedicamento } from './interfaces/medicamento';

export class Medicamento implements IMedicamento {
  id: string;
  nome: string;
  categoria: string;
  codigoAnvisa: string;

  constructor(properties: IMedicamento) {
    this.id = properties.id;
    this.nome = properties.nome;
    this.categoria = properties.categoria;
    this.codigoAnvisa = properties.codigoAnvisa;
  }
}
