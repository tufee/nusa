import { Router } from 'express';
import { pacienteController } from './paciente-factory';
import ensureAuthenticated from '../../middlewares/ensureAuthenticated';

const pacienteRouter = Router();

pacienteRouter.post(
  '/create/paciente',
  ensureAuthenticated,
  (request, response) => {
    pacienteController.create(request, response);
  }
);

pacienteRouter.get('/paciente', ensureAuthenticated, (request, response) => {
  pacienteController.findAll(request, response);
});

pacienteRouter.get(
  '/paciente/search',
  ensureAuthenticated,
  (request, response) => {
    pacienteController.search(request, response);
  }
);

export { pacienteRouter };
