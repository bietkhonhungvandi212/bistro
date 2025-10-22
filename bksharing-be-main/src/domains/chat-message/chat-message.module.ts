import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_ACCESS_TOKEN_EXPIRE_HOURS, JWT_SECRET_KEY } from 'src/app.config';
import { AccountModule } from '../accounts/accounts.module';
import { ChatMessageController } from './chat-message.controller';
import { ChatMessageGateway } from './chat-message.gateway';
import { ChatMessageService } from './chat-message.service';

@Module({
  imports: [
    AccountModule,
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { algorithm: 'HS256', expiresIn: JWT_ACCESS_TOKEN_EXPIRE_HOURS },
      verifyOptions: { algorithms: ['HS256'] },
    }),
  ],
  controllers: [ChatMessageController],
  providers: [ChatMessageService, ChatMessageGateway],
  exports: [ChatMessageService],
})
export class ChatMessageModule {}
