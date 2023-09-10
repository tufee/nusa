import express from 'express';
import { medicoRouter } from './rest/medico/medico-routes';
import { pacienteRouter } from './rest/paciente/paciente-routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(pacienteRouter);
app.use(medicoRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Server started on port ${port}`));
}

export { app };
