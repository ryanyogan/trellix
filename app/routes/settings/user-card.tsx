import { Kid } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function UserCard({
  kid,
}: {
  kid: Pick<Kid, "name" | "color" | "id" | "emoji">;
}) {
  let fetcher = useFetcher();
  let isDeleting = fetcher.state !== "idle";

  return isDeleting ? null : (
    <div
      style={{ borderLeftColor: kid.color }}
      className="w-full h-28 sm:h-40 p-4 block rounded-sm border-l-2 border-slate-700/50 border shadow hover:shadow-xl bg-slate-800/50 relative hover:bg-slate-800/80"
    >
      <div className="font-semibold text-ellipsis text-blue-400">
        {kid.name}
      </div>

      <div className="absolute sm:bottom-4 sm:right-4 bottom-2 right-2">
        {kid.emoji ? <span className="h-10 w-10">{kid.emoji}</span> : null}
      </div>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="absolute top-4 right-4"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <fetcher.Form method="post">
                <input type="hidden" name="intent" value="deleteBoard" />
                <input type="hidden" name="boardId" value={kid.id} />
                <button
                  aria-label="Delete board"
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
