
import { atom } from "recoil";

export type Generator = {
  name: string;
  description: string;
  production: number;
  count: number;
  baseCost: number;
};

export type DreamInterface = {
  upkeep: number;
  yield: number;
  hibernationUnlocked: boolean;
  description: string;
};

export type Task = {
  name: string;
  description: string;
  duration: number;
  progress: number;
  data: any;
};

export type GameState = {
  resources: {
    money?: number;
    nirvana: number;
  };
  time: Date;
  generators: Generator[];
  dreamInterface: DreamInterface;
  task?: Task;
};

export const costFunction = (count: number, baseCost: number) => baseCost * Math.pow(1.1, count);

export const gameStateAtom = atom<GameState>({
  key: "gameState",
  default: {
    resources: {
      money: 4,
      nirvana: 0,
    },
    time: new Date(4302, 3, 13),
    generators: [
      {
        name: "Vending Unit",
        description: "Pills by the dozen.",
        production: 1,
        count: 1,
        baseCost: 1,
      },
    ],
    dreamInterface: {
      upkeep: 1,
      yield: 0.1,
      hibernationUnlocked: false,
      description: "A simple HCI into the dopamine machine's respite.",
    }
  },
});

