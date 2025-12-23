import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getUserBookmarks, upsertBookmark, deleteBookmark, syncBookmarks } from "./bookmarks";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  bookmarks: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserBookmarks(ctx.user.id);
    }),
    upsert: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          articleId: z.string(),
          articleTitle: z.string(),
          partTitle: z.string(),
          excerpt: z.string(),
          note: z.string().optional(),
          tags: z.array(z.string()).optional(),
          createdAt: z.string().optional(),
          updatedAt: z.string().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        await upsertBookmark({ ...input, userId: ctx.user.id });
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await deleteBookmark(input.id, ctx.user.id);
        return { success: true };
      }),
    sync: protectedProcedure
      .input(
        z.array(
          z.object({
            id: z.string(),
            articleId: z.string(),
            articleTitle: z.string(),
            partTitle: z.string(),
            excerpt: z.string(),
            note: z.string().optional(),
            tags: z.array(z.string()).optional(),
            createdAt: z.string(),
            updatedAt: z.string().optional(),
          }),
        ),
      )
      .mutation(async ({ ctx, input }) => {
        const bookmarksWithUserId = input.map((b) => ({ ...b, userId: ctx.user.id }));
        return await syncBookmarks(ctx.user.id, bookmarksWithUserId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
