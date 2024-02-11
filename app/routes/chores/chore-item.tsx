import { useFetcher } from "@remix-run/react";
import { ChevronDown, Clock } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

export function ChoreItem({
  name,
  id,
  description,
  color,
  setChoreId,
  complete = false,
}: {
  name: string;
  id: string;
  description: string;
  color: string;
  setChoreId: (choreId: string) => void;
  complete: boolean;
}) {
  const fetcher = useFetcher();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div
      style={{ borderLeftColor: color }}
      className="w-full cursor-pointer h-28 sm:h-40 p-4 block rounded-sm border-l-2 border-slate-700/50 border shadow hover:shadow-xl bg-slate-800/50 relative hover:bg-slate-800/80"
      onClick={() => setChoreId(id)}
    >
      <div className="font-semibold text-ellipsis text-blue-400">{name}</div>
      <div className="text-slate-500 text-xs sm:text-sm mt-2 text-ellipsis mr-6 sm:mr-0">
        {description}
      </div>

      <div className="absolute sm:bottom-4 sm:right-4 bottom-2 right-2">
        <Clock
          className={cn(
            "text-slate-700 w-6 h-6 sm:h-10 sm:w-10",
            complete && "text-green-400",
          )}
        />
      </div>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="absolute top-2 right-2"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <ChevronDown className="w-4 h-4 text-blue-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <fetcher.Form method="post">
                <input type="hidden" name="intent" value="deleteChore" />
                <input type="hidden" name="choreId" value={id} />
                <button
                  aria-label="Delete Chore"
                  type="submit"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  Delete
                </button>
              </fetcher.Form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
