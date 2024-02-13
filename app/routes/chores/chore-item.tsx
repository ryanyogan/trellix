import { useFetcher } from "@remix-run/react";
import { differenceInDays, parseISO } from "date-fns";
import { CheckCircle, ChevronDown, Clock } from "lucide-react";
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
  dueDate,
  emoji,
}: {
  name: string;
  id: string;
  emoji?: string;
  description: string;
  color: string;
  setChoreId: (choreId: string) => void;
  complete: boolean;
  dueDate?: string | null;
}) {
  const fetcher = useFetcher();

  function daysRemaining(date: string) {
    const givenDate = parseISO(date);
    const currentDate = new Date();
    return differenceInDays(givenDate, currentDate);
  }

  const clockColor =
    dueDate && daysRemaining(dueDate) < 0
      ? "text-red-400"
      : dueDate && daysRemaining(dueDate) < 1
        ? "text-orange-400"
        : "text-blue-400";

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

      <div className="absolute bottom-2 right-2">
        {complete ? (
          <CheckCircle className="text-green-400 w-6 h-6 sm:h-10 sm:w-10" />
        ) : (
          <Clock className={cn("w-6 h-6 sm:h-10 sm:w-10", clockColor)} />
        )}
      </div>

      <div className="absolute bottom-2 left-4">{emoji}</div>

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
