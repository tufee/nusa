import { ZodError } from 'zod';
import { ReceitaRepository } from '../../data/repositories/receita-repository';
import { createReceitaSchema } from '../../presentation/helper/zod-validator';
import { CreateReceitaUseCase } from './create-receita-usecase';

jest.mock('../../data/repositories/receita-repository');

describe('CreateReceitaUseCase', () => {
  const receitaRepositoryMock =
    new ReceitaRepository() as jest.Mocked<ReceitaRepository>;

  const createReceitaUseCase = new CreateReceitaUseCase(receitaRepositoryMock);

  const mockCreateReceitaSchema = jest.spyOn(
    createReceitaSchema,
    'safeParseAsync'
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const receitaData = {
    medico_id: '00031f30-1b16-4455-81f0-fa01b00689f8',
    paciente_id: '0cb0be0e-908e-45d1-9abc-f84cfd73db3b',
    medicamento_id: '5ad4d1fd-02fd-4ffc-8dd2-5670f70192f4',
  };

  const data_prescricao = new Date('07/03/1994');

  it('Deve criar uma receita com sucesso', async () => {
    mockCreateReceitaSchema.mockResolvedValue({
      success: true,
      data: { ...receitaData, data_prescricao: '07/03/1994' },
    });

    receitaRepositoryMock.create.mockResolvedValue({
      ...receitaData,
      id: 'UUID',
      data_prescricao,
    });

    const resultado = await createReceitaUseCase.execute({
      ...receitaData,
      data_prescricao,
    });

    expect(resultado).toEqual({
      ...receitaData,
      id: 'UUID',
      data_prescricao: expect.any(Date),
    });

    expect(receitaRepositoryMock.create).toHaveBeenCalledWith({
      ...receitaData,
      data_prescricao,
    });
  });

  it('Deve lançar erro ao fornecer dados de receita inválidos', async () => {
    mockCreateReceitaSchema.mockResolvedValue({
      success: false,
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      error: ZodError as any,
    });

    await expect(
      createReceitaUseCase.execute({ ...receitaData, data_prescricao })
    ).rejects.toThrowError('Erro ao validar receita');
  });
});
