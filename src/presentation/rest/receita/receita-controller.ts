import { Request, Response } from 'express';
import { CreateReceitaUseCase } from '../../../domain/usecases/create-receita-usecase';

export class ReceitaController {
  constructor(private readonly receitaUseCase: CreateReceitaUseCase) {}

  async create(request: Request, response: Response) {
    try {
      const data = request.body;
      const receita = await this.receitaUseCase.execute(data);
      return response.status(201).json(receita);
    } catch (error) {
      console.warn(error);
      if (error instanceof Error) {
        return response.status(400).json(error.message);
      }
    }
  }
}
