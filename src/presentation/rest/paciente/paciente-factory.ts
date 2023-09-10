import { PacienteRepository } from '../../../data/repositories/paciente-repository';
import { CreatePacienteUseCase } from '../../../domain/usecases/create-paciente-usecase';
import { Encrypter } from '../../helper/encrypter';
import { PacienteController } from './paciente-controller';

const pacienteRepository = new PacienteRepository();
const encrypter = new Encrypter();
const pacienteUseCase = new CreatePacienteUseCase(
  pacienteRepository,
  encrypter
);
const pacienteController = new PacienteController(pacienteUseCase);

export { pacienteController };
