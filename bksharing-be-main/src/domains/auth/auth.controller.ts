import { Body, Controller, Get, HttpCode, HttpStatus, Ip, Logger, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseResponse } from 'src/shared/generics/base.response';
import { ImageService } from '../image/image.service';
import { AuthService } from './auth.service';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthEmailVerificationREQ } from './request/auth-email-verification.request';
import { AuthFindPasswordResetREQ } from './request/auth-find-password-reset.request';
import { AuthLoginREQ } from './request/auth-login.request';
import { AuthMentorRegisterREQ } from './request/auth-mentor-register.request';
import { AuthRegistrationStudentREQ } from './request/auth-student-register.request';
import { AuthTestAccountREQ } from './request/auth-test-account.request';
import { AuthRegisterRESP } from './response/auth-register.response';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly imageService: ImageService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successfully',
    type: BaseResponse<AuthLoginDTO>,
    example: {
      data: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzI1NDczOTg2LCJleHAiOjE3MjgwNjU5ODZ9.Um00Niu0CP6WsaaS4jRjWUKbelFkgqMCP4COBKI-xYk',
        accountType: 'STUDENT',
      },
      message: 'OK',
    },
  })
  async login(@Body() body: AuthLoginREQ, @Ip() ip: string, @Req() req) {
    const ipAddress = req.headers['x-forwarded-for'] || ip;
    return await this.authService.login(AuthLoginDTO.fromRequest(body, ipAddress));
  }

  @Post('students/register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Register student successfully',
    type: BaseResponse,
    example: {
      data: 201,
      message: 'OK',
    },
  })
  async registerStudent(@Body() body: AuthRegistrationStudentREQ) {
    const { account, imageId } = await this.authService.registerStudent(body);

    return BaseResponse.of(AuthRegisterRESP.fromAccount(account as any, await this.imageService.getImageOriginal(imageId)));
  }

  @Post('mentors/register')
  async registerMentor(@Body() body: AuthMentorRegisterREQ) {
    const { account, imageId } = await this.authService.registerMentor(body);
    this.logger.log('🚀 ~ AuthController ~ registerMentor ~ imageId:', imageId);

    return BaseResponse.of(AuthRegisterRESP.fromAccount(account as any, await this.imageService.getImageOriginal(imageId)));
  }

  @Patch('verification/:token')
  async verifyEmail(@Param('token') token: string) {
    const { account, jwtToken, imageId } = await this.authService.verifyEmail(token);

    return BaseResponse.of(
      AuthRegisterRESP.fromAccount(account as any, await this.imageService.getImageOriginal(imageId), jwtToken),
    );
  }

  @Get('tokens/:token')
  async verifyToken(@Param('token') token: string) {
    await this.authService.verifyToken(token);

    return BaseResponse.ok();
  }

  @Post('email/forgot-password')
  async sendEmailResetPassword(@Body() body: AuthEmailVerificationREQ) {
    await this.authService.sendEmailForgotPassword(body);

    return BaseResponse.ok();
  }

  @Patch('/reset-password')
  @ApiResponse({ description: 'Reset password successfully' })
  async findPasswordReset(@Body() body: AuthFindPasswordResetREQ) {
    await this.authService.resetPassword(body);

    return BaseResponse.ok();
  }

  @Post('test-accounts')
  async createTestAccount(@Body() body: AuthTestAccountREQ) {
    const account = await this.authService.createTestAccount(body);
    return account;
  }
}
