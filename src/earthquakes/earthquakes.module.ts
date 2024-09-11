import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EarthquakesController } from './earthquakes.controller';
import { EarthquakesService } from './earthquakes.service';
import { Earthquake, EarthquakeSchema } from './entities/earthquake.entity';
import { EarthquakesGatewayInterface } from './gateways/earthquakes.gateway.interface';
import { UsgsEarthquakesGateway } from './gateways/usgs-earthquakes.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Earthquake.name, schema: EarthquakeSchema },
    ]),
  ],
  providers: [
    EarthquakesService,
    {
      provide: EarthquakesGatewayInterface,
      useClass: UsgsEarthquakesGateway,
    },
  ],
  controllers: [EarthquakesController],
})
export class EarthquakesModule {}
