import { costFunction } from "@/game/GameState";
import { generatorsSelector } from "@/game/generators";
import { moneySelector } from "@/game/resources";
import { formatMoney } from "@/lib/utils";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

export const Generators = () => {
  const generators = useRecoilValue(generatorsSelector);
  const money = useRecoilValue(moneySelector);

  const transformedGenerators = useMemo(() => {
    return generators.map((gen) => {
      const formattedProduction = formatMoney(gen.production);
      return {
        ...gen,
        formattedProduction,
        formattedTotal: formatMoney(gen.count * gen.production),
        canAfford: (money || 0) >= costFunction(gen.count, gen.baseCost)
      };
    });
  }, [generators, money]);

  return (
    <div className="flex flex-wrap w-full px-16">
      {transformedGenerators.map((gen, i) => (
        <div key={i} className={"flex flex-col items-center w-48 p-4 border-white border-2 " + (gen.canAfford ? "bg-gray-700" : "")}>
          <div className="text-lg">{gen.name}</div>
          <div className="text-sm">
            {gen.count.toLocaleString()} x {gen.formattedProduction[0]} {gen.formattedProduction[1]}/day
          </div>
          <div className="text-sm font-bold pt-1">= {gen.formattedTotal[0]} {gen.formattedTotal[1]}/day</div>
        </div>
      ))}
    </div>
  );
}

