import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Trellix" },
    { name: "description", content: "Projects for ADHD" },
  ];
};

export default function Index() {
  return (
    <div className="h-full flex flex-col items-center pt-20 bg-slate-900">
      <img src="/remix-logo-new@dark.png" width="402" height="149" />
      <div className="space-y-4 max-w-md text-lg text-slate-300">
        <p>
          This is a demo to show off the features of Remix and teach them
          through some fun stuff.
        </p>
        <p>
          It is a basic example of Trello for idiots like me that cannot pay
          attention.
        </p>
        <p>If you want to play around, click to sign up!</p>
      </div>
      <div className="flex w-full justify-evenly max-w-md mt-8 rounded-3xl p-10 bg-slate-800">
        <Link
          to="/signup"
          className="text-xl font-medium text-brand-aqua underline"
        >
          Sign Up
        </Link>

        <div className="h-full border-r border-l-sky-500" />

        <Link
          to="/login"
          className="text-xl font-medium text-brand-aqua underline"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
