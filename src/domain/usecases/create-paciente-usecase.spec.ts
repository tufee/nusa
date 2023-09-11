import { ZodError } from 'zod';
import { MedicoRepository } from '../../data/repositories/medico-repository';
import { PacienteRepository } from '../../data/repositories/paciente-repository';
import { Encrypter } from '../../presentation/helper/encrypter';
import { createUserSchema } from '../../presentation/helper/zod-validator';
import { CreatePacienteUseCase } from './create-paciente-usecase';

jest.mock('../../data/repositories/paciente-repository');
jest.mock('../../data/repositories/medico-repository');
jest.mock('../../presentation/helper/encrypter');

describe('CreatePacienteUseCase', () => {
  const pacienteRepositoryMock =
    new PacienteRepository() as jest.Mocked<PacienteRepository>;

  const medicoRepositoryMock =
    new MedicoRepository() as jest.Mocked<MedicoRepository>;

  const encrypterMock = new Encrypter() as jest.Mocked<Encrypter>;

  const mockCreateUserSchema = jest.spyOn(createUserSchema, 'safeParseAsync');

  const createPacienteUseCase = new CreatePacienteUseCase(
    pacienteRepositoryMock,
    medicoRepositoryMock,
    encrypterMock
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const pacienteData = {
    nome: 'John Doe',
    cpf: '76701025005',
    data_nascimento: new Date('1990-01-01'),
    senha: 'password',
    confirma_senha: 'password',
  };

  it('Deve criar um paciente com sucesso', async () => {
    mockCreateUserSchema.mockResolvedValue({
      success: true,
      data: {
        nome: pacienteData.nome,
        cpf: pacienteData.cpf,
        data_nascimento: '1990-01-01',
        senha: pacienteData.senha,
        confirma_senha: pacienteData.confirma_senha,
      },
    });

    pacienteRepositoryMock.findByCPF.mockResolvedValue(null);
    encrypterMock.encrypt.mockResolvedValue('hashedPassword');
    pacienteRepositoryMock.create.mockResolvedValue({
      id: 'UUID',
      nome: pacienteData.nome,
      cpf: pacienteData.cpf,
      data_nascimento: pacienteData.data_nascimento,
      senha: 'hashedPassword',
      tipo: 'paciente',
    });

    const resultado = await createPacienteUseCase.execute(pacienteData);

    expect(resultado).toEqual({
      id: 'UUID',
      nome: pacienteData.nome,
      cpf: pacienteData.cpf,
      data_nascimento: expect.any(Date),
      senha: 'hashedPassword',
      tipo: 'paciente',
    });

    expect(mockCreateUserSchema).toHaveBeenCalledWith(pacienteData);
    expect(pacienteRepositoryMock.findByCPF).toHaveBeenCalledWith(
      pacienteData.cpf
    );
    expect(encrypterMock.encrypt).toHaveBeenCalledWith(pacienteData.senha);
    expect(pacienteRepositoryMock.create).toHaveBeenCalledWith({
      nome: pacienteData.nome,
      cpf: pacienteData.cpf,
      data_nascimento: pacienteData.data_nascimento,
      senha: 'hashedPassword',
    });
  });

  it('Deve lançar erro ao tentar criar um paciente que já está cadastrado', async () => {
    mockCreateUserSchema.mockResolvedValue({
      success: true,
      data: {
        nome: pacienteData.nome,
        cpf: pacienteData.cpf,
        data_nascimento: '1990-01-01',
        senha: pacienteData.senha,
        confirma_senha: pacienteData.confirma_senha,
      },
    });

    medicoRepositoryMock.findByCPF.mockResolvedValue({
      id: 'UUID',
      nome: pacienteData.nome,
      cpf: pacienteData.cpf,
      data_nascimento: pacienteData.data_nascimento,
      senha: 'hashedPassword',
      tipo: 'paciente',
    });

    await expect(createPacienteUseCase.execute(pacienteData)).rejects.toThrow(
      'Já existe um médico com esse CPF'
    );
  });

  it('Deve lançar erro ao tentar criar um paciente com CPF já cadastrado', async () => {
    mockCreateUserSchema.mockResolvedValue({
      success: true,
      data: {
        nome: pacienteData.nome,
        cpf: pacienteData.cpf,
        data_nascimento: '1990-01-01',
        senha: pacienteData.senha,
        confirma_senha: pacienteData.confirma_senha,
      },
    });

    pacienteRepositoryMock.findByCPF.mockResolvedValue({
      id: 'UUID',
      nome: pacienteData.nome,
      cpf: pacienteData.cpf,
      data_nascimento: pacienteData.data_nascimento,
      senha: 'hashedPassword',
      tipo: 'paciente',
    });

    await expect(createPacienteUseCase.execute(pacienteData)).rejects.toThrow(
      'Paciente já cadastrado'
    );
  });

  it('Deve lançar erro ao fornecer dados do paciente inválidos', async () => {
    mockCreateUserSchema.mockResolvedValue({
      success: false,
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      error: ZodError as any,
    });

    const pacienteData = {
      nome: '',
      cpf: 'invalid-cpf',
      data_nascimento: new Date('1990-01-01'),
      senha: 'invalid',
      confirma_senha: 'invalid-password',
    };

    await expect(
      createPacienteUseCase.execute(pacienteData)
    ).rejects.toThrowError('Erro ao validar paciente');
  });
});
