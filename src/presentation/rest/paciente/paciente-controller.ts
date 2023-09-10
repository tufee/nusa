import { Request, Response } from 'express';
import { CreatePacienteUseCase } from '../../../domain/usecases/create-paciente-usecase';

export class PacienteController {
  constructor(private readonly pacienteUseCase: CreatePacienteUseCase) {}

  async create(request: Request, response: Response) {
    try {
      const data = request.body;
      const paciente = await this.pacienteUseCase.execute(data);
      return response.status(201).json(paciente);
    } catch (error) {
      console.warn(error);
      if (error instanceof Error) {
        return response.status(400).json(error.message);
      }
    }
  }
}
