import { Router } from 'express';
import ensureAuthenticated from '../../middlewares/ensureAuthenticated';
import { medicamentoController } from './medicamento-factory';

const medicamentoRouter = Router();

medicamentoRouter.post(
  '/create/medicamento',
  ensureAuthenticated,
  (request, response) => {
    medicamentoController.create(request, response);
  }
);

export { medicamentoRouter };
