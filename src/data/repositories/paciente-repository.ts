import Knex from 'knex';
import config from '../../../knexfile';
import { IPaciente } from '../../domain/entities/interfaces/paciente';
import { IPacienteRepository } from './interfaces/paciente';

const knex = Knex(config);

export class PacienteRepository implements IPacienteRepository {
  async create(paciente: Omit<IPaciente, 'id' | 'tipo'>): Promise<IPaciente> {
    const [createdPaciente] = await knex<IPaciente>('pacientes')
      .insert(paciente)
      .returning('*');
    return createdPaciente;
  }

  async findByCPF(cpf: string): Promise<IPaciente | null> {
    const [paciente] = await knex<IPaciente>('pacientes')
      .select('*')
      .where({ cpf });
    return paciente;
  }
}
