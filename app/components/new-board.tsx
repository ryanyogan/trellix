import { Label } from "@radix-ui/react-label";
import { useFetcher } from "@remix-run/react";
import { Plus } from "lucide-react";
import { Input } from "./input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function NewBoard() {
  const fetcher = useFetcher();
  const isCreating = fetcher.state !== "idle";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">
          <Plus className="h-4 w-4 text-slate-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Board</DialogTitle>
          <DialogDescription className="text-md">
            Create a new board here. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <fetcher.Form method="post" action="/home">
          <input type="hidden" name="intent" value="createBoard" />
          <div>
            <Label htmlFor="name">Board Name</Label>

            <Input
              name="name"
              type="text"
              autoCapitalize="true"
              className="text-[16px] sm:text-base"
              required
            />
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex flex-col items-start gap-1">
              <Label htmlFor="color">Board Color</Label>
              <input
                id="board-color"
                name="color"
                type="color"
                defaultValue="#eaeaea"
                className="bg-transparent"
              />
            </div>
          </div>
          <div className="text-right">
            <Button type="submit">
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
