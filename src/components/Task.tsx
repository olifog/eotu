import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { taskSelector } from '@/game/task';

export const Task = () => {
  const task = useRecoilValue(taskSelector);
  const [showFullProgress, setShowFullProgress] = useState(false);
  const [isVisible, setIsVisible] = useState(!!task);

  useEffect(() => {
    if (task) {
      setIsVisible(true);
      setShowFullProgress(false);
    } else {
      setShowFullProgress(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [task]);

  if (!isVisible) {
    return null;
  }

  const progressPercentage = showFullProgress ? 100 : (task ? (task.progress / task.duration) * 100 : 0);

  return (
    <div className={`w-full flex justify-center items-center px-8 mt-4 transition-opacity duration-300 ${task ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-sm w-full h-8 bg-gray-800 overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      {task && (
        <div className="ml-4 text-xs">{task.description} | {task.progress}/{task.duration} days.</div>
      )}
    </div>
  );
};