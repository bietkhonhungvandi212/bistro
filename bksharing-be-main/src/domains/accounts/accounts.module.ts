import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountController } from 'src/domains/accounts/account.controller';
import { CommonModule } from 'src/services/common.module';
import { AccountService } from './account.service';

@Module({
  imports: [CommonModule],
  providers: [AccountService, JwtService],
  exports: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
