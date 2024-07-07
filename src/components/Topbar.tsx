import { playingAtom } from "@/atoms/playing";
import { moneySelector, nirvanaSelector, timeSelector } from "@/game/resources";
import { useRecoilTick } from "@/game/tick";
import { formatMoney } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { PlayCircle, PauseCircle } from "lucide-react";
import { Switch } from "./Switch";
import { dreamInterfaceSelector } from "@/game/dreamInterface";

export const Topbar = () => {
  const money = useRecoilValue(moneySelector);
  const time = useRecoilValue(timeSelector);
  const nirvana = useRecoilValue(nirvanaSelector);
  const dreamInterface = useRecoilValue(dreamInterfaceSelector);

  const [playing, setPlaying] = useRecoilState(playingAtom);
  const [hibernating, setHibernating] = useState(false);

  const tick = useRecoilTick();

  const [formattedMoney, shortUnit, longUnit] = formatMoney(money || 0);

  const [formattedUpkeep, shortUpkeep, longUpkeep] = formatMoney(dreamInterface.upkeep)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (playing) {
      interval = setInterval(() => {
        tick();
        if (!hibernating) {
          setPlaying(false);
        }
      }, dreamInterface.hibernationTime);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playing, tick, hibernating, setPlaying, dreamInterface.hibernationTime]);

  const togglePlaying = () => {
    setPlaying(!playing);
  };

  const toggleHibernating = () => {
    setHibernating(!hibernating);
  };

  return (
    <header className="flex flex-col items-center w-full">
      <div className="flex w-full h-16 items-center justify-between px-12">
        <div className="flex items-center">
          <Image src="/TitanIcon.svg" alt="Logo" width={64} height={64} />
        </div>
        <div className="flex items-center space-x-6">
          {money !== undefined && (
            <div className="group ml-4 text-xl relative">
              {formattedMoney}
              <span className="pl-1 text-gray-500">{shortUnit}</span>
              <span className="pl-1 w-24 mt-4 text-center text-gray-500 text-xs absolute transition-opacity group-hover:opacity-100 opacity-0 -translate-x-1/2 translate-y-full left-1/2">
                {longUnit}
              </span>
            </div>
          )}
          <div className="group ml-4 text-xl relative">
            {nirvana.toLocaleString()}
            <span className="pl-1 text-gray-500">Nirvana</span>
            <span className="pl-1 w-32 mt-4 text-gray-500 text-xs text-center absolute transition-opacity group-hover:opacity-100 opacity-0 -translate-x-1/2 translate-y-full left-1/2">
              Proximity to God
            </span>
          </div>
          <div className="group ml-4 text-xl relative">
            {time.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            <span className="pl-2 text-gray-500">MET</span>
            <span className="pl-2 w-32 mt-4 text-gray-500 text-xs absolute transition-opacity group-hover:opacity-100 opacity-0 -translate-x-1/2 translate-y-full left-1/2">
              Myriad Epoch Time
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-12 flex justify-end px-12 items-center">
        <button
          onClick={togglePlaying}
          className="flex items-center justify-start w-24 "
        >
          {playing ? (
            <>
              <PauseCircle className="mr-2" size={24} />
              Wake
            </>
          ) : (
            <>
              <PlayCircle className="mr-2" size={24} />
              Dream
            </>
          )}
        </button>
        {dreamInterface.hibernationUnlocked && (
          <div className="flex items-center">
            <Switch checked={hibernating} onCheckedChange={toggleHibernating} />
            <span className="ml-2 mr-4">Hibernate</span>
          </div>
        )}
        <div className="relative">
          -{formattedUpkeep} <span className="text-gray-500">{shortUpkeep}</span> +{dreamInterface.yield} <span className="text-gray-500">Nirvana</span>
          <div className="absolute text-xs text-gray-600">(+generators)</div>
        </div>
      </div>
    </header>
  );
};
