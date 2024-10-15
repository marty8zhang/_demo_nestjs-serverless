import { auth } from '../lib/auth/auth';

export default async function Dashboard() {
  const authSession = await auth();
  console.log('Dashboard auth:', authSession);

  return <h1 className={`mb-4 text-xl md:text-2xl`}>Dashboard</h1>;
}
