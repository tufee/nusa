import { Request, Response } from 'express';
import { AuthenticateUserUseCase } from '../../../domain/usecases/authenticate-user-usecase';

export class AuthenticateController {
  constructor(private readonly authenticateUseCase: AuthenticateUserUseCase) {}

  async create(request: Request, response: Response) {
    try {
      const data = request.body;
      const authenticate = await this.authenticateUseCase.execute(data);
      return response.status(201).json(authenticate);
    } catch (error) {
      console.warn(error);
      if (error instanceof Error) {
        return response.status(400).json(error.message);
      }
    }
  }
}
