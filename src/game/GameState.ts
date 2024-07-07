
import { atom } from "recoil";

export type Generator = {
  name: string;
  description: string;
  production: number;
  count: number;
  cost: number;
};

export type DreamInterface = {
  upkeep: number;
  yield: number;
  hibernationUnlocked: boolean;
  description: string;
  hibernationTime: number;
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
      money: 7,
      nirvana: 0,
    },
    time: new Date(4302, 3, 13),
    generators: [
      {
        name: "Vending Unit",
        description: "Selling pills by the dozen.",
        production: 0.5,
        count: 1,
        cost: 1,
      },
    ],
    dreamInterface: {
      upkeep: 1,
      yield: 0.1,
      hibernationUnlocked: false,
      description: "A simple HCI into the dopamine machine's respite.",
      hibernationTime: 1000,
    }
  },
});

