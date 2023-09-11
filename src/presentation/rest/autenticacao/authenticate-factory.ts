import { MedicoRepository } from '../../../data/repositories/medico-repository';
import { PacienteRepository } from '../../../data/repositories/paciente-repository';
import { AuthenticateUserUseCase } from '../../../domain/usecases/authenticate-user-usecase';
import { AuthenticationJwt } from '../../helper/authentication-jwt';
import { Encrypter } from '../../helper/encrypter';
import { AuthenticateController } from './authenticate-controller';

const pacienteRepository = new PacienteRepository();
const medicoRepository = new MedicoRepository();
const encrypter = new Encrypter();
const authenticationJwt = new AuthenticationJwt();

const authenticateUseCase = new AuthenticateUserUseCase(
  pacienteRepository,
  medicoRepository,
  encrypter,
  authenticationJwt
);

const authenticateController = new AuthenticateController(authenticateUseCase);

export { authenticateController };
