import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { db } from '@/db';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { DeleteForm } from './components/delete-form';
import { UserForm } from './components/user-form';

type User =
  | {
      id: string;
      name: string | null;
      username: string | null;
      password: string | null;
      email: string;
      emailVerified: Date | null;
      image: string | null;
    }
  | undefined;

export const metadata = {
  title: 'Settings',
  description: 'Manage account and website settings.',
};

async function getUserData() {
  const session = await getServerSession(authOptions);
  return await db.query.users.findFirst({ where: (user, { eq }) => eq(user.id, session?.user?.id as string) });
}

export default async function Page() {
  const user = await getUserData();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="py-4">
      <div className="max-w-screen-xl bg-background mx-auto rounded-xl">
        <div className="grid gap-1 p-10 pb-0">
          <h1 className="font-bold text-4xl">Settings</h1>
          <p className="text-lg text-muted-foreground">Manage settings for your Page Pocket profile.</p>
        </div>
        <UserForm user={user} />
      </div>
      <DeleteForm user={user} />
    </div>
  );
}
