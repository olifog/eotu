import { selector } from "recoil";
import { DreamInterface, gameStateAtom } from "./GameState";
import { guardRecoilDefaultValue } from "@/lib/utils";

export const dreamInterfaceSelector = selector<DreamInterface>({
  key: "dreamInterfaceSelector",
  get: ({ get }) => {
    return get(gameStateAtom).dreamInterface;
  },
  set: ({ set }, newValue) => {
    set(gameStateAtom, (oldState) => {
      if (guardRecoilDefaultValue(newValue)) return oldState;
      return {
        ...oldState,
        dreamInterface: newValue,
      };
    });
  },
});

