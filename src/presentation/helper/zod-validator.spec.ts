import { createUserSchema } from './zod-validator';

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

    expect(() => createUserSchema.parse(usarioComCamposEmFalta)).toThrowError();
  });
});
