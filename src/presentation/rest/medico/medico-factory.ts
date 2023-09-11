import { MedicoRepository } from '../../../data/repositories/medico-repository';
import { PacienteRepository } from '../../../data/repositories/paciente-repository';
import { CreateMedicoUseCase } from '../../../domain/usecases/create-medico-usecase';
import { Encrypter } from '../../helper/encrypter';
import { MedicoController } from './medico-controller';

const medicoRepository = new MedicoRepository();
const pacienteRepository = new PacienteRepository();
const encrypter = new Encrypter();
const medicoUseCase = new CreateMedicoUseCase(
  medicoRepository,
  pacienteRepository,
  encrypter
);

const medicoController = new MedicoController(medicoUseCase);

export { medicoController };
