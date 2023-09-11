import express from 'express';
import { authenticateRouter } from './rest/autenticacao/authenticate-routes';
import { medicamentoRouter } from './rest/medicamento/medicamento-routes';
import { medicoRouter } from './rest/medico/medico-routes';
import { pacienteRouter } from './rest/paciente/paciente-routes';
import { receitaRouter } from './rest/receita/receita-routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(pacienteRouter);
app.use(medicoRouter);
app.use(medicamentoRouter);
app.use(receitaRouter);
app.use(authenticateRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Server started on port ${port}`));
}

export { app };
