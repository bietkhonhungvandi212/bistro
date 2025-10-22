import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_ACCESS_TOKEN_EXPIRE_HOURS, JWT_SECRET_KEY } from 'src/app.config';

import { CommonModule } from 'src/services/common.module';
import { AccountModule } from '../accounts/accounts.module';
import { AuthJwtStrategy } from './auth-jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    CommonModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { algorithm: 'HS256', expiresIn: JWT_ACCESS_TOKEN_EXPIRE_HOURS },
      verifyOptions: { algorithms: ['HS256'] },
    }),
    AccountModule,
  ],
  controllers: [AuthController],
  providers: [AuthJwtStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
