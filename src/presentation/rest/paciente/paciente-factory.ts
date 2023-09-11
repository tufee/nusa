import { MedicoRepository } from '../../../data/repositories/medico-repository';
import { PacienteRepository } from '../../../data/repositories/paciente-repository';
import { CreatePacienteUseCase } from '../../../domain/usecases/create-paciente-usecase';
import { Encrypter } from '../../helper/encrypter';
import { PacienteController } from './paciente-controller';

const pacienteRepository = new PacienteRepository();
const medicoRepository = new MedicoRepository();
const encrypter = new Encrypter();
const pacienteUseCase = new CreatePacienteUseCase(
  pacienteRepository,
  medicoRepository,
  encrypter
);

const pacienteController = new PacienteController(pacienteUseCase);

export { pacienteController };
