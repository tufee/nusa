import { z } from 'zod';

export function formatCPF(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

export const createPacienteSchema = z
  .object({
    nome: z.string(),
    cpf: z.string(),
    data_nascimento: z.string(),
  })
  .required()
  .refine(
    data => {
      const dataNascimento = new Date(data.data_nascimento);
      return dataNascimento.toString() !== 'Invalid Date';
    },
    {
      message: 'Data de nascimento inválida',
      path: ['data_nascimento'],
    }
  )
  .refine(
    data => {
      const cleanedCPF = data.cpf.replace(/\D/g, '');

      if (cleanedCPF.length !== 11) {
        return false;
      }

      return true;
    },
    {
      message: 'CPF inválido',
      path: ['cpf'],
    }
  );

export const createMedicoSchema = z
  .object({
    nome: z.string(),
    cpf: z.string(),
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
  )
  .refine(
    data => {
      const cleanedCPF = data.cpf.replace(/\D/g, '');

      if (cleanedCPF.length !== 11) {
        return false;
      }

      return true;
    },
    {
      message: 'CPF inválido',
      path: ['cpf'],
    }
  );

export const createMedicamentoSchema = z
  .object({
    nome: z.string(),
    categoria: z.string(),
    codigo_anvisa: z.string(),
  })
  .required();

export const createReceitaSchema = z
  .object({
    medico_id: z.string().uuid(),
    paciente_id: z.string().uuid(),
    medicamento_id: z.string().uuid(),
    data_prescricao: z.string(),
  })
  .required()
  .refine(
    data => {
      const dataPrescricao = new Date(data.data_prescricao);
      return dataPrescricao.toString() !== 'Invalid Date';
    },
    {
      message: 'Data de prescrição inválida',
      path: ['data_prescricao]'],
    }
  );

export const loginInputSchema = z
  .object({
    cpf: z.string(),
    senha: z.string().min(6),
  })
  .required()
  .refine(
    data => {
      const cleanedCPF = data.cpf.replace(/\D/g, '');

      if (cleanedCPF.length !== 11) {
        return false;
      }

      return true;
    },
    {
      message: 'CPF inválido',
      path: ['cpf'],
    }
  );
