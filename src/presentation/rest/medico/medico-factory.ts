import { MedicoRepository } from '../../../data/repositories/medico-repository';
import { CreateMedicoUseCase } from '../../../domain/usecases/create-medico-usecase';
import { Encrypter } from '../../helper/encrypter';
import { MedicoController } from './medico-controller';

const medicoRepository = new MedicoRepository();
const encrypter = new Encrypter();
const medicoUseCase = new CreateMedicoUseCase(medicoRepository, encrypter);
const medicoController = new MedicoController(medicoUseCase);

export { medicoController };
