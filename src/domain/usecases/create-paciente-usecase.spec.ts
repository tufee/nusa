import { PacienteRepository } from '../../data/repositories/paciente-repository';
import { Encrypter } from '../../presentation/helper/encrypter';
import { createUserSchema } from '../../presentation/helper/zod-validator';
import { CreatePacienteUseCase } from './create-paciente-usecase';

jest.mock('../../data/repositories/paciente-repository');
jest.mock('../../presentation/helper/encrypter');

describe('CreatePacienteUseCase', () => {
  const pacienteRepositoryMock =
    new PacienteRepository() as jest.Mocked<PacienteRepository>;
  const encrypterMock = new Encrypter() as jest.Mocked<Encrypter>;

  const mockCreateUserSchema = jest.spyOn(createUserSchema, 'safeParseAsync');

  const createPacienteUseCase = new CreatePacienteUseCase(
    pacienteRepositoryMock,
    encrypterMock
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve criar um paciente com sucesso', async () => {
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
    pacienteRepositoryMock.findByCPF.mockResolvedValue(null);
    encrypterMock.encrypt.mockResolvedValue('hashedPassword');
    pacienteRepositoryMock.create.mockResolvedValue({
      id: 'UUID',
      nome: 'John Doe',
      cpf: '76701025005',
      data_nascimento: new Date('1990-01-01'),
      senha: 'hashedPassword',
    });

    const pacienteData = {
      nome: 'John Doe',
      cpf: '76701025005',
      data_nascimento: new Date('1990-01-01'),
      senha: 'password',
      confirma_senha: 'password',
    };

    const resultado = await createPacienteUseCase.execute(pacienteData);

    expect(resultado).toEqual({
      id: 'UUID',
      nome: 'John Doe',
      cpf: '76701025005',
      data_nascimento: expect.any(Date),
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

  it('Deve lançar erro ao tentar criar um paciente com CPF já cadastrado', async () => {
    pacienteRepositoryMock.findByCPF.mockResolvedValue({
      id: 'UUID',
      nome: 'John Doe',
      cpf: '76701025005',
      data_nascimento: new Date('1990-01-01'),
      senha: 'hashedPassword',
    });

    const pacienteData = {
      nome: 'John Doe',
      cpf: '76701025005',
      data_nascimento: new Date('1990-01-01'),
      senha: 'password',
      confirma_senha: 'password',
    };

    await expect(createPacienteUseCase.execute(pacienteData)).rejects.toThrow(
      'Paciente já cadastrado'
    );
  });
});
