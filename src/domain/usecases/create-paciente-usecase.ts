import { PacienteRepository } from '../../data/repositories/paciente-repository';
import { createUserSchema } from '../../presentation/helper/zod-validator';
import { IPaciente } from '../entities/interfaces/paciente';

type CreatePacienteInput = Omit<IPaciente, 'id'>;
export class CreatePacienteUseCase {
  constructor(private readonly pacienteRepository: PacienteRepository) {}

  async execute(paciente: CreatePacienteInput) {
    const pacienteValidado = await createUserSchema.safeParseAsync(paciente);

    if (!pacienteValidado.success) {
      console.warn(pacienteValidado.error);
      throw new Error(
        'Erro ao cadastrar paciente, verifique os dados enviados'
      );
    }

    const pacienteCadastrado = await this.pacienteRepository.findByCPF(
      pacienteValidado.data.cpf
    );

    if (pacienteCadastrado) {
      throw new Error('Paciente já cadastrado');
    }

    return await this.pacienteRepository.create({
      nome: pacienteValidado.data.nome,
      cpf: pacienteValidado.data.cpf,
      data_nascimento: new Date(pacienteValidado.data.data_nascimento),
    });
  }
}
