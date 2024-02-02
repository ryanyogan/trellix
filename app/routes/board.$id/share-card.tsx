interface CardProps {
  title: string;
  content: string | null;
}

export function ShareCard({ title, content }: CardProps) {
  return (
    <li
      className={
        "border-t-2 border-b-2 -mb-[2px] last:mb-0 cursor-grab active:cursor-grabbing px-2 py-1"
      }
    >
      <div
        draggable
        className="bg-white shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 relative"
      >
        <h3 className="break-words mr-14">{title}</h3>
        <div className="mt-2">{content || <>&nbsp;</>}</div>
      </div>
    </li>
  );
}
