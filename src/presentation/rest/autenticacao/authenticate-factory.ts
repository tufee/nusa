import { MedicoRepository } from '../../../data/repositories/medico-repository';
import { AuthenticateUserUseCase } from '../../../domain/usecases/authenticate-user-usecase';
import { AuthenticationJwt } from '../../helper/authentication-jwt';
import { Encrypter } from '../../helper/encrypter';
import { AuthenticateController } from './authenticate-controller';

const medicoRepository = new MedicoRepository();
const encrypter = new Encrypter();
const authenticationJwt = new AuthenticationJwt();

const authenticateUseCase = new AuthenticateUserUseCase(
  medicoRepository,
  encrypter,
  authenticationJwt
);

const authenticateController = new AuthenticateController(authenticateUseCase);

export { authenticateController };
