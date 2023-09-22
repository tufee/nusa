import Knex from 'knex';
import config from '../../../knexfile';
import { IReceita } from '../../domain/entities/interfaces/receita';
import { IReceitaRepository } from './interfaces/receita';

const knex = Knex(config);

export class ReceitaRepository implements IReceitaRepository {
  async create(receita: Omit<IReceita, 'id'>): Promise<IReceita[]> {
    return await knex<IReceita>('receitas').insert(receita).returning('*');
  }

  async findAll(): Promise<IReceita[]> {
    return await knex('receitas')
      .join('medicos', 'receitas.medico_id', '=', 'medicos.id')
      .join('pacientes', 'receitas.paciente_id', '=', 'pacientes.id')
      .join('medicamentos', 'receitas.medicamento_id', '=', 'medicamentos.id')
      .select(
        'data_prescricao',
        'medicos.nome as nome_medico',
        'pacientes.nome as nome_paciente',
        'medicamentos.nome as nome_medicamento'
      );
  }
}
