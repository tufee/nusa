import { createMedicamentoSchema, createUserSchema } from './zod-validator';

describe('ZodValidator', () => {
  describe('createUserSchema', () => {
    it('Deve aceitar dados de usuário válidos', () => {
      const usuarioValido = {
        nome: 'John Doe',
        cpf: '12345678901',
        data_nascimento: '1990-01-01',
        senha: 'password123',
        confirma_senha: 'password123',
      };

      expect(() => createUserSchema.parse(usuarioValido)).not.toThrow();
    });

    it('Deve rejeitar dados de usuário com senhas diferentes', () => {
      const usuarioComSenhasDiferentes = {
        nome: 'John Doe',
        cpf: '12345678901',
        data_nascimento: '1990-01-01',
        senha: 'password123',
        confirma_senha: 'differentpassword',
      };

      expect(() =>
        createUserSchema.parse(usuarioComSenhasDiferentes)
      ).toThrowError('Senhas não conferem');
    });

    it('Deve rejeitar dados de usuário com data de nascimento inválida', () => {
      const usuarioComDataDeNascimentoInvalida = {
        nome: 'John Doe',
        cpf: '12345678901',
        data_nascimento: 'invalid-date',
        senha: 'password123',
        confirma_senha: 'password123',
      };

      expect(() =>
        createUserSchema.parse(usuarioComDataDeNascimentoInvalida)
      ).toThrowError('Data de nascimento inválida');
    });

    it('Deve rejeitar dados de usuário com campos em falta', () => {
      const usarioComCamposEmFalta = {
        nome: 'John Doe',
        cpf: '12345678901',
      };

      expect(() =>
        createUserSchema.parse(usarioComCamposEmFalta)
      ).toThrowError();
    });
  });

  describe('createMedicamentoSchema', () => {
    it('Deve aceitar dados de medicamento válidos', () => {
      const medicamentoData = {
        nome: 'dipirona',
        categoria: 'ANALGESICOS',
        codigo_anvisa: '1018600360022',
      };

      expect(() =>
        createMedicamentoSchema.parse(medicamentoData)
      ).not.toThrow();
    });

    it('Deve rejeitar dados de medicamento com campos ausentes', () => {
      const medicamentoData = {
        nome: 'dipirona',
      };

      expect(() =>
        createMedicamentoSchema.parse(medicamentoData)
      ).toThrowError();
    });

    it('Deve rejeitar dados de medicamento com tipos inválidos', () => {
      const medicamentoData = {
        nome: 123,
        categoria: 123,
        codigo_anvisa: 123,
      };

      expect(() =>
        createMedicamentoSchema.parse(medicamentoData)
      ).toThrowError();
    });
  });
});
