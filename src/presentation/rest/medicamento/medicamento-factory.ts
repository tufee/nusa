import { MedicamentoRepository } from '../../../data/repositories/medicamento-repository';
import { CreateMedicamentoUseCase } from '../../../domain/usecases/create-medicamento-usecase';
import { MedicamentoController } from './medicamento-controller';

const medicamentoRepository = new MedicamentoRepository();
const medicamentoUseCase = new CreateMedicamentoUseCase(medicamentoRepository);
const medicamentoController = new MedicamentoController(medicamentoUseCase);

export { medicamentoController };
