import { Router } from 'express';
import { medicoController } from './medico-factory';

const medicoRouter = Router();

medicoRouter.post('/create/medico', (request, response) => {
  medicoController.create(request, response);
});

export { medicoRouter };
