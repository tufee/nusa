import { MedicoRepository } from '../../data/repositories/medico-repository';
import { PacienteRepository } from '../../data/repositories/paciente-repository';
import { Encrypter } from '../../presentation/helper/encrypter';
import { createUserSchema } from '../../presentation/helper/zod-validator';
import { IPaciente } from '../entities/interfaces/paciente';

interface CreatePacienteInput extends Omit<IPaciente, 'id' | 'tipo'> {
  confirma_senha: string;
}

export class CreatePacienteUseCase {
  constructor(
    private readonly pacienteRepository: PacienteRepository,
    private readonly medicoRepository: MedicoRepository,
    private readonly encrypter: Encrypter
  ) {}

  async execute(paciente: CreatePacienteInput) {
    const pacienteValidado = await createUserSchema.safeParseAsync(paciente);

    if (!pacienteValidado.success) {
      console.warn(pacienteValidado.error);
      throw new Error('Erro ao validar paciente');
    }

    const medicoCadastrado = await this.medicoRepository.findByCPF(
      pacienteValidado.data.cpf
    );

    if (medicoCadastrado) {
      throw new Error('Já existe um médico com esse CPF');
    }

    const pacienteCadastrado = await this.pacienteRepository.findByCPF(
      pacienteValidado.data.cpf
    );

    if (pacienteCadastrado) {
      throw new Error('Paciente já cadastrado');
    }

    const hashSenha = await this.encrypter.encrypt(pacienteValidado.data.senha);

    return await this.pacienteRepository.create({
      nome: pacienteValidado.data.nome,
      cpf: pacienteValidado.data.cpf,
      data_nascimento: new Date(pacienteValidado.data.data_nascimento),
      senha: hashSenha,
    });
  }
}
