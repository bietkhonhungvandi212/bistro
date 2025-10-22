import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { AuthJwtPayloadDTO } from 'src/domains/auth/dto/auth-jwt-payload.dto';

export interface AuthSocket extends Socket {
  payload: AuthJwtPayloadDTO;
}
export type SocketMiddleware = (socket: AuthSocket, next: (err?: Error) => void) => void;

export const SocketAuthMiddleware = (jwtService: JwtService, logger: Logger): SocketMiddleware => {
  return (client, next) => {
    try {
      const authorization =
        client.handshake.auth.token || client.handshake.headers['token'] || client.handshake.headers.authorization;
      const jwtPayload = jwtService.verify(authorization ?? '') as AuthJwtPayloadDTO;

      logger.log('🚀 ~ return ~ authorization:', authorization);

      if (jwtPayload) {
        logger.log('🚀 ~ return ~ jwtPayload:', jwtPayload);
        client.payload = jwtPayload;
        next();
      } else {
        next({
          name: 'Unauthorizaed',
          message: 'Unauthorizaed',
        });
      }
    } catch (error) {
      next({
        name: 'Unauthorizaed',
        message: 'Unauthorizaed',
      });
    }
  };
};
