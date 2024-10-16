import { retrieveEarthquakes } from '@/app/lib/earthquakes';
import { formatDateToLocal } from '@/app/lib/utils';

type Earthquake = {
  _id: string;
  title: string;
  time: string;
  magnitude: number;
  latitude: number;
  longitude: number;
  depth: number;
  updatedAt: string;
};

export default async function EarthquakesTable() {
  const earthquakes: [Earthquake] = await retrieveEarthquakes();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Time
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Magnitude
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Geolocation
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {earthquakes?.map((earthquake) => (
                <tr
                  key={earthquake._id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{earthquake.title}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(earthquake.time)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {earthquake.magnitude}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {`${earthquake.latitude}, ${earthquake.longitude}, ${earthquake.depth}`}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(earthquake.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
