import { IMedico } from '../../../domain/entities/interfaces/medico';

export interface IMedicoRepository {
  create(paciente: IMedico): Promise<IMedico[]>;
  findByCPF(id: string): Promise<IMedico[] | null>;
}
