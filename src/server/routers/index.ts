import { createTRPCRouter } from '../trpc';
import { dealsRouter } from './deals';

export const appRouter = createTRPCRouter({
  deals: dealsRouter,
});

export type AppRouter = typeof appRouter;
