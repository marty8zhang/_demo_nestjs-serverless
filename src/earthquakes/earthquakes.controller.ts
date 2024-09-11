import { Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { EarthquakesService } from './earthquakes.service';
import { Earthquake, EarthquakeDocument } from './entities/earthquake.entity';

@Controller()
export class EarthquakesController {
  constructor(private readonly earthquakesService: EarthquakesService) {}

  @Post()
  async create(): Promise<EarthquakeDocument> {
    const earthquake = new Earthquake();
    earthquake.sourceId = 'ak024bo9d5n9';
    earthquake.magnitude = 2.5;
    earthquake.latitude = 71.23;
    earthquake.longitude = 17.32;
    earthquake.depth = 12.34;
    earthquake.time = new Date();

    return this.earthquakesService.create(earthquake);
  }

  @Get()
  async findAll(): Promise<EarthquakeDocument[]> {
    return this.earthquakesService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string): Promise<EarthquakeDocument> {
    const updatedEarthquake = new Earthquake();
    updatedEarthquake.title = 'Brand New Earthquake';

    return await this.earthquakesService.update(id, updatedEarthquake);
  }
}
