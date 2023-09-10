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

  const payloadRetornoMock = {
    id: 'UUID',
    nome: 'dipirona',
    categoria: 'ANALGESICOS',
    codigo_anvisa: '1018600360022',
  };

  it('Deve criar um medicamento com sucesso', async () => {
    mockCreateMedicamentoSchema.mockResolvedValue({
      success: true,
      data: {
        nome: 'dipirona',
        categoria: 'ANALGESICOS',
        codigo_anvisa: '1018600360022',
      },
    });

    medicamentoRepositoryMock.create.mockResolvedValue(payloadRetornoMock);

    const medicamentoData = {
      nome: 'dipirona',
      categoria: 'ANALGESICOS',
      codigo_anvisa: '1018600360022',
    };

    const resultado = await createMedicamentoUseCase.execute(medicamentoData);

    expect(resultado).toEqual(payloadRetornoMock);

    expect(medicamentoRepositoryMock.findByCodigoAnvisa).toHaveBeenCalledWith(
      medicamentoData.codigo_anvisa
    );

    expect(medicamentoRepositoryMock.create).toHaveBeenCalledWith(
      medicamentoData
    );
  });

  it('Deve lançar erro ao tentar criar um medicamento com código ANVISA já cadastrado', async () => {
    mockCreateMedicamentoSchema.mockResolvedValue({
      success: true,
      data: {
        nome: 'dipirona',
        categoria: 'ANALGESICOS',
        codigo_anvisa: '1018600360022',
      },
    });

    medicamentoRepositoryMock.findByCodigoAnvisa.mockResolvedValue(
      payloadRetornoMock
    );

    const medicamentoData = {
      nome: 'dipirona',
      categoria: 'ANALGESICOS',
      codigo_anvisa: '1018600360022',
    };

    await expect(
      createMedicamentoUseCase.execute(medicamentoData)
    ).rejects.toThrow('medicamento já cadastrado');
  });
});
