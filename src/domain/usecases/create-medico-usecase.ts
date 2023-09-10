import { MedicoRepository } from '../../data/repositories/medico-repository';
import { Encrypter } from '../../presentation/helper/encrypter';
import { createUserSchema } from '../../presentation/helper/zod-validator';
import { IMedico } from '../entities/interfaces/medico';

interface CreateMedicoInput extends Omit<IMedico, 'id'> {
  confirma_senha: string;
}

export class CreateMedicoUseCase {
  constructor(
    private readonly medicoRepository: MedicoRepository,
    private readonly encrypter: Encrypter
  ) {}

  async execute(medico: CreateMedicoInput) {
    const medicoValidado = await createUserSchema.safeParseAsync(medico);

    if (!medicoValidado.success) {
      console.warn(medicoValidado.error);
      throw new Error('Erro ao validar médico');
    }

    const medicoCadastrado = await this.medicoRepository.findByCPF(
      medicoValidado.data.cpf
    );

    if (medicoCadastrado) {
      throw new Error('Médico já cadastrado');
    }

    const hashSenha = await this.encrypter.encrypt(medicoValidado.data.senha);

    const medicoCriado = await this.medicoRepository.create({
      nome: medicoValidado.data.nome,
      cpf: medicoValidado.data.cpf,
      data_nascimento: new Date(medicoValidado.data.data_nascimento),
      senha: hashSenha,
    });

    return {
      id: medicoCriado.id,
      nome: medicoCriado.nome,
      cpf: medicoCriado.cpf,
      data_nascimento: medicoCriado.data_nascimento,
    };
  }
}
