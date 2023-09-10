import { Encrypter } from './encrypter';

describe('Encrypter', () => {
  let encrypter: Encrypter;

  beforeEach(() => {
    encrypter = new Encrypter();
  });

  describe('encrypt', () => {
    it('Deve encryptar uma senha', async () => {
      const result = await encrypter.encrypt('password');

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('decrypt', () => {
    it('Deve retornar verdadeiro para senhas correspondentes', async () => {
      const password = 'password';
      const hash = await encrypter.encrypt(password);

      const result = await encrypter.decrypt(password, hash);

      expect(result).toBe(true);
    });

    it('Deve retornar falso para senhas não correspondentes', async () => {
      const password = 'password';
      const wrongPassword = 'wrongPassword';
      const hash = await encrypter.encrypt(password);

      const result = await encrypter.decrypt(wrongPassword, hash);

      expect(result).toBe(false);
    });
  });
});
