import { NavigationLinks } from "~/components/navigation-links";
import { Boards } from "./boards";

export function Home() {
  return (
    <div className="h-full flex flex-col">
      <NavigationLinks />
      <Boards />
    </div>
  );
}
