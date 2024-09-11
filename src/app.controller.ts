import * as process from 'node:process';

import { HttpService } from '@nestjs/axios';
import { Controller, Get } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('database-credentials')
  getDatabaseCredentials(): object {
    return {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      databaseName: process.env.DB_DBNAME,
    };
  }

  @Get('vpc-private-resource')
  async getVpcPrivateResource() {
    const url = `http://${process.env.EGGHDZ_V1_ADDRESS}`;
    console.log(`Hitting ${url}...`);
    const response = await firstValueFrom(this.httpService.get(url));

    return response.data;
  }
}
