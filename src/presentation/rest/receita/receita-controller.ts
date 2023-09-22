import { Request, Response } from 'express';
import { ReceitaRepository } from '../../../data/repositories/receita-repository';
import { CreateReceitaUseCase } from '../../../domain/usecases/create-receita-usecase';

export class ReceitaController {
  constructor(
    private readonly receitaUseCase: CreateReceitaUseCase,
    private readonly receitaRepository: ReceitaRepository
  ) {}

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

  async findAll(_: Request, response: Response) {
    try {
      const receita = await this.receitaRepository.findAll();
      return response.status(201).json(receita);
    } catch (error) {
      console.warn(error);
      if (error instanceof Error) {
        return response.status(400).json(error.message);
      }
    }
  }
}
