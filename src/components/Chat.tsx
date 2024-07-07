"use client";
import React, { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { gameStateAtom } from "@/game/GameState";
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

    let cost: number;

    switch (tool.toolCall.toolName) {
      case "produce":
        cost = gameState.generators[result.generator].cost;
        if (money || 0 > cost) {
          setTask({
            name: "produce",
            description: "Producing a new " + gameState.generators[result.generator].name,
            duration: result.duration,
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
        cost = result.cost;
        if (money || 0 > cost) {
          setTask({
            name: "upgradeGenerator",
            description: "Upgrading " + gameState.generators[result.generator].name,
            duration: result.duration,
            progress: 0,
            data: result,
          });
          setMoney((oldMoney) => (oldMoney || 0) - cost);
          resultString = `You start upgrading ${result.name}.`;
        } else {
          resultString = `You don't have enough Timeshare to upgrade ${result.name}.`;
        }
        break;
      case "createGenerator":
        cost = result.baseCost
        if (money || 0 > cost) {
          setTask({
            name: "createGenerator",
            description: "Creating " + result.name,
            duration: result.duration,
            progress: 0,
            data: result,
          });
          setMoney((oldMoney) => (oldMoney || 0) - cost);
          resultString = `You start creating a new ${result.name}.`;
        } else {
          resultString = `You don't have enough Timeshare to create a new ${result.name}.`;
        }
        break;
      case "upgradeDreamInterface":
        cost = result.cost;
        if (money || 0 > cost) {
          setTask({
            name: "upgradeDreamInterface",
            description: "Upgrading Dream Interface",
            duration: result.duration,
            progress: 0,
            data: result,
          });
          setMoney((oldMoney) => (oldMoney || 0) - cost);
          resultString = `You start upgrading the Dream Interface.`;
        } else {
          resultString = `You don't have enough Timeshare to upgrade the Dream Interface.`;
        }
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

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused) {
        setShowCursor((prev) => !prev);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isFocused]);

  return (
    <div className="w-full flex flex-col h-full max-w-xl mx-auto text-white space-y-4">
      <div className="w-full space-y-2 flex-grow overflow-y-auto text-sm">
        {messages.map((m) =>
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
        <div ref={messagesEndRef}></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <span className="absolute top-1/2 transform -translate-y-1/2 text-gray-500">
            $
          </span>
          <input
            className="w-full max-w-xl p-2 pl-[20px] bg-black focus:outline-none font-mono text-sm"
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