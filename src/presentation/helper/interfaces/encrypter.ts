export interface IEncrypter {
  encrypt(password: string): Promise<string>;
  decrypt(password: string, hash: string): Promise<boolean>;
}
