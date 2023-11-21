'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import { LuTrash2 } from 'react-icons/lu';
import { User } from './user-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';

export function DeleteForm({ user }: { user: User }) {
  const handleDelete = async () => {
    const promise = fetch(`/api/profile/${user?.id}`, {
      method: 'DELETE',
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Server Error');
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: 'Deleting...',
      success: () => {
        signOut();
        return 'Account deleted successfully';
      },
      error: 'Failed to delete Account. Please try again.',
    });
  };

  return (
    <div className="max-w-screen-xl bg-background mx-auto rounded-xl mt-6">
      <div className="grid gap-1 p-10 pb-4">
        <h1 className="text-destructive">Danger zone</h1>
        <p className="font-normal text-muted-foreground">Be Careful. Account deletion cannot be undone.</p>
      </div>
      <div className="py-6 px-10 flex justify-end border-t">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2 h-10 px-6">
              <LuTrash2 /> Delete account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete Account</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove all associated data
                from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className={cn(buttonVariants({ variant: 'destructive' }))}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
