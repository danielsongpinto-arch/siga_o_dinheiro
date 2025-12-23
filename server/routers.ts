import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getUserBookmarks, upsertBookmark, deleteBookmark, syncBookmarks } from "./bookmarks";
import { getUserSettings, saveUserSettings } from "./settings";

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

  settings: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await getUserSettings(ctx.user.id);
    }),
    sync: protectedProcedure
      .input(
        z.object({
          settings: z.object({
            themePreference: z.enum(["light", "dark", "auto"]).optional(),
            fontSize: z.enum(["xs", "sm", "md", "lg", "xl"]).optional(),
            lineSpacing: z.enum(["compact", "normal", "expanded"]).optional(),
            readingRemindersEnabled: z.boolean().optional(),
            readingReminderTime: z.string().optional(),
            readingReminderDays: z.array(z.number()).optional(),
            readingGoalType: z.enum(["weekly", "monthly"]).optional(),
            readingGoalTarget: z.number().optional(),
            nightModeEnabled: z.boolean().optional(),
            updatedAt: z.number().optional(),
          }),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        await saveUserSettings(ctx.user.id, input.settings);
        return { success: true };
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
