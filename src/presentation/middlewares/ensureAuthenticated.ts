import { NextFunction, Request, Response } from 'express';
import { AuthenticationJwt } from '../helper/authentication-jwt';

interface TokenPayload {
  userId: string;
  tipo: string;
  iat: number;
  exp: number;
}

const authenticationJwt = new AuthenticationJwt();

export default function ensureAuthenticated(
  request: Request,
  _: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error('O token JWT é obrigatório');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = authenticationJwt.verifyToken(token);

    const { userId, tipo } = decoded as TokenPayload;

    if (tipo !== 'medico') {
      throw new Error();
    }

    request.user = {
      userId,
      tipo,
    };

    return next();
  } catch (error) {
    throw new Error('Usuário não autorizado');
  }
}
