import { JwtPayload } from 'jsonwebtoken';

export type JwtRequestPayload = {
  userId: string;
  tipo: string;
};

export interface IAuthenticationJwt {
  generateToken(jwtData: JwtRequestPayload): string;
  verifyToken(token: string): JwtPayload | string;
}
