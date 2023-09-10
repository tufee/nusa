import Knex from 'knex';
import config from '../../../knexfile';
import { IReceita } from '../../domain/entities/interfaces/receita';
import { IReceitaRepository } from './interfaces/receita';

const knex = Knex(config);

export class ReceitaRepository implements IReceitaRepository {
  async create(receita: Omit<IReceita, 'id'>): Promise<IReceita> {
    const [createdReceita] = await knex<IReceita>('receitas')
      .insert(receita)
      .returning('*');
    return createdReceita;
  }
}
