import { ZodError } from 'zod';
import { MedicoRepository } from '../../data/repositories/medico-repository';
import { AuthenticationJwt } from '../../presentation/helper/authentication-jwt';
import { Encrypter } from '../../presentation/helper/encrypter';
import { loginInputSchema } from '../../presentation/helper/zod-validator';
import { IMedico } from '../entities/interfaces/medico';
import { AuthenticateUserUseCase } from './authenticate-user-usecase';

jest.mock('../../data/repositories/medico-repository');
jest.mock('../../presentation/helper/authentication-jwt');
jest.mock('../../presentation/helper/encrypter');

const medicoRepositoryMock =
  new MedicoRepository() as jest.Mocked<MedicoRepository>;

const authenticationJwtMock =
  new AuthenticationJwt() as jest.Mocked<AuthenticationJwt>;

const encrypterMock = new Encrypter() as jest.Mocked<Encrypter>;

const loginInputSchemaMock = jest.spyOn(loginInputSchema, 'safeParseAsync');

const authenticateUserUseCase = new AuthenticateUserUseCase(
  medicoRepositoryMock,
  encrypterMock,
  authenticationJwtMock
);

beforeEach(() => {
  jest.resetAllMocks();
});

describe('AuthenticateUserUseCase', () => {
  describe('validateLoginInput', () => {
    const authenticateData = {
      cpf: '76701025005',
      senha: 'password',
    };

    it('deve passar na validação com dados válidos', async () => {
      loginInputSchemaMock.mockResolvedValue({
        success: true,
        data: {
          cpf: '76701025005',
          senha: 'password',
        },
      });

      const result =
        await authenticateUserUseCase.validateLoginInput(authenticateData);

      expect(result).toEqual(authenticateData);
    });

    it('deve falhar na validação com dados inválidos', async () => {
      loginInputSchemaMock.mockResolvedValue({
        success: false,
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        error: ZodError as any,
      });

      await expect(
        authenticateUserUseCase.execute(authenticateData)
      ).rejects.toThrowError('Erro ao validar login, verifique seus dados');
    });
  });

  describe('authenticateUserUseCase.getUseR', () => {
    const medicoData = {
      id: 'UUID',
      nome: 'John Doe',
      cpf: '76701025005',
      data_nascimento: new Date('1990-01-01'),
      senha: 'password',
      tipo: 'medico',
    };

    it('deve retornar um médico com o CPF válido', async () => {
      medicoRepositoryMock.findByCPF.mockResolvedValue([medicoData]);

      const user = await authenticateUserUseCase.getUser(medicoData.cpf);

      expect(user?.[0]).not.toBeNull();
      expect(user?.[0].id).toBe(medicoData.id);
      expect(user?.[0]?.nome).toBe(medicoData.nome);
      expect(user?.[0]?.cpf).toBe(medicoData.cpf);
      expect(user?.[0]?.data_nascimento).toBe(medicoData.data_nascimento);
      expect(user?.[0]?.senha).toBe(medicoData.senha);
      expect(user?.[0]?.tipo).toBe(medicoData.tipo);
    });

    it('deve lançar erro caso não encontre nenhum usuário', async () => {
      loginInputSchemaMock.mockResolvedValue({
        success: true,
        data: {
          cpf: '76701025005',
          senha: 'password',
        },
      });

      medicoRepositoryMock.findByCPF.mockResolvedValue(null);

      const loginInpuitData = {
        cpf: '76701025005',
        senha: 'password',
      };

      await expect(
        authenticateUserUseCase.execute(loginInpuitData)
      ).rejects.toThrowError('Erro ao validar login, verifique seus dados');
    });
  });

  describe('authenticateUserUseCase.checkPassword', () => {
    const user = {
      senha: 'hash',
    } as IMedico;

    it('deve passar na validação com senha correta', async () => {
      const senhaCorreta = 'password';

      encrypterMock.decrypt.mockResolvedValue(true);

      expect(
        await authenticateUserUseCase.checkPassword(senhaCorreta, user)
      ).toBe(true);
    });

    it('deve lançar um erro com senha incorreta', async () => {
      const senhaIncorreta = 'password';

      encrypterMock.decrypt.mockResolvedValue(false);

      await expect(
        authenticateUserUseCase.checkPassword(senhaIncorreta, user)
      ).rejects.toThrowError('Usuário ou senha incorreta');
    });
  });

  describe('authenticateUserUseCase.generateJwtToken', () => {
    const userMedico = {
      id: 'UUIDMedico',
      tipo: 'medico',
    } as IMedico;

    it('deve gerar um token JWT válido para um médico', () => {
      authenticationJwtMock.generateToken.mockReturnValue('token');
      expect(authenticateUserUseCase.generateJwtToken(userMedico)).toBeTruthy();
    });
  });
});
