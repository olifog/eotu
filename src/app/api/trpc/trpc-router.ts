import { openai } from "@ai-sdk/openai";
import { initTRPC } from "@trpc/server";
import { streamText } from "ai";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

export const appRouter = t.router({
  ping: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return "hi " + input.text;
    }),
});

export type AppRouter = typeof appRouter;
