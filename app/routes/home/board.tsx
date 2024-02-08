import { Link, useFetcher } from "@remix-run/react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function Board({
  name,
  color,
  id,
  itemCount,
  shareable,
}: {
  name: string;
  id: number;
  color: string;
  itemCount: number;
  shareable?: boolean | null;
}) {
  let fetcher = useFetcher();
  let isDeleting = fetcher.state !== "idle";

  return isDeleting ? null : (
    <Link
      to={`/board/${id}`}
      className="w-full h-28 sm:h-40 p-4 block rounded-sm border-l-2 border-slate-700/50 border shadow hover:shadow-xl bg-slate-800/50 relative hover:bg-slate-800/80"
      style={{ borderLeftColor: color }}
    >
      <div className="font-semibold text-ellipsis text-blue-400">{name}</div>

      <div className="absolute bottom-2">
        <div className="text-slate-600 text-xs sm:text-sm">
          <span className="text-blue-500">{itemCount}</span> Items
        </div>
      </div>

      {shareable ? (
        <div className="absolute bottom-2 right-2">
          <div className="text-green-300 text-xs">Sharing</div>
        </div>
      ) : null}

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
                <input type="hidden" name="boardId" value={id} />
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
    </Link>
  );
}
