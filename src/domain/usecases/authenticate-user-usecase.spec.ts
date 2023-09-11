import { ZodError } from 'zod';
import { MedicoRepository } from '../../data/repositories/medico-repository';
import { PacienteRepository } from '../../data/repositories/paciente-repository';
import { AuthenticationJwt } from '../../presentation/helper/authentication-jwt';
import { Encrypter } from '../../presentation/helper/encrypter';
import { loginInputSchema } from '../../presentation/helper/zod-validator';
import { IMedico } from '../entities/interfaces/medico';
import { IPaciente } from '../entities/interfaces/paciente';
import { AuthenticateUserUseCase } from './authenticate-user-usecase';

jest.mock('../../data/repositories/medico-repository');
jest.mock('../../data/repositories/paciente-repository');
jest.mock('../../presentation/helper/authentication-jwt');
jest.mock('../../presentation/helper/encrypter');

const medicoRepositoryMock =
  new MedicoRepository() as jest.Mocked<MedicoRepository>;

const pacienteRepositoryMock =
  new PacienteRepository() as jest.Mocked<PacienteRepository>;

const authenticationJwtMock =
  new AuthenticationJwt() as jest.Mocked<AuthenticationJwt>;

const encrypterMock = new Encrypter() as jest.Mocked<Encrypter>;

const loginInputSchemaMock = jest.spyOn(loginInputSchema, 'safeParseAsync');

const authenticateUserUseCase = new AuthenticateUserUseCase(
  medicoRepositoryMock,
  pacienteRepositoryMock,
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
      ).rejects.toThrowError('Erro ao validar usuário');
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

    const pacienteData = {
      id: 'UUID',
      nome: 'John Doe',
      cpf: '76701025005',
      data_nascimento: new Date('1990-01-01'),
      senha: 'password',
      tipo: 'paciente',
    };

    it('deve retornar um médico com o CPF válido', async () => {
      medicoRepositoryMock.findByCPF.mockResolvedValue(medicoData);

      const user = await authenticateUserUseCase.getUser(medicoData.cpf);

      expect(user).not.toBeNull();
      expect(user?.id).toBe(medicoData.id);
      expect(user?.nome).toBe(medicoData.nome);
      expect(user?.cpf).toBe(medicoData.cpf);
      expect(user?.data_nascimento).toBe(medicoData.data_nascimento);
      expect(user?.senha).toBe(medicoData.senha);
      expect(user?.tipo).toBe(medicoData.tipo);
    });

    it('deve retornar um paciente com o CPF válido', async () => {
      pacienteRepositoryMock.findByCPF.mockResolvedValue(pacienteData);

      const user = await authenticateUserUseCase.getUser(pacienteData.cpf);

      expect(user).not.toBeNull();
      expect(user?.id).toBe(pacienteData.id);
      expect(user?.nome).toBe(pacienteData.nome);
      expect(user?.cpf).toBe(pacienteData.cpf);
      expect(user?.data_nascimento).toBe(pacienteData.data_nascimento);
      expect(user?.senha).toBe(pacienteData.senha);
      expect(user?.tipo).toBe(pacienteData.tipo);
    });

    it('deve lançar erro caso não encontre nenhum usuário', async () => {
      loginInputSchemaMock.mockResolvedValue({
        success: true,
        data: {
          cpf: '76701025005',
          senha: 'password',
        },
      });

      pacienteRepositoryMock.findByCPF.mockResolvedValue(null);

      const loginInpuitData = {
        cpf: '76701025005',
        senha: 'password',
      };

      await expect(
        authenticateUserUseCase.execute(loginInpuitData)
      ).rejects.toThrowError('Usuário não encontrado');
    });
  });

  describe('authenticateUserUseCase.checkPassword', () => {
    const user = {
      senha: 'hash',
    } as IMedico | IPaciente;

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
    } as IMedico | IPaciente;

    it('deve gerar um token JWT válido para um médico', () => {
      authenticationJwtMock.generateToken.mockReturnValue('token');
      expect(authenticateUserUseCase.generateJwtToken(userMedico)).toBeTruthy();
    });
  });
});
