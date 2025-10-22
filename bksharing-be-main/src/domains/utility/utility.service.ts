import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { SortOrder } from 'src/shared/enums/query.enum';
import { BaseResponse } from 'src/shared/generics/base.response';

import { ActionFailed } from 'src/shared/exceptions/action-failed.exception';
import { MentorAdminListSortableFields } from '../mentor/shared/enums';
import { UtilityEnumREQ } from './request/utility-enum.request';

@Injectable()
export class UtilityService {
  constructor() {}

  private readonly additionEnums = {
    SortOrder: SortOrder,
    ...$Enums,
    ActionFailed: ActionFailed,
    MentorAdminListSortableFields: MentorAdminListSortableFields,
  };
  findAll(body: UtilityEnumREQ) {
    const response: { [key: string]: object } = {};
    if (body.keys.length === 0) {
      Object.keys(this.additionEnums).forEach((k) => (response[k] = Object.values(this.additionEnums[k])));
    } else
      body.keys.forEach((k) => {
        const value = this.additionEnums[k];
        if (!value) throw new UnprocessableEntityException(`Key: ${k} doesn't not exist`);
        response[k] = value;
      });
    return BaseResponse.of(response);
  }
}
