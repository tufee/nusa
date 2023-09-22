import { Request, Response } from 'express';
import { MedicamentoRepository } from '../../../data/repositories/medicamento-repository';
import { CreateMedicamentoUseCase } from '../../../domain/usecases/create-medicamento-usecase';

export class MedicamentoController {
  constructor(
    private readonly medicamentoUseCase: CreateMedicamentoUseCase,
    private readonly medicamentoRepository: MedicamentoRepository
  ) {}

  async create(request: Request, response: Response) {
    try {
      const data = request.body;
      const medicamento = await this.medicamentoUseCase.execute(data);
      return response.status(201).json(medicamento);
    } catch (error) {
      console.warn(error);
      if (error instanceof Error) {
        return response.status(400).json(error.message);
      }
    }
  }

  async findAll(_request: Request, response: Response) {
    try {
      const medicamento = await this.medicamentoRepository.findAll();
      return response.status(200).json(medicamento);
    } catch (error) {
      console.warn(error);
      if (error instanceof Error) {
        return response.status(400).json(error.message);
      }
    }
  }

  async search(request: Request, response: Response) {
    try {
      const paciente = await this.medicamentoRepository.search(
        request.query.name as string
      );
      return response.status(201).json(paciente);
    } catch (error) {
      console.warn(error);
      if (error instanceof Error) {
        return response.status(400).json(error.message);
      }
    }
  }
}
