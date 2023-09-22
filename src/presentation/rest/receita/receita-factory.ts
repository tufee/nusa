import { ReceitaRepository } from '../../../data/repositories/receita-repository';
import { CreateReceitaUseCase } from '../../../domain/usecases/create-receita-usecase';
import { ReceitaController } from './receita-controller';

const receitaRepository = new ReceitaRepository();
const receitaUseCase = new CreateReceitaUseCase(receitaRepository);
const receitaController = new ReceitaController(
  receitaUseCase,
  receitaRepository
);

export { receitaController };
