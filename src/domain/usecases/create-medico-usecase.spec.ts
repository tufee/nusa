import { MedicoRepository } from '../../data/repositories/medico-repository';
import { Encrypter } from '../../presentation/helper/encrypter';
import { createUserSchema } from '../../presentation/helper/zod-validator';
import { CreateMedicoUseCase } from './create-medico-usecase';

jest.mock('../../data/repositories/medico-repository');
jest.mock('../../presentation/helper/encrypter');

describe('CreateMedicoUseCase', () => {
  const medicoRepositoryMock =
    new MedicoRepository() as jest.Mocked<MedicoRepository>;
  const encrypterMock = new Encrypter() as jest.Mocked<Encrypter>;

  const mockCreateUserSchema = jest.spyOn(createUserSchema, 'safeParseAsync');

  const createMedicoUseCase = new CreateMedicoUseCase(
    medicoRepositoryMock,
    encrypterMock
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    });

    const medicoData = {
      nome: 'John Doe',
      cpf: '76701025005',
      data_nascimento: new Date('1990-01-01'),
      senha: 'password',
      confirma_senha: 'password',
    };

    const resultado = await createMedicoUseCase.execute(medicoData);

    expect(resultado).toEqual({
      id: 'UUID',
      nome: 'John Doe',
      cpf: '76701025005',
      data_nascimento: expect.any(Date),
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

  it('Deve lançar erro ao tentar criar um medico com CPF já cadastrado', async () => {
    medicoRepositoryMock.findByCPF.mockResolvedValue({
      id: 'UUID',
      nome: 'John Doe',
      cpf: '76701025005',
      data_nascimento: new Date('1990-01-01'),
      senha: 'hashedPassword',
    });

    const medicoData = {
      nome: 'John Doe',
      cpf: '76701025005',
      data_nascimento: new Date('1990-01-01'),
      senha: 'password',
      confirma_senha: 'password',
    };

    await expect(createMedicoUseCase.execute(medicoData)).rejects.toThrow(
      'Medico já cadastrado'
    );
  });
});
