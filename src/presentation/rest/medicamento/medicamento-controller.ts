import { Request, Response } from 'express';
import { CreateMedicamentoUseCase } from '../../../domain/usecases/create-medicamento-usecase';

export class MedicamentoController {
  constructor(private readonly medicamentoUseCase: CreateMedicamentoUseCase) {}

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
}
