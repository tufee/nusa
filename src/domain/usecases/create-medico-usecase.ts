import { MedicoRepository } from '../../data/repositories/medico-repository';
import { Encrypter } from '../../presentation/helper/encrypter';
import { createMedicoSchema } from '../../presentation/helper/zod-validator';
import { IMedico } from '../entities/interfaces/medico';

interface CreateMedicoInput extends Omit<IMedico, 'id' | 'tipo'> {
  confirma_senha: string;
}

export class CreateMedicoUseCase {
  constructor(
    private readonly medicoRepository: MedicoRepository,
    private readonly encrypter: Encrypter
  ) {}

  async execute(medico: CreateMedicoInput) {
    const medicoValidado = await createMedicoSchema.safeParseAsync(medico);

    if (!medicoValidado.success) {
      console.warn(medicoValidado.error);
      throw new Error('Erro ao cadastrar médico, verifique os dados enviados');
    }

    const medicoCadastrado = await this.medicoRepository.findByCPF(
      medicoValidado.data.cpf
    );

    if (medicoCadastrado?.length) {
      throw new Error('Médico já cadastrado');
    }

    const hashSenha = await this.encrypter.encrypt(medicoValidado.data.senha);

    return await this.medicoRepository.create({
      nome: medicoValidado.data.nome,
      cpf: medicoValidado.data.cpf,
      data_nascimento: new Date(medicoValidado.data.data_nascimento),
      senha: hashSenha,
    });
  }
}
