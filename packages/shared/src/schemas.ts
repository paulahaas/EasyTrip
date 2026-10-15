import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(72),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const addHistorySchema = z.object({
  query: z.string().min(1),
});
export type AddHistoryInput = z.infer<typeof addHistorySchema>;

export const bulkHistorySchema = z.object({
  queries: z.array(z.string().min(1)).max(64),
});
export type BulkHistoryInput = z.infer<typeof bulkHistorySchema>;

export const addWishlistSchema = z.object({
  cca2: z.string().length(2),
  countryName: z.string().min(1),
  continent: z.string().min(1),
});
export type AddWishlistInput = z.infer<typeof addWishlistSchema>;

export const addVisitedSchema = addWishlistSchema;
export type AddVisitedInput = z.infer<typeof addVisitedSchema>;
