import { Router } from 'express';
import { receitaController } from './receita-factory';

const receitaRouter = Router();

receitaRouter.post('/create/receita', (request, response) => {
  receitaController.create(request, response);
});

export { receitaRouter };
