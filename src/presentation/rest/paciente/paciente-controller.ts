import { Request, Response } from 'express';
import { CreatePacienteUseCase } from '../../../domain/usecases/create-paciente-usecase';
import { PacienteRepository } from '../../../data/repositories/paciente-repository';

export class PacienteController {
  constructor(
    private readonly pacienteUseCase: CreatePacienteUseCase,
    private readonly pacienteRepository: PacienteRepository
  ) {}

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

  async findAll(_: Request, response: Response) {
    try {
      const paciente = await this.pacienteRepository.findAll();
      return response.status(201).json(paciente);
    } catch (error) {
      console.warn(error);
      if (error instanceof Error) {
        return response.status(400).json(error.message);
      }
    }
  }
}
