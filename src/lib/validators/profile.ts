import z from 'zod';

export const profileUpdateSchema = z.object({
  name: z.string(),
  image: z.string(),
});
