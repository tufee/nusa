import { ReceitaRepository } from '../../data/repositories/receita-repository';
import { createReceitaSchema } from '../../presentation/helper/zod-validator';
import { IReceita } from '../entities/interfaces/receita';

export class CreateReceitaUseCase {
  constructor(private readonly receitaRepository: ReceitaRepository) {}

  async execute(receita: Omit<IReceita, 'id'>) {
    const receitaValidada = await createReceitaSchema.safeParseAsync(receita);

    if (!receitaValidada.success) {
      console.warn(receitaValidada.error);
      throw new Error('Erro ao validar receita');
    }

    return await this.receitaRepository.create({
      ...receitaValidada.data,
      data_prescricao: new Date(receitaValidada.data.data_prescricao),
    });
  }
}
