import { Form } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { INTENTS } from "../board.$id/types";
import { ChoreList } from "./chore-list";

export default function Chores() {
  return (
    <div className="h-full flex flex-col">
      <ChoreList />

      <div className="fixed bottom-0 left-2 right-2 bg-slate-800/50 border-slate-700 border rounded-tr-lg rounded-tl-lg">
        <Drawer>
          <DrawerTrigger asChild>
            <div className="flex flex-row items-center justify-center">
              <Button variant="link" className="text-slate-500">
                Create New Category
              </Button>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <Form method="post">
              <input
                type="hidden"
                name="intent"
                value={INTENTS.createChoreType}
              />
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Create Category</DrawerTitle>
                  <DrawerDescription>
                    Chore categories allow you to group chores by similiar
                    function or expected outcome.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input required name="name" />
                  </div>
                </div>
                <DrawerFooter>
                  <Button type="submit">Create</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </Form>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
