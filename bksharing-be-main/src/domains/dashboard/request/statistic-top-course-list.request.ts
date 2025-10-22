import { IsEnum } from 'class-validator';
import { TopCourseType } from '../shared/types';
import { StatisticOverviewListREQ } from './statistic-overview-list.request';

export class StatisticTopCourseListREQ extends StatisticOverviewListREQ {
  @IsEnum(TopCourseType)
  topCourseType: TopCourseType;
}
