import { z } from 'zod';

export const createUserSchema = z
  .object({
    nome: z.string(),
    cpf: z.string().length(11),
    data_nascimento: z.string(),
    senha: z.string().min(6),
    confirma_senha: z.string().min(6),
  })
  .required()
  .refine(data => data.senha === data.confirma_senha, {
    message: 'Senhas não conferem',
    path: ['confirma_senha'],
  })
  .refine(
    data => {
      const dataNascimento = new Date(data.data_nascimento);
      return dataNascimento.toString() !== 'Invalid Date';
    },
    {
      message: 'Data de nascimento inválida',
      path: ['data_nascimento'],
    }
  );
