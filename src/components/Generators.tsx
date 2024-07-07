import { dreamInterfaceSelector } from "@/game/dreamInterface";
import { costFunction } from "@/game/GameState";
import { generatorsSelector } from "@/game/generators";
import { moneySelector } from "@/game/resources";
import { formatMoney } from "@/lib/utils";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

export const Generators = () => {
  const generators = useRecoilValue(generatorsSelector);
  const money = useRecoilValue(moneySelector);
  const dreamInterface = useRecoilValue(dreamInterfaceSelector)

  const transformedGenerators = useMemo(() => {
    return generators.map((gen) => {
      const formattedProduction = formatMoney(gen.production);
      return {
        ...gen,
        formattedProduction,
        formattedTotal: formatMoney(gen.count * gen.production),
        canAfford: (money || 0) >= costFunction(gen.count, gen.cost),
        formattedCost: formatMoney(gen.cost)
      };
    });
  }, [generators, money]);

  return (
    <div className="flex flex-wrap w-full px-16 gap-3">
      <div className="flex flex-col items-center w-48 p-1 border-white border-2">
        <div className="text-sm font-bold text-center">Dream Interface</div>
        <p className="text-xs">{dreamInterface.description}</p>
      </div>
      {transformedGenerators.map((gen, i) => (
        <div key={i} className={"flex flex-col items-center w-48 p-1 border-white border-2 " + (gen.canAfford ? "bg-gray-700" : "")}>
          <div className="text-sm font-bold text-center">{gen.name}</div>
          <p className="text-xs">{gen.description}</p>
          <div className="text-xs pt-1">
            {gen.count.toLocaleString()} x {gen.formattedProduction[0]} {gen.formattedProduction[1]}/day
          </div>
          <div className="text-xs font-bold">= {gen.formattedTotal[0]} {gen.formattedTotal[1]}/day</div>
          <div className="text-xs pt-1">Production cost: {gen.formattedCost[0]} {gen.formattedCost[1]}</div>
        </div>
      ))}
    </div>
  );
}

