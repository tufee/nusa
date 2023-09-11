import { IMedicoRepository } from '../../data/repositories/interfaces/medico';
import { IPacienteRepository } from '../../data/repositories/interfaces/paciente';
import { AuthenticationJwt } from '../../presentation/helper/authentication-jwt';
import { Encrypter } from '../../presentation/helper/encrypter';
import { loginInputSchema } from '../../presentation/helper/zod-validator';
import { IMedico } from '../entities/interfaces/medico';
import { IPaciente } from '../entities/interfaces/paciente';

interface LoginInput {
  cpf: string;
  senha: string;
}

export class AuthenticateUserUseCase {
  constructor(
    private readonly pacienteRepository: IPacienteRepository,
    private readonly medicoRepository: IMedicoRepository,
    private readonly encrypter: Encrypter,
    private readonly authenticationJwt: AuthenticationJwt
  ) {}

  async execute(loginData: LoginInput): Promise<{ token: string }> {
    const validatedLoginData = await this.validateLoginInput(loginData);

    const user = await this.getUser(validatedLoginData.cpf);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    await this.checkPassword(loginData.senha, user);

    const token = this.generateJwtToken(user);

    return { token };
  }

  async validateLoginInput(loginData: LoginInput): Promise<LoginInput> {
    const loginInputValidated =
      await loginInputSchema.safeParseAsync(loginData);

    if (!loginInputValidated.success) {
      console.warn(loginInputValidated.error);
      throw new Error('Erro ao validar usuário');
    }

    return loginInputValidated.data;
  }

  async getUser(cpf: string): Promise<IMedico | IPaciente | null> {
    const user = await this.medicoRepository.findByCPF(cpf);

    if (user) {
      return user;
    } else {
      return await this.pacienteRepository.findByCPF(cpf);
    }
  }

  async checkPassword(senha: string, user: IMedico | IPaciente) {
    const passwordMatched = await this.encrypter.decrypt(senha, user.senha);

    if (!passwordMatched) {
      throw new Error('Usuário ou senha incorreta');
    }

    return true;
  }

  generateJwtToken(user: IMedico | IPaciente): string {
    return this.authenticationJwt.generateToken({
      userId: user.id,
      tipo: user.tipo,
    });
  }
}
