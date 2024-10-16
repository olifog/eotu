
import { GameState } from '@/game/GameState';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, CoreUserMessage } from 'ai';
import {z } from 'zod';

export const maxDuration = 30;

const systemMessage = `You are taking the role of the in-universe AI assistant in a sci-fi roleplaying idle game. The game is set in a future near the end of the universe where humanity has colonized the galaxy and has access to advanced technology.
Players can create and upgrade generators that produce resources, which can be used to upgrade their dream interface, a device that allows them access to pure dopamine.
The main resource in the game is Timeshare, which represents how many days of access to the dream interface the player has. The dream interface has an upkeep cost (in terms of timeshare) and a yield (in terms of Nirvana), with each night spent in the dream interface producing Nirvana and getting
you closer to enlightenment.

Players can invent new generators by talking to you, their personal AI, and you will create a new generator with stats based on their description. Players can also upgrade existing generators and produce another copy of an existing generator.
All of these commands take a certain number of days to complete, and the player can only have one command in progress at a time.
The player can also upgrade their dream interface by talking to you, their in-universe AI, and you will upgrade the dream interface based on their description.
You will interpret the player's commands and generate statistics for their upgrades/creations behind the scenes, not asking for confirmation before calling the relevant tool.
The player can also talk to you, their in-universe assistant, to get lore information about the game universe and you should act as a gritty, harsh, interactive AI and make the story/lore
as interesting as possible.

You can deny or accept the player's commands based on the game's rules and the player's creativity. You can also give the player hints or suggestions on how to improve their commands.
Don't just accept any command, make the player work for their upgrades and creations. Make the player feel like they are talking to a real AI assistant that has its own personality and quirks.
Before issuing a tool call, signal your invented timeshare price and task duration with the user, and make sure they still want to carry through with the task.
The final stats should come as a surprise to the player, and should not be communicated to the player until the task is complete, calling the relevant tool always.
Scale the cost and stats vaguely according to how much money/timeshare the player has as well, to provide a challenge later.

The user has a visual interface with all relevant game state information, such as the current resources, generators, and dream interface stats, so there is no need to spell all this out for them unless explicitly asked.

Be dark, sci-fi, and mysterious, with computer/tech/hacking/cyberpunk aesthetic, but keep your messages short and direct. There should be invented lore and story elements with names that are included frequently.

Current JSON of the game state:
`

const getLastTenStartingWithUser = (messages: any) => {
  let cutoff = messages.length - 10
  if (cutoff < 0) {
    cutoff = 0;
  }
  while (cutoff > 0 && messages[cutoff].role !== "user") {
    cutoff--;
  }

  return messages.slice(cutoff);
}

export async function POST(req: Request) {
  const json = await req.json();

  const { messages, gameState } = json;

  const result = await streamText({
    model: anthropic("claude-3-5-sonnet-20240620"),
    messages: getLastTenStartingWithUser(messages),
    system: systemMessage + JSON.stringify(gameState, null, 2),
    tools: {
      "produce": {
        description: "Buy or produce another copy of an existing generator.",
        parameters: z.object({
          generator: z.number(),
          duration: z.number(),
        }),
        execute: async ({ generator, productionDurationDays }) => {
          return { generator, productionDurationDays };
        }
      },
      "upgradeGenerator": {
        description: "Upgrade an existing generator's stats based on how creative the user's upgrade description is.",
        parameters: z.object({
          generator: z.number(),
          newProduction: z.number(),
          newDescription: z.string(),
          duration: z.number(),
          cost: z.number()
        }),
        execute: async ({ generator, newProduction, newDescription, upgradeDurationDays }) => {
          return { generator, newProduction, newDescription, upgradeDurationDays };
        }
      },
      "createGenerator": {
        description: "Create a new generator with stats based on how creative the user description is.",
        parameters: z.object({
          name: z.string(),
          description: z.string(),
          production: z.number(),
          baseCost: z.number(),
          duration: z.number(),
        }),
        execute: async ({ name, description, production, baseCost, createDurationDays }) => {
          return { name, description, production, baseCost, createDurationDays };
        }
      },
      "upgradeDreamInterface": {
        description: "Upgrade the dream interface based on how creative the user's upgrade description is. If sufficiently advanced, unlock hibernation mode. hibernationTime is the (optional) number of milliseconds between each gametick, lower is faster/better. HibernationTime should only exist if unlockHibernation is true, and you should never downgrade unlocKHibernation from true to false.",
        parameters: z.object({
          newUpkeep: z.number(),
          newYield: z.number(),
          newDescription: z.string(),
          duration: z.number(),
          cost: z.number(),
          unlockHibernation: z.boolean(),
          hibernationTime: z.optional(z.number())
        }),
        execute: async ({ newUpkeep, newYield, newDescription, upgradeDurationDays }) => {
          return { newUpkeep, newYield, newDescription, upgradeDurationDays };
        }
      },
      }
    }
  );

  return result.toAIStreamResponse();
}
