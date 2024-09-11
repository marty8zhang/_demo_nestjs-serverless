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
        uri: `mongodb://${config.get<string>('MONGO_USERNAME')}:${config.get<string>('MONGO_PASSWORD')}@${config.get<string>('MONGO_HOST')}:${config.get<string>('MONGO_PORT')}/${config.get<string>('MONGO_DBNAME')}?authSource=admin`,
      }),
    }),
    HttpModule,
    EarthquakesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
