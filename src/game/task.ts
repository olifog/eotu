
import { selector } from "recoil";
import { gameStateAtom, Task } from "./GameState";
import { guardRecoilDefaultValue } from "@/lib/utils";

export const taskSelector = selector<Task | undefined>({
  key: "taskSelector",
  get: ({ get }) => {
    return get(gameStateAtom).task;
  },
  set: ({ set }, newValue) => {
    set(gameStateAtom, (oldState) => {
      if (guardRecoilDefaultValue(newValue)) return oldState;
      return {
        ...oldState,
        task: newValue,
      };
    });
  },
});


