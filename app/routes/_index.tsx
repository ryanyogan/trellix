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
    <div className="h-full flex flex-col items-center pt-40 px-10 bg-slate-900">
      <div className="space-y-6 max-w-lg text-lg text-slate-500">
        <h1 className="text-center text-indigo-500 text-5xl">Hi, 👋</h1>
        <h4 className="text-indigo-400 font-medium text-2xl text-center">
          Sick of <span className="italic text-orange-400">organization</span>{" "}
          tools that give you <span className="text-blue-400">anxiety?</span>
        </h4>
        <p className="text-green-300 text-center text-muted-foreground text-lg">
          Come on in, the water's fine <span className="text-pink-400">:)</span>
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 w-full justify-evenly max-w-md rounded-3xl p-10">
        <Link
          to="/signup"
          className="text-2xl font-medium text-indigo-400 underline underline-offset-2"
        >
          Sign up
        </Link>
        <Link
          to="/login"
          className="text-2xl font-medium text-indigo-400 underline underline-offset-2"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
