import Knex from 'knex';
import config from '../../../knexfile';
import { IPaciente } from '../../domain/entities/interfaces/paciente';
import { IPacienteRepository } from './interfaces/paciente';

const knex = Knex(config);

export class PacienteRepository implements IPacienteRepository {
  async create(paciente: Omit<IPaciente, 'id'>): Promise<IPaciente[]> {
    return await knex<IPaciente>('pacientes').insert(paciente).returning('*');
  }

  async findByCPF(cpf: string): Promise<IPaciente[] | null> {
    return await knex<IPaciente>('pacientes').select('*').where({ cpf });
  }

  async findAll(): Promise<IPaciente[] | null> {
    return await knex<IPaciente>('pacientes').select();
  }
}
