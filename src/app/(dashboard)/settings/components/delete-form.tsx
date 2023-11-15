'use client';
import { Button } from '@/components/ui/button';
import { LuTrash2 } from 'react-icons/lu';
import { User } from './user-form';

export function DeleteForm({ user }: { user: User }) {
  return (
    <div className="max-w-screen-xl bg-background mx-auto rounded-xl mt-6">
      <div className="grid gap-1 p-10 pb-4">
        <h1 className="text-destructive">Danger zone</h1>
        <p className="font-normal text-muted-foreground">Be Careful. Account deletion cannot be undone.</p>
      </div>
      <div className="py-6 px-10 flex justify-end border-t">
        <Button variant="destructive" className="flex items-center gap-2 h-10 px-6">
          <LuTrash2 /> Delete account
        </Button>
      </div>
    </div>
  );
}
