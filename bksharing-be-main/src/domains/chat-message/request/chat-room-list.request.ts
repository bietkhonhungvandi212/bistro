import { ChatRoomType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationREQ } from 'src/shared/generics/pagination.request';

export class ChatRoomListREQ extends PaginationREQ {
  @IsString()
  @IsOptional()
  receiverName?: string;

  @IsOptional()
  @IsEnum(ChatRoomType)
  chatRoomType?: ChatRoomType;
}
