import { ZodError } from 'zod';
import { MedicoRepository } from '../../data/repositories/medico-repository';
import { PacienteRepository } from '../../data/repositories/paciente-repository';
import { Encrypter } from '../../presentation/helper/encrypter';
import { createUserSchema } from '../../presentation/helper/zod-validator';
import { CreateMedicoUseCase } from './create-medico-usecase';

jest.mock('../../data/repositories/medico-repository');
jest.mock('../../data/repositories/paciente-repository');
jest.mock('../../presentation/helper/encrypter');

describe('CreateMedicoUseCase', () => {
  const medicoRepositoryMock =
    new MedicoRepository() as jest.Mocked<MedicoRepository>;

  const pacienteRepositoryMock =
    new PacienteRepository() as jest.Mocked<PacienteRepository>;

  const encrypterMock = new Encrypter() as jest.Mocked<Encrypter>;

  const mockCreateUserSchema = jest.spyOn(createUserSchema, 'safeParseAsync');

  const createMedicoUseCase = new CreateMedicoUseCase(
    medicoRepositoryMock,
    pacienteRepositoryMock,
    encrypterMock
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const medicoData = {
    nome: 'John Doe',
    cpf: '76701025005',
    data_nascimento: new Date('1990-01-01'),
    senha: 'password',
    confirma_senha: 'password',
  };

  it('Deve criar um medico com sucesso', async () => {
    mockCreateUserSchema.mockResolvedValue({
      success: true,
      data: {
        nome: 'John Doe',
        cpf: '76701025005',
        data_nascimento: '1990-01-01',
        senha: 'password',
        confirma_senha: 'password',
      },
    });
    medicoRepositoryMock.findByCPF.mockResolvedValue(null);
    encrypterMock.encrypt.mockResolvedValue('hashedPassword');
    medicoRepositoryMock.create.mockResolvedValue({
      id: 'UUID',
      nome: 'John Doe',
      cpf: '76701025005',
      data_nascimento: new Date('1990-01-01'),
      senha: 'hashedPassword',
      tipo: 'medico',
    });

    const resultado = await createMedicoUseCase.execute(medicoData);

    expect(resultado).toEqual({
      id: 'UUID',
      nome: medicoData.nome,
      cpf: medicoData.cpf,
      data_nascimento: expect.any(Date),
      senha: 'hashedPassword',
      tipo: 'medico',
    });

    expect(mockCreateUserSchema).toHaveBeenCalledWith(medicoData);
    expect(medicoRepositoryMock.findByCPF).toHaveBeenCalledWith(medicoData.cpf);
    expect(encrypterMock.encrypt).toHaveBeenCalledWith(medicoData.senha);
    expect(medicoRepositoryMock.create).toHaveBeenCalledWith({
      nome: medicoData.nome,
      cpf: medicoData.cpf,
      data_nascimento: medicoData.data_nascimento,
      senha: 'hashedPassword',
    });
  });

  it('Deve lançar erro ao tentar criar um medico que já está cadastrado como paciente', async () => {
    mockCreateUserSchema.mockResolvedValue({
      success: true,
      data: {
        nome: medicoData.nome,
        cpf: medicoData.cpf,
        data_nascimento: '1990-01-01',
        senha: medicoData.senha,
        confirma_senha: medicoData.confirma_senha,
      },
    });

    pacienteRepositoryMock.findByCPF.mockResolvedValue({
      id: 'UUID',
      nome: medicoData.nome,
      cpf: medicoData.cpf,
      data_nascimento: medicoData.data_nascimento,
      senha: 'hashedPassword',
      tipo: 'paciente',
    });

    await expect(createMedicoUseCase.execute(medicoData)).rejects.toThrowError(
      'Já existe um paciente com esse CPF'
    );

    expect(pacienteRepositoryMock.findByCPF).toHaveBeenCalledWith(
      medicoData.cpf
    );
  });

  it('Deve lançar erro ao tentar criar um medico com CPF já cadastrado', async () => {
    mockCreateUserSchema.mockResolvedValue({
      success: true,
      data: {
        nome: medicoData.nome,
        cpf: medicoData.cpf,
        data_nascimento: '1990-01-01',
        senha: medicoData.senha,
        confirma_senha: medicoData.confirma_senha,
      },
    });

    medicoRepositoryMock.findByCPF.mockResolvedValue({
      id: 'UUID',
      nome: medicoData.nome,
      cpf: medicoData.cpf,
      data_nascimento: medicoData.data_nascimento,
      senha: 'hashedPassword',
      tipo: 'medico',
    });

    await expect(createMedicoUseCase.execute(medicoData)).rejects.toThrowError(
      'Médico já cadastrado'
    );

    expect(medicoRepositoryMock.findByCPF).toHaveBeenCalledWith(medicoData.cpf);
  });

  it('Deve lançar erro ao fornecer dados do médico inválidos', async () => {
    mockCreateUserSchema.mockResolvedValue({
      success: false,
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      error: ZodError as any,
    });

    const medicoData = {
      nome: '',
      cpf: 'invalid-cpf',
      data_nascimento: new Date('1990-01-01'),
      senha: 'invalid',
      confirma_senha: 'invalid-password',
    };

    await expect(createMedicoUseCase.execute(medicoData)).rejects.toThrowError(
      'Erro ao validar médico'
    );
  });
});
