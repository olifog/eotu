import { trpc } from "@/lib/trpc";
import { Generators } from "./Generators";
import { Topbar } from "./Topbar";
import { Chat } from "./Chat";
import { Task } from "./Task";
import BackgroundAudio from "./BackgroundAudio";
import { useState } from "react";

export const MainPage = () => {

  const [modalOpen, setModalOpen] = useState(true)

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-between space-y-2 pb-16 bg-black text-white">
      {modalOpen && (
        <div className="w-screen h-screen absolute z-40 text-white" onClick={() => setModalOpen(false)}>
          <div className="absolute py-8 max-w-screen-sm w-full z-50 bg-gray-900 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col px-4">
            <h2 className="text-xl w-full text-center">Welcome to the End of the Universe!</h2>
            <p className="text-sm pt-6">
              This is a browser-based roleplaying game set at the dusk of time. Manage your resources to achieve the highest Nirvana you can.
              <br />
              <br />
              To progress time, you must Dream using your Dream Interface (using the Dream button at the top!)
              <br />
              Your assistant will provide the rest of the information you need - though watch out, you&apos;re currently losing Timeshare.
              <br />
              <br />
              As a first goal, work towards upgrading your Dream Interface to enable hibernation. Perhaps unyielding sleep is the solution you seek...
            </p>
            <span className="pt-16 w-full text-center text-xs text-gray-400">(click to start)</span>
          </div>
          <div className="w-screen h-screen opacity-50 bg-black absolute"></div>
        </div>
      )}
      <BackgroundAudio audioSrc="/oscargoat.mp3" />
      <div className="w-full flex-shrink-0">
        <Topbar />
        <Generators />
        <Task />
      </div>
      <div className="flex-grow w-full overflow-hidden">
        <Chat />
      </div>
    </main>
  );
}
