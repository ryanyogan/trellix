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
    <div className="h-full flex flex-col items-center pt-20 px-10 bg-slate-900">
      <div className="space-y-4 max-w-md text-lg text-slate-300">
        <p className="text-gray-100 text-xl">
          Do you have bad fucking ADHD and hate all project management software
          overtime?
        </p>
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
          Log In
        </Link>
      </div>
    </div>
  );
}
