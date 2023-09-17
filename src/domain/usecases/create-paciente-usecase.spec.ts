import { ZodError } from 'zod';
import { PacienteRepository } from '../../data/repositories/paciente-repository';
import { createUserSchema } from '../../presentation/helper/zod-validator';
import { CreatePacienteUseCase } from './create-paciente-usecase';

jest.mock('../../data/repositories/paciente-repository');

describe('CreatePacienteUseCase', () => {
  const pacienteRepositoryMock =
    new PacienteRepository() as jest.Mocked<PacienteRepository>;

  const mockCreateUserSchema = jest.spyOn(createUserSchema, 'safeParseAsync');

  const createPacienteUseCase = new CreatePacienteUseCase(
    pacienteRepositoryMock
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const pacienteData = {
    nome: 'John Doe',
    cpf: '76701025005',
    data_nascimento: new Date('1990-01-01'),
  };

  it('Deve criar um paciente com sucesso', async () => {
    mockCreateUserSchema.mockResolvedValue({
      success: true,
      data: {
        nome: pacienteData.nome,
        cpf: pacienteData.cpf,
        data_nascimento: '1990-01-01',
      },
    });

    pacienteRepositoryMock.findByCPF.mockResolvedValue(null);
    pacienteRepositoryMock.create.mockResolvedValue({
      ...pacienteData,
      id: 'UUID',
    });

    const resultado = await createPacienteUseCase.execute(pacienteData);

    expect(resultado).toEqual({
      ...pacienteData,
      id: 'UUID',
    });

    expect(mockCreateUserSchema).toHaveBeenCalledWith(pacienteData);
    expect(pacienteRepositoryMock.findByCPF).toHaveBeenCalledWith(
      pacienteData.cpf
    );
    expect(pacienteRepositoryMock.create).toHaveBeenCalledWith(pacienteData);
  });

  it('Deve lançar erro ao tentar criar um paciente com CPF já cadastrado', async () => {
    mockCreateUserSchema.mockResolvedValue({
      success: true,
      data: {
        nome: pacienteData.nome,
        cpf: pacienteData.cpf,
        data_nascimento: '1990-01-01',
      },
    });

    pacienteRepositoryMock.findByCPF.mockResolvedValue({
      ...pacienteData,
      id: 'UUID',
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
    ).rejects.toThrowError(
      'Erro ao cadastrar paciente, verifique os dados enviados'
    );
  });
});
