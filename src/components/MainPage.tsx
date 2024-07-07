import { trpc } from "@/lib/trpc";
import { Generators } from "./Generators";
import { Topbar } from "./Topbar";
import { Chat } from "./Chat";

export const MainPage = () => {

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-between space-y-2 pb-16 bg-black text-white">
      <div className="w-full">
        <Topbar />
        <Generators />
      </div>
      <Chat />
    </main>
  );
}
