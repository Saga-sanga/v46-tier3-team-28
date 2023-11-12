'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LuImage, LuTrash2 } from 'react-icons/lu';

function page() {
  const handleUpdateProfile = () => {};

  return (
    <div className="py-4">
      <div className="max-w-screen-xl bg-background mx-auto rounded-xl">
        <div className="grid gap-1 p-10 pb-0">
          <h1 className="font-bold text-4xl">Settings</h1>
          <p className="text-lg text-muted-foreground">Manage settings for your Page Pocket profile.</p>
        </div>
        <form className="mt-10">
          <div className="px-10 pb-10 flex flex-col gap-6">
            <div className="flex items-center bg-secondary px-5 gap-4 rounded-lg">
              <p className="text-muted-foreground text-base w-60 font-normal">Profile picture</p>
              <div className="flex items-center gap-6">
                <Label
                  htmlFor="image"
                  className="flex flex-col gap-2 cursor-pointer aspect-square bg-primary/10 items-center justify-center rounded-lg h-48 my-1"
                >
                  <LuImage className="w-10 h-10 text-primary" />
                  <p className="text-center font-extralight text-primary">+ Upload Image</p>
                  <Input id="image" name="image" className="hidden" type="file" />
                </Label>
                <p className="text-sm text-muted-foreground lg:whitespace-nowrap">
                  Image must be below 1024x1024px. Use PNG or JPG format.
                </p>
              </div>
            </div>
            <div className="p-5 bg-secondary rounded-lg flex flex-col gap-3">
              <fieldset className="flex gap-4 items-center">
                <Label className="w-60 text-muted-foreground font-normal" htmlFor="name">
                  Full Name
                </Label>{' '}
                <Input className="bg-background" id="name" name="name" />
              </fieldset>
              <fieldset className="flex gap-4 items-center">
                <Label className="w-60 text-muted-foreground font-normal" htmlFor="username">
                  Username
                </Label>{' '}
                <Input className="bg-background" id="username" name="username" />
              </fieldset>
              <fieldset className="flex gap-4 items-center">
                <Label className="w-60 text-muted-foreground font-normal" htmlFor="email">
                  Email
                </Label>{' '}
                <Input className="bg-background" id="email" name="email" />
              </fieldset>
            </div>
          </div>
          <div className="border-t py-6 px-10 flex justify-end">
            <Button className="px-6 h-10" type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
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
    </div>
  );
}

export default page;
