import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { CompleteChoreModal } from "~/components/complete-chore-modal";
import { Separator } from "~/components/ui/separator";
import { ChoreItem } from "./chore-item";
import { NewChore } from "./new-chore";
import { loader } from "./route";

export function ChoreList() {
  const { chores } = useLoaderData<typeof loader>();
  const [choreId, setChoreId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (choreId) {
      setModalOpen(true);
    }
  }, [choreId]);

  const completedChores = chores.filter((chore) => chore.complete);
  const todaysChores = chores.filter((chore) => !chore.complete);

  return (
    <div className="p-6 space-y-8">
      <div>
        <div className="flex flex-row items-end justify-between w-full">
          <h1 className="text-blue-400">Today</h1>
          <h1 className="text-slate-600 text-sm">
            {format(new Date(), "MMM, d yyyy")}
          </h1>
        </div>
        <Separator className="bg-slate-700/50 mt-2 mb-8" />
        <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {todaysChores.map((chore) => (
            <ChoreItem
              setChoreId={setChoreId}
              key={chore.id}
              description={chore.description}
              name={chore.title}
              id={chore.id}
              complete={chore.complete}
              color={chore.color}
              dueDate={chore?.dueDate}
            />
          ))}
        </nav>
      </div>

      <div>
        <h1 className="text-blue-400 ">Completed Chores</h1>
        <Separator className="bg-slate-700/50 mt-2 mb-8" />
        <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {completedChores.map((chore) => (
            <ChoreItem
              setChoreId={setChoreId}
              key={chore.id}
              description={chore.description}
              name={chore.title}
              id={chore.id}
              complete={chore.complete}
              color={chore.color}
            />
          ))}
        </nav>
      </div>

      <div>
        <h1 className="text-blue-400 ">All Chores</h1>
        <Separator className="bg-slate-700/50 mt-2 mb-8" />
      </div>
      <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <NewChore />
      </nav>

      <CompleteChoreModal
        choreId={choreId!}
        isOpen={modalOpen}
        setClose={() => {
          setModalOpen(false);
          setChoreId(null);
        }}
      />
    </div>
  );
}
