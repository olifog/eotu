import { useSetRecoilState } from "recoil";
import { GameState, gameStateAtom } from "./GameState";

export const tick = (gameState: GameState): GameState => {
  let newGameState: GameState = {
    ...gameState,
    time: new Date(gameState.time.getTime() + 24 * 60 * 60 * 1000),
    resources: {
      ...gameState.resources,
      money: gameState.generators.reduce(
        (acc, generator) => acc + generator.production * generator.count,
        gameState.resources.money || 0
      ) - gameState.dreamInterface.upkeep,
      nirvana: gameState.resources.nirvana + gameState.dreamInterface.yield,
    },
    generators: [...gameState.generators],
    dreamInterface: { ...gameState.dreamInterface },
  };

  if (newGameState.task && newGameState.task.progress + 1 >= newGameState.task.duration) {
    switch (newGameState.task.name) {
      case "produce":
        newGameState.generators[newGameState.task.data.generator] = {
          ...newGameState.generators[newGameState.task.data.generator],
          count: newGameState.generators[newGameState.task.data.generator].count + 1,
        };
        break;
      case "upgradeGenerator":
        newGameState.generators[newGameState.task.data.generator] = {
          ...newGameState.generators[newGameState.task.data.generator],
          production: newGameState.task.data.newProduction,
          description: newGameState.task.data.newDescription,
        };
        break;
      case "createGenerator":
        newGameState.generators = [
          ...newGameState.generators,
          {
            name: newGameState.task.data.name,
            description: newGameState.task.data.description,
            production: newGameState.task.data.production,
            count: 1,
            baseCost: newGameState.task.data.baseCost,
          },
        ];
        break;
      case "upgradeDreamInterface":
        newGameState.dreamInterface = {
          ...newGameState.dreamInterface,
          upkeep: newGameState.task.data.newUpkeep,
          yield: newGameState.task.data.newYield,
          hibernationUnlocked: newGameState.task.data.unlockHibernation,
          description: newGameState.task.data.newDescription,
        };
        break;
      default:
        console.log("Unknown task", newGameState.task);
    }
    newGameState.task = undefined;
  } else if (newGameState.task) {
    newGameState.task = {
      ...newGameState.task,
      progress: newGameState.task.progress + 1,
    };
  }
  console.log("Tick", newGameState);
  return newGameState;
}

export const useRecoilTick = () => {
  const setGameState = useSetRecoilState(gameStateAtom);

  return () => {
    setGameState((oldState) => tick(oldState));
  };
}