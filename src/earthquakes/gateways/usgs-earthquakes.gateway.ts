import { Earthquake } from '../entities/earthquake.entity';
import { EarthquakesGatewayInterface } from './earthquakes.gateway.interface';

export class UsgsEarthquakesGateway implements EarthquakesGatewayInterface {
  async getEarthquakes(): Promise<Earthquake[]> {
    const eq1 = new Earthquake();
    eq1.sourceId = 'ak024bo9d5n9';
    eq1.title = '54 km NNE of Yakutat, Alaska';
    // eq1.magnitude = 3.1;
    eq1.magnitude = 1.8;
    eq1.latitude = 60.0256;
    eq1.longitude = -139.5146;
    eq1.depth = 2.8;
    eq1.time = new Date(1725969163099);
    eq1.sourceUpdatedAt = new Date(1725969354667);
    // eq1.sourceUrl = null;
    eq1.sourceUrl =
      'https://earthquake.usgs.gov/earthquakes/eventpage/ak024bo9d5n9';
    eq1.sourceDataReference =
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/ak024bo9d5n9.geojson';
    const eq2 = new Earthquake();
    eq2.sourceId = 'new';
    eq2.title = 'new - 54 km NNE of Yakutat, Alaska';
    eq2.magnitude = 9.5;
    eq2.latitude = 60.0256;
    eq2.longitude = -139.5146;
    eq2.depth = 2.8;
    eq2.time = new Date(1725969163099);
    eq2.sourceUpdatedAt = new Date(1725969354667);

    // return [eq1];
    return [eq1, eq2];
  }
}
