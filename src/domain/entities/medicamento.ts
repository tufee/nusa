import { IMedicamento } from './interfaces/medicamento';

export class Medicamento implements IMedicamento {
  id: string;
  nome: string;
  categoria: string;
  codigo_anvisa: string;

  constructor(properties: IMedicamento) {
    this.id = properties.id;
    this.nome = properties.nome;
    this.categoria = properties.categoria;
    this.codigo_anvisa = properties.codigo_anvisa;
  }
}
