import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AXIOS_CONFIG } from 'src/shared/constants/common.constant';

@Injectable()
export class AxiosService {
  constructor(
    @Inject(AXIOS_CONFIG) private readonly options: { apiDomain: string },
    private readonly httpService: HttpService,
  ) {}

  async post<T>(headers: { [key: string]: string }, path: string, body: any): Promise<T> {
    try {
      const response = await lastValueFrom(
        this.httpService.post<T>(this.options.apiDomain + path, body, {
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
        }),
      );
      return response.data as T;
    } catch (error) {
      console.log('🚀 ~ AxiosService ~ error:', error);
      //   if (error instanceof AxiosError) {
      //     throw new PayosPaymentsException(error.response.data as PayosErrorResponse, error.response.status);
      //   }
      throw error;
    }
  }

  async get<T>(headers: { [key: string]: string }, path: string, searchParams: any = {}): Promise<T> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<T>(this.options.apiDomain + path, {
          params: searchParams,
          headers: {
            ...headers,
          },
        }),
      );
      return response.data as T;
    } catch (error) {
      console.log('🚀 ~ AxiosService ~ error:', error);
      //   if (error instanceof AxiosError) {
      //     throw new PayosPaymentsException(error.response.data as PayosErrorResponse, error.response.status);
      //   }
      throw error;
    }
  }
}
