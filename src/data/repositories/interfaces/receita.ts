import { IReceita } from '../../../domain/entities/interfaces/receita';

export interface IReceitaRepository {
  create(receita: IReceita): Promise<IReceita>;
}
