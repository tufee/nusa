import bcrypt from 'bcrypt';
import { IEncrypter } from './interfaces/encrypter';

export class Encrypter implements IEncrypter {
  async encrypt(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(password, salt);
  }

  async decrypt(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
