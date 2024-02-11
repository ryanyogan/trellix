import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { CheckCircle } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Trellix" },
    { name: "description", content: "Projects for ADHD" },
  ];
};

export default function Index() {
  return (
    <div className="h-full flex flex-col justify-center items-center w-full">
      <div className="sm:w-[400px] w-[300px] cursor-pointer border-l-green-300 h-28 sm:h-40 p-4 block rounded-sm border-l-2 border-slate-700/50 border shadow hover:shadow-xl bg-slate-800/50 relative hover:bg-slate-800/80">
        <div className="font-semibold text-ellipsis text-blue-400 hover:underline">
          <Link prefetch="intent" to="/login">
            Welcome Back, Login
          </Link>
        </div>
        <div className="text-slate-500 text-xs sm:text-sm mt-2 text-ellipsis mr-6 sm:mr-0 hover:underline">
          <Link prefetch="intent" to="/signup">
            Don&apos;t have an account? Sign up.
          </Link>
        </div>

        <div className="absolute sm:bottom-4 sm:right-4 bottom-2 right-2">
          <CheckCircle className={"text-green-400 w-6 h-6 sm:h-10 sm:w-10"} />
        </div>
      </div>
    </div>
  );
}
