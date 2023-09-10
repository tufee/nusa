import express from 'express';
import { pacienteRouter } from './rest/paciente/paciente-routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(pacienteRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Server started on port ${port}`));
}

export { app };
