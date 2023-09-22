import { IMedicoRepository } from '../../data/repositories/interfaces/medico';
import { AuthenticationJwt } from '../../presentation/helper/authentication-jwt';
import { Encrypter } from '../../presentation/helper/encrypter';
import {
  loginInputSchema,
  formatCPF,
} from '../../presentation/helper/zod-validator';
import { IMedico } from '../entities/interfaces/medico';

interface LoginInput {
  cpf: string;
  senha: string;
}

export class AuthenticateUserUseCase {
  constructor(
    private readonly medicoRepository: IMedicoRepository,
    private readonly encrypter: Encrypter,
    private readonly authenticationJwt: AuthenticationJwt
  ) {}

  async execute(loginData: LoginInput): Promise<{ token: string }> {
    const validatedLoginData = await this.validateLoginInput(loginData);

    validatedLoginData.cpf = formatCPF(validatedLoginData.cpf);

    const user = await this.getUser(validatedLoginData.cpf);

    if (!user) {
      throw new Error('Erro ao validar login, verifique seus dados');
    }

    await this.checkPassword(loginData.senha, user[0]);

    const token = this.generateJwtToken(user[0]);

    return { token };
  }

  async validateLoginInput(loginData: LoginInput): Promise<LoginInput> {
    const loginInputValidated =
      await loginInputSchema.safeParseAsync(loginData);

    if (!loginInputValidated.success) {
      console.warn(loginInputValidated.error);
      throw new Error('Erro ao validar login, verifique seus dados');
    }

    return loginInputValidated.data;
  }

  async getUser(cpf: string): Promise<IMedico[] | null> {
    return await this.medicoRepository.findByCPF(cpf);
  }

  async checkPassword(senha: string, user: IMedico) {
    const passwordMatched = await this.encrypter.decrypt(senha, user.senha);

    if (!passwordMatched) {
      throw new Error('Usuário ou senha incorreta');
    }

    return true;
  }

  generateJwtToken(user: IMedico): string {
    return this.authenticationJwt.generateToken({
      userId: user.id,
      tipo: user.tipo,
    });
  }
}
