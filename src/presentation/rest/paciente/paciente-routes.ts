import { Router } from 'express';
import { pacienteController } from './paciente-factory';

const pacienteRouter = Router();

pacienteRouter.post('/create', (request, response) => {
  pacienteController.create(request, response);
});

export { pacienteRouter };
