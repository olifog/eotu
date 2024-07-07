import { guardRecoilDefaultValue } from "@/lib/utils";
import { selector } from "recoil";
import { gameStateAtom } from "./GameState";

export const moneySelector = selector<number | undefined>({
  key: "moneySelector",
  get: ({ get }) => {
    return get(gameStateAtom).resources.money;
  },
  set: ({ set }, newValue) => {
    set(gameStateAtom, (oldState) => {
      if (guardRecoilDefaultValue(newValue)) return oldState;
      return {
        ...oldState,
        resources: {
          ...oldState.resources,
          money: newValue,
        },
      };
    });
  },
});

export const timeSelector = selector<Date>({
  key: "timeSelector",
  get: ({ get }) => {
    return get(gameStateAtom).time;
  },
  set: ({ set }, newValue) => {
    set(gameStateAtom, (oldState) => {
      if (guardRecoilDefaultValue(newValue)) return oldState;
      return {
        ...oldState,
        time: newValue,
      };
    });
  },
});

export const nirvanaSelector = selector<number>({
  key: "nirvanaSelector",
  get: ({ get }) => {
    return get(gameStateAtom).resources.nirvana;
  },
  set: ({ set }, newValue) => {
    set(gameStateAtom, (oldState) => {
      if (guardRecoilDefaultValue(newValue)) return oldState;
      return {
        ...oldState,
        resources: {
          ...oldState.resources,
          nirvana: newValue,
        },
      };
    });
  },
});
