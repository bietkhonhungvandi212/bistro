import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { Roles } from 'src/domains/auth/auth-role.decorator';
import { AuthRoleGuard } from 'src/domains/auth/auth-role.guard';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { MentorAchievementRESP } from 'src/domains/mentor/admin/response/mentor-client-detail.response';
import { BaseResponse } from 'src/shared/generics/base.response';
import { StudentAchievementCreateREQ } from '../request/student-achievement-create.request';
import { StudentAchievementUpdateREQ } from '../request/student-achievement-update.request';
import { StudentClientDetailRESP } from '../response/student-client-detail.response';
import { StudentClientService } from './student-client.service';

@Controller('client/students')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.STUDENT)
export class StudentClientController {
  constructor(private readonly studentClientService: StudentClientService) {}

  @Get('profile')
  async profile(@Req() req: AuthRequestDTO) {
    const response = await this.studentClientService.getStudentByAccountId(req.user.accountId);

    return BaseResponse.of(StudentClientDetailRESP.fromEntity(response.student, response.achievements, response.thumbnail));
  }

  @Get('achievements')
  async getAchievements(@Req() req: AuthRequestDTO) {
    const achievements = await this.studentClientService.getStudentAchievements(req.user.accountId);

    const response = achievements.map((achievement) => MentorAchievementRESP.filterAchievementType(achievement));

    return BaseResponse.of(response);
  }

  @Post(':id/achievements')
  async addProfileAchievement(
    @Param('id', ParseIntPipe) studentId: number,
    @Body() body: StudentAchievementCreateREQ,
    @Req() req: AuthRequestDTO,
  ) {
    const response = await this.studentClientService.addProfileAchievement(studentId, body, req.user);

    return BaseResponse.of(response);
  }

  @Patch(':id/achievements')
  async updateAchievements(
    @Param('id', ParseIntPipe) studentId: number,
    @Body() body: StudentAchievementUpdateREQ,
    @Req() req: AuthRequestDTO,
  ) {
    const response = await this.studentClientService.updateAchievements(studentId, body, req.user);

    return BaseResponse.of(response);
  }

  @Delete(':id/achievements/:achievementId')
  async deleteAchievement(
    @Param('id', ParseIntPipe) studentId: number,
    @Param('achievementId', ParseIntPipe) achievementId: number,
    @Req() req: AuthRequestDTO,
  ) {
    const response = await this.studentClientService.deleteAchievement(studentId, achievementId, req.user);

    return BaseResponse.of(response);
  }
}
