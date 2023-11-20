import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { db } from '@/db';
import { profileUpdateSchema } from '@/lib/validators/profile';
import { collections, items, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const userRouteContextSchema = z.object({
  params: z.object({ userId: z.string() }),
});

export async function GET(req: Request, context: z.infer<typeof userRouteContextSchema>) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json('Unauthorised', { status: 403 });
    }

    // validate params
    const {
      params: { userId },
    } = userRouteContextSchema.parse(context);

    const user = await db.query.users.findFirst({ where: (user, { eq }) => eq(user.id, userId) });

    return Response.json(user, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(error.issues, { status: 422 });
    }

    return Response.json({ error }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: z.infer<typeof userRouteContextSchema>) {
  try {
    // validate params
    const {
      params: { userId },
    } = userRouteContextSchema.parse(context);

    if (!(await verifyUser(userId))) {
      return Response.json('Unauthorised', { status: 403 });
    }

    const body = await req.json();
    const { name, image } = profileUpdateSchema.parse(body);

    await db.update(users).set({ name, image }).where(eq(users.id, userId));

    return Response.json('Profile Updated', { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    return new Response(null, { status: 500 });
  }
}

export async function DELETE(req: Request, context: z.infer<typeof userRouteContextSchema>) {
  try {
    // validate params
    const {
      params: { userId },
    } = userRouteContextSchema.parse(context);

    if (!(await verifyUser(userId))) {
      return Response.json('Unauthorised', { status: 403 });
    }

    // get all collectionIds related to user and delete the items they contain
    const userCollections = await db.query.collections.findMany({
      where: (collections, { eq }) => eq(collections.userId, userId),
    });

    const promises = userCollections.map((collection) => db.delete(items).where(eq(items.collectionId, collection.id)));
    await Promise.all(promises);

    // delete collections then users
    await db.delete(collections).where(eq(collections.userId, userId));
    await db.delete(users).where(eq(users.id, userId));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    return new Response(null, { status: 500 });
  }
}

async function verifyUser(userId: string) {
  const session = await getServerSession(authOptions);

  if (userId !== session?.user.id || !session) {
    return false;
  }

  return true;
}
