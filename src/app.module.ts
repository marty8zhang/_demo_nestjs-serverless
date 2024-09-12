import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EarthquakesModule } from './earthquakes/earthquakes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: `mongodb://${config.get<string>('DB_HOST')}:${config.get<string>('DB_PORT')}`,
        authSource: 'admin',
        user: config.get<string>('DB_USERNAME'),
        pass: config.get<string>('DB_PASSWORD'),
        dbName: config.get<string>('DB_DBNAME'),
      }),
    }),
    HttpModule,
    EarthquakesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
