import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Timestamps } from '../../common/entities/timestamps';

@Schema({ timestamps: true })
export class Earthquake extends Timestamps {
  @Prop({
    required: true,
    unique: true,
  })
  sourceId: string;

  @Prop()
  title?: string;

  @Prop({
    required: true,
  })
  magnitude: number;

  @Prop({
    required: true,
  })
  latitude: number;

  @Prop({
    required: true,
  })
  longitude: number;

  @Prop({
    required: true,
  })
  depth: number;

  @Prop({
    required: true,
  })
  time: Date;

  @Prop()
  sourceUpdatedAt?: Date;

  @Prop()
  sourceUrl?: string;

  @Prop()
  sourceDataReference?: string;
}

export type EarthquakeDocument = HydratedDocument<Earthquake>;
export const EarthquakeSchema = SchemaFactory.createForClass(Earthquake);
