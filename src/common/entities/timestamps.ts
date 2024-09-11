import { Prop } from '@nestjs/mongoose';

export class Timestamps {
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}
