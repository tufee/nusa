import { Router } from 'express';
import { medicamentoController } from './medicamento-factory';

const medicamentoRouter = Router();

medicamentoRouter.post('/create', (request, response) => {
  medicamentoController.create(request, response);
});

export { medicamentoRouter };
