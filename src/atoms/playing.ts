
import { atom } from "recoil";

export type Playing = boolean

export const playingAtom = atom<Playing>({
  key: "playing",
  default: false
});

