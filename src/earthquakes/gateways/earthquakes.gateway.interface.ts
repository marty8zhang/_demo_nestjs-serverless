import { Earthquake } from '../entities/earthquake.entity';

export interface EarthquakesGatewayInterface {
  getEarthquakes(): Promise<Earthquake[]>;
}

export const EarthquakesGatewayInterface = Symbol(
  'EarthquakesGatewayInterface',
);
