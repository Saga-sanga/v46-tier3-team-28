'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { profileUpdateSchema } from '@/lib/validators/profile';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoImageOutline } from 'react-icons/io5';
import { LuLoader2 } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';

export type User =
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

interface UserFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: User;
}

type ProfileObject = z.infer<typeof profileUpdateSchema>;

// use React hook form
// TODO: refactor code to use prop data

export function UserForm({ user, className, ...props }: UserFormProps) {
  const [image, setImage] = useState<File>();
  const [imageURL, setImageURL] = useState(user?.image ?? undefined);
  const [name, setName] = useState<string>(user?.name ?? '');
  const [email, setEmail] = useState<string>(user?.email ?? '');
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      let imageAddress = user?.image ?? undefined;
      // Find logic to update image only if it has been changed

      if (image) {
        // get preSignedURL
        const presignedResponse = await fetch(`/api/preSignedUrl?fileName=${image?.name}`);
        const data = (await presignedResponse.json()) as { url: string };

        // Upload image to S3 bucket
        const s3Response = await fetch(data.url, {
          method: 'PUT',
          headers: {
            'Content-Type': image.type,
          },
          body: image,
        });
        console.log(s3Response);

        if (!s3Response.ok) {
          setLoading(false);
          toast.error('Failed to upload image. Please try again.');
          return;
        }

        if (s3Response.ok) {
          imageAddress = data.url.split('?')[0];
        }
      }

      // Update profile data
      const res = await fetch(`/api/profile/${user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageAddress,
          name,
          email,
        } satisfies ProfileObject),
      });

      if (!res.ok) {
        setLoading(false);
        toast.error('Error updating server. Please try again!');
      }

      if (res.ok) {
        router.refresh();
        toast.success('Profile updated successfully!');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error('Server Error! Please try again');
    }
  };

  useEffect(() => {
    setImageError(false);
    if (image && image.type.startsWith('image/')) {
      setImageURL(URL.createObjectURL(image));

      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const { width, height } = img;
          console.log({ width, height });

          if (width > 1024 || height > 1024) {
            toast.error('Image too large. Input smaller image.');
            setImageError(true);
          }
        };
      };
    }
  }, [image]);

  return (
    <form className="mt-10" onSubmit={handleSubmit}>
      <div className="px-10 pb-10 flex flex-col gap-6">
        <div className="flex items-center bg-secondary px-5 gap-4 rounded-lg">
          <p className={cn('text-muted-foreground text-base w-60 font-normal', imageError && 'text-destructive')}>
            Profile picture
          </p>
          <div className="flex items-center gap-6">
            <Label htmlFor="image" className=" cursor-pointer bg-primary/10 aspect-square rounded-lg h-48 my-1">
              {imageURL ? (
                <img
                  className={cn(
                    'rounded-lg object-contain aspect-square h-48 w-auto',
                    imageError && 'border border-destructive',
                  )}
                  alt="profile image preview"
                  src={imageURL}
                />
              ) : (
                <div className="flex flex-col gap-2  items-center justify-center h-full w-full rounded-lg">
                  <IoImageOutline className="w-10 h-10 text-primary" />
                  <p className="text-center font-extralight text-primary">+ Upload Image</p>
                </div>
              )}
              <Input
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setImage(e.target.files[0]);
                  }
                }}
                id="image"
                name="image"
                className="hidden"
                type="file"
              />
            </Label>

            <p className={cn('text-sm text-muted-foreground lg:whitespace-nowrap', imageError && 'text-destructive')}>
              Image must be below 1024x1024px. Use PNG or JPG format.
            </p>
          </div>
        </div>
        <div className="p-5 bg-secondary rounded-lg flex flex-col gap-3">
          <fieldset className="flex gap-4 items-center">
            <Label className="w-60 shrink-0 text-muted-foreground font-normal" htmlFor="name">
              Full Name
            </Label>{' '}
            <Input
              className="bg-background"
              value={name}
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
            />
          </fieldset>
          {/* <fieldset className="flex gap-4 items-center">
                <Label className="w-60 text-muted-foreground font-normal" htmlFor="username">
                  Username
                </Label>{' '}
                <Input className="bg-background" value={userData?.username ?? ''} id="username" name="username" />
              </fieldset> */}
          <fieldset className="flex gap-4 items-center">
            <Label className="w-60 shrink-0 text-muted-foreground font-normal" htmlFor="email">
              Email
            </Label>{' '}
            <Input
              className="bg-background"
              value={email}
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </fieldset>
        </div>
      </div>
      <div className="border-t py-6 px-10 flex justify-end">
        <Button disabled={loading} className="px-6 h-10" type="submit">
          {loading && <LuLoader2 className="animate-spin mr-2" />} Save
        </Button>
      </div>
    </form>
  );
}
