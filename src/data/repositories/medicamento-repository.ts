import Knex from 'knex';
import config from '../../../knexfile';
import { IMedicamento } from '../../domain/entities/interfaces/medicamento';
import { IMedicamentoRepository } from './interfaces/medicamento';

const knex = Knex(config);

export class MedicamentoRepository implements IMedicamentoRepository {
  async create(medicamento: Omit<IMedicamento, 'id'>): Promise<IMedicamento> {
    const [createdMedicamento] = await knex<IMedicamento>('medicamentos')
      .insert(medicamento)
      .returning('*');
    return createdMedicamento;
  }

  async findByCodigoAnvisa(
    codigo_anvisa: string
  ): Promise<IMedicamento | null> {
    const [medicamento] = await knex<IMedicamento>('medicamentos')
      .select('*')
      .where({ codigo_anvisa });
    return medicamento;
  }
}
