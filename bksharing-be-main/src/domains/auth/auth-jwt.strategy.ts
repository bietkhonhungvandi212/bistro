import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AccountStatus, TokenType } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET_KEY } from 'src/app.config';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { AuthJwtPayloadDTO } from './dto/auth-jwt-payload.dto';
import { AuthUserDTO } from './dto/auth-user.dto';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(AuthJwtStrategy.name);
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET_KEY,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: AuthJwtPayloadDTO): Promise<AuthUserDTO> {
    const accessToken = req.headers['authorization'].split(' ')[1];
    const existedToken = await this.prismaService.token.findFirst({
      where: { token: accessToken, type: TokenType.VERIFY },
      select: { id: true },
    });

    if (existedToken) {
      this.logger.warn(`Token ${accessToken} is taken by another account, this token will be revoked`);
      await this.prismaService.token.delete({ where: { id: existedToken.id } });
      throw new ActionFailedException(ActionFailed.AUTH_TOKEN_INVALID);
    }

    const account = await this.prismaService.account.findUnique({
      where: { id: Number(payload.sub) },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        accountType: true,
        status: true,
      },
    });

    if (!account) throw new UnauthorizedException('Account not found');
    if (account.status === AccountStatus.SUSPENDED) throw new ActionFailedException(ActionFailed.ACCOUNT_SUSPENDED);
    if (account.status === AccountStatus.INACTIVE) throw new ActionFailedException(ActionFailed.ACCOUNT_NOT_VERIFIED);

    return AuthUserDTO.fromEntity(account as any);
  }
}
