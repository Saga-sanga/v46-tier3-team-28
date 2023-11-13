import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { db } from '@/db';

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
