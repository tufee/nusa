import { MedicamentoRepository } from '../../data/repositories/medicamento-repository';
import { createMedicamentoSchema } from '../../presentation/helper/zod-validator';
import { IMedicamento } from '../entities/interfaces/medicamento';

export class CreateMedicamentoUseCase {
  constructor(private readonly medicamentoRepository: MedicamentoRepository) {}

  async execute(medicamento: Omit<IMedicamento, 'id'>) {
    const medicamentoValidado =
      await createMedicamentoSchema.safeParseAsync(medicamento);

    if (!medicamentoValidado.success) {
      console.warn(medicamentoValidado.error);
      throw new Error('Erro ao validar medicamento');
    }

    const medicamentoCadastrado =
      await this.medicamentoRepository.findByCodigoAnvisa(
        medicamentoValidado.data.codigo_anvisa
      );

    if (medicamentoCadastrado?.length) {
      throw new Error('medicamento já cadastrado');
    }

    return await this.medicamentoRepository.create(medicamento);
  }
}
