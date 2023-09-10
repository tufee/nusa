import { PacienteRepository } from '../../data/repositories/paciente-repository';
import { Encrypter } from '../../presentation/helper/encrypter';
import { createUserSchema } from '../../presentation/helper/zod-validator';
import { IPaciente } from '../entities/interfaces/paciente';

interface CreatePacienteInput extends Omit<IPaciente, 'id'> {
  confirma_senha: string;
}

export class CreatePacienteUseCase {
  constructor(
    private readonly pacienteRepository: PacienteRepository,
    private readonly encrypter: Encrypter
  ) {}

  async execute(paciente: CreatePacienteInput) {
    const pacienteValidado = await createUserSchema.safeParseAsync(paciente);

    if (!pacienteValidado.success) {
      throw new Error(pacienteValidado.error.message);
    }

    const pacienteCadastrado = await this.pacienteRepository.findByCPF(
      pacienteValidado.data.cpf
    );

    if (pacienteCadastrado) {
      throw new Error('Paciente já cadastrado');
    }

    const hashSenha = await this.encrypter.encrypt(pacienteValidado.data.senha);

    const pacienteCriado = await this.pacienteRepository.create({
      nome: pacienteValidado.data.nome,
      cpf: pacienteValidado.data.cpf,
      data_nascimento: new Date(pacienteValidado.data.data_nascimento),
      senha: hashSenha,
    });

    return {
      id: pacienteCriado.id,
      nome: pacienteCriado.nome,
      cpf: pacienteCriado.cpf,
      data_nascimento: pacienteCriado.data_nascimento,
    };
  }
}
