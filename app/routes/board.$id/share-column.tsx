import { useRef } from "react";
import { ShareCard } from "./share-card";
import { RenderedItem } from "./types";

interface ColumnProps {
  name: string;
  columnId: string;
  items: RenderedItem[];
}

export function ShareColumn({ name, columnId, items }: ColumnProps) {
  const listRef = useRef<HTMLUListElement>(null);

  return (
    <div
      className={
        "flex-shrink-0 flex flex-col overflow-hidden max-h-full w-80 border-slate-400 rounded-xl shadow-sm shadow-slate-400 bg-slate-100"
      }
    >
      <div className="p-2 relative">
        <h1 className="block rounded-lg text-left border border-transparent py-1 px-2 font-medium text-slate-600">
          {name}
        </h1>
      </div>

      <ul ref={listRef} className="flex-grow overflow-auto">
        {items
          .sort((a, b) => a.order - b.order)
          .map((item, index, items) => (
            <ShareCard
              key={item.id}
              title={item.title}
              content={item.content}
            />
          ))}
      </ul>
    </div>
  );
}
