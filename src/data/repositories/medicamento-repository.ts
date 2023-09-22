import Knex from 'knex';
import config from '../../../knexfile';
import { IMedicamento } from '../../domain/entities/interfaces/medicamento';
import { IMedicamentoRepository } from './interfaces/medicamento';

const knex = Knex(config);

export class MedicamentoRepository implements IMedicamentoRepository {
  async create(medicamento: Omit<IMedicamento, 'id'>): Promise<IMedicamento[]> {
    return await knex<IMedicamento>('medicamentos')
      .insert(medicamento)
      .returning('*');
  }

  async findByCodigoAnvisa(
    codigo_anvisa: string
  ): Promise<IMedicamento[] | null> {
    return await knex<IMedicamento>('medicamentos')
      .select('*')
      .where({ codigo_anvisa });
  }

  async findAll(): Promise<IMedicamento[] | null> {
    return await knex<IMedicamento>('medicamentos').select();
  }

  async search(name: string): Promise<IMedicamento[] | null> {
    return await knex<IMedicamento>('medicamentos').whereLike(
      'nome',
      `%${name}%`
    );
  }
}
