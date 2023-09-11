import jwt, { JwtPayload } from 'jsonwebtoken';
import { authConfig } from './auth-config';
import {
  IAuthenticationJwt,
  type JwtRequestPayload,
} from './interfaces/authentication-jwt';

export class AuthenticationJwt implements IAuthenticationJwt {
  generateToken(jwtData: JwtRequestPayload): string {
    try {
      return jwt.sign(jwtData, authConfig.jwt.secret, {
        expiresIn: authConfig.jwt.expiresIn,
      });
    } catch (error) {
      console.warn(error);
      throw new Error('JWT signing error');
    }
  }

  verifyToken(token: string): JwtPayload | string {
    try {
      return jwt.verify(token, authConfig.jwt.secret);
    } catch (error) {
      console.warn(error);
      throw new Error('Token inválido');
    }
  }
}
