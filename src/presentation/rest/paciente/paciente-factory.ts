import { PacienteRepository } from '../../../data/repositories/paciente-repository';
import { CreatePacienteUseCase } from '../../../domain/usecases/create-paciente-usecase';
import { PacienteController } from './paciente-controller';

const pacienteRepository = new PacienteRepository();
const pacienteUseCase = new CreatePacienteUseCase(pacienteRepository);

const pacienteController = new PacienteController(pacienteUseCase);

export { pacienteController };
