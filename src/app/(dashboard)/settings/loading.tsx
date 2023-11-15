import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingPage() {
  return (
    <div className="py-4">
      <div className="max-w-screen-xl bg-background mx-auto rounded-xl">
        <div className="grid gap-1 p-10 pb-0">
          <h1 className="font-bold text-4xl">Settings</h1>
          <p className="text-lg text-muted-foreground">Manage settings for your Page Pocket profile.</p>
        </div>
        <Skeleton className="w-full h-[200px]" />
      </div>
      <Skeleton className="w-full h-[76px]" />
    </div>
  );
}
