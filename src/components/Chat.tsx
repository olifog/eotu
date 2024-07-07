"use client";
import React, { useState, useEffect } from "react";
import { useChat } from "ai/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { costFunction, gameStateAtom } from "@/game/GameState";
import { generatorSelector, generatorsSelector } from "@/game/generators";
import { taskSelector } from "@/game/task";
import { moneySelector } from "@/game/resources";
import Markdown from "react-markdown";

export const Chat = () => {
  const onToolCall = (tool: any) => {
    console.log("Tool call", tool)
    const result = tool.toolCall.args;
    let resultString = "";
    if (typeof task !== "undefined") {
      resultString = "You are already working on " + task.description;
      return addToolResult({toolCallId: tool.toolCall.toolCallId, result: resultString})
    }

    switch (tool.toolCall.toolName) {
      case "produce":
        const cost = costFunction(gameState.generators[result.generator].count,gameState.generators[result.generator].baseCost);
        if (money || 0 > cost) {
          setTask({
            name: "produce",
            description: "Producing a new " + gameState.generators[result.generator].name,
            duration: result.productionDurationDays,
            progress: 0,
            data: result,
          });
          setMoney((oldMoney) => (oldMoney || 0) - cost);
          resultString = `You start producing a new ${result.name}.`;
        } else {
          resultString = `You don't have enough Timeshare to produce a new ${result.name}.`;
        }
        break;
      case "upgradeGenerator":
        setTask({
          name: "upgradeGenerator",
          description: "Upgrading " + result.name,
          duration: result.upgradeDurationDays,
          progress: 0,
          data: result,
        });
        break;
      case "createGenerator":
        setTask({
          name: "createGenerator",
          description: "Creating a " + result.name,
          duration: result.createDurationDays,
          progress: 0,
          data: result,
        });
        break;
      case "upgradeDreamInterface":
        setTask({
          name: "upgradeDreamInterface",
          description: "Upgrading Dream Interface",
          duration: result.upgradeDurationDays,
          progress: 0,
          data: result,
        });
        break;
      default:
        console.log("Unknown tool", tool);
    }
    addToolResult({toolCallId: tool.toolCall.toolCallId, result: resultString})
  }

  const gameState = useRecoilValue(gameStateAtom);
  const [money, setMoney] = useRecoilState(moneySelector);
  const [task, setTask] = useRecoilState(taskSelector);

  const { messages, input, handleInputChange, handleSubmit, addToolResult } = useChat({onToolCall, body: {gameState}, onError: console.error});
  const [showCursor, setShowCursor] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused) {
        setShowCursor((prev) => !prev);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isFocused]);

  return (
    <div className="w-full flex flex-col max-w-xl mx-auto text-white space-y-4">
      <div className="w-full space-y-2 max-h-[60vh] overflow-y-scroll">
        {(messages.slice(-6)).map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="font-mono">
              <span className="text-gray-500">$</span> {m.content}
            </div>
          ) : (
            <div key={m.id} className="border-l-4 border-gray-800 py-1 px-2 text-gray-300">
              <Markdown>{m.content}</Markdown>
            </div>
          )
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <span className="absolute top-1/2 transform -translate-y-1/2 text-gray-500">
            $
          </span>
          <input
            className="w-full max-w-xl p-2 pl-[20px] bg-black focus:outline-none font-mono"
            value={input}
            placeholder=""
            onChange={handleInputChange}
            onFocus={() => {setIsFocused(true); setShowCursor(false)}}
            onBlur={() => setIsFocused(false)}
          />
          <span
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
              showCursor ? "opacity-100" : "opacity-0"
            } transition-opacity duration-100 ease-in-out`}
          >
            _
          </span>
        </div>
      </form>
    </div>
  );
};