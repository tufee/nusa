import { ZodError } from 'zod';
import { MedicamentoRepository } from '../../data/repositories/medicamento-repository';
import { createMedicamentoSchema } from '../../presentation/helper/zod-validator';
import { CreateMedicamentoUseCase } from './create-medicamento-usecase';

jest.mock('../../data/repositories/medicamento-repository');

describe('CreateMedicamentoUseCase', () => {
  const medicamentoRepositoryMock =
    new MedicamentoRepository() as jest.Mocked<MedicamentoRepository>;

  const createMedicamentoUseCase = new CreateMedicamentoUseCase(
    medicamentoRepositoryMock
  );

  const mockCreateMedicamentoSchema = jest.spyOn(
    createMedicamentoSchema,
    'safeParseAsync'
  );

  const medicamentoData = {
    nome: 'dipirona',
    categoria: 'ANALGESICOS',
    codigo_anvisa: '1018600360022',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve criar um medicamento com sucesso', async () => {
    medicamentoRepositoryMock.create.mockResolvedValue([
      {
        ...medicamentoData,
        id: 'UUID',
      },
    ]);

    const resultado = await createMedicamentoUseCase.execute(medicamentoData);

    expect(resultado).toEqual([{ ...medicamentoData, id: 'UUID' }]);

    expect(medicamentoRepositoryMock.findByCodigoAnvisa).toHaveBeenCalledWith(
      medicamentoData.codigo_anvisa
    );

    expect(medicamentoRepositoryMock.create).toHaveBeenCalledWith(
      medicamentoData
    );
  });

  it('Deve lançar erro ao tentar criar um medicamento com código ANVISA já cadastrado', async () => {
    medicamentoRepositoryMock.findByCodigoAnvisa.mockResolvedValue([
      {
        ...medicamentoData,
        id: 'UUID',
      },
    ]);

    await expect(
      createMedicamentoUseCase.execute(medicamentoData)
    ).rejects.toThrow('medicamento já cadastrado');
  });

  it('Deve lançar erro ao fornecer dados do médico inválidos', async () => {
    mockCreateMedicamentoSchema.mockResolvedValue({
      success: false,
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      error: ZodError as any,
    });

    await expect(
      createMedicamentoUseCase.execute(medicamentoData)
    ).rejects.toThrowError('Erro ao validar medicamento');
  });
});
