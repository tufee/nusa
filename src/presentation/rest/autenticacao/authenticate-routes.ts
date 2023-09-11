import { Router } from 'express';
import { authenticateController } from './authenticate-factory';

const authenticateRouter = Router();

authenticateRouter.post('/login', (request, response) => {
  authenticateController.create(request, response);
});

export { authenticateRouter };
