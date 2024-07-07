import { selector, selectorFamily } from "recoil";
import { gameStateAtom, Generator } from "./GameState";
import { guardRecoilDefaultValue } from "@/lib/utils";

export const generatorsSelector = selector<Generator[]>({
  key: "generatorsSelector",
  get: ({ get }) => {
    return get(gameStateAtom).generators;
  },
  set: ({ set }, newValue) => {
    set(gameStateAtom, (oldState) => {
      if (guardRecoilDefaultValue(newValue)) return oldState;
      return {
        ...oldState,
        generators: newValue,
      };
    });
  },
});

export const totalProductionSelector = selector({
  key: 'totalProductionSelector',
  get: ({get}) => {
    const { generators } = get(gameStateAtom);
    return generators.reduce((total, gen) => total + gen.production * gen.count, 0);
  },
});

export const generatorSelector = selectorFamily<Generator | undefined, number>({
  key: 'generatorSelector',
  get: (index) => ({get}) => {
    const { generators } = get(gameStateAtom);
    return generators[index];
  },
});

