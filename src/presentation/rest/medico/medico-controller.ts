import { Request, Response } from 'express';
import { CreateMedicoUseCase } from '../../../domain/usecases/create-medico-usecase';

export class MedicoController {
  constructor(private readonly medicoUseCase: CreateMedicoUseCase) {}

  async create(request: Request, response: Response) {
    try {
      const data = request.body;
      const medico = await this.medicoUseCase.execute(data);
      return response.status(201).json(medico);
    } catch (error) {
      console.warn(error);
      if (error instanceof Error) {
        return response.status(400).json(error.message);
      }
    }
  }
}
