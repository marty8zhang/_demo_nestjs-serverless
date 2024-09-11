import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Earthquake, EarthquakeDocument } from './entities/earthquake.entity';
import { EarthquakesGatewayInterface } from './gateways/earthquakes.gateway.interface';

@Injectable()
export class EarthquakesService {
  constructor(
    @InjectModel(Earthquake.name)
    private readonly earthquakesRepository: Model<Earthquake>,
    @Inject(EarthquakesGatewayInterface)
    private readonly earthquakesGateway: EarthquakesGatewayInterface,
  ) {}

  async create(earthquake: Earthquake): Promise<EarthquakeDocument> {
    return new this.earthquakesRepository(earthquake).save();
  }

  async findAll(): Promise<EarthquakeDocument[]> {
    const earthquakes = await this.earthquakesGateway.getEarthquakes();

    await this.earthquakesRepository.bulkWrite(
      earthquakes.map((e) => ({
        updateOne: {
          filter: { sourceId: e.sourceId },
          update: { $set: e },
          upsert: true,
        },
      })),
    );

    return this.earthquakesRepository.find().exec();
  }

  async update(
    id: string,
    earthquake: Partial<Earthquake>,
  ): Promise<EarthquakeDocument | null> {
    await this.earthquakesRepository
      .updateOne({ sourceId: id }, earthquake)
      .exec();

    return this.earthquakesRepository.findOne({ sourceId: id });
  }
}
