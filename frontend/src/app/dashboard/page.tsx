import { auth } from '../lib/auth/auth';
import Table from '../ui/dashboard/table';

export default async function Dashboard() {
  const authSession = await auth();
  console.log('Dashboard auth:', authSession);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Dashboard</h1>
      </div>
      <Table />
    </div>
  );
}
