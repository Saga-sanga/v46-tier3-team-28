import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingPage() {
  return (
    <div className="py-4">
      <div className="max-w-screen-xl bg-background mx-auto rounded-xl">
        <div className="grid gap-1 p-10 pb-0">
          <h1 className="font-bold text-4xl">Settings</h1>
          <p className="text-lg text-muted-foreground">Manage settings for your Page Pocket profile.</p>
        </div>
        <div className="mt-10">
          <div className="px-10 pb-10 flex flex-col gap-6">
            <Skeleton className="w-full h-[200px]" />
            <Skeleton className="w-full h-[76px] max-w-screen-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
