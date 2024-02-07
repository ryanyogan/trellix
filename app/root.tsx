import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  ShouldRevalidateFunctionArgs,
  redirect,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { captureRemixErrorBoundaryError } from "@sentry/remix";

import { Loader } from "lucide-react";
import { getAuthFromRequest } from "./auth/auth";
import "./styles.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export async function loader({ request, params }: LoaderFunctionArgs) {
  let auth = await getAuthFromRequest(request);
  if (auth && new URL(request.url).pathname === "/") {
    throw redirect("/home");
  }
  return auth;
}

export function shouldRevalidate({ formAction }: ShouldRevalidateFunctionArgs) {
  return formAction && ["/login", "/signup", "logout"].includes(formAction);
}

export const ErrorBoundary = () => {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);
  return <div>Something went wrong</div>;
};

export default function App() {
  let userId = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body className="h-screen bg-slate-900 text-slate-900">
        <div className="h-full flex flex-col min-h-0">
          <div className="bg-slate-900 border-b border-slate-800 flex items-center sticky justify-between py-3 px-6 box-border">
            <Link to="/home" className="block leading-3 w-1/3">
              <div className="text-xl font-semibold tracking-wide text-green-400 flex flex-row items-center gap-x-2">
                🧹 <span className="ml-1">Choring</span>
                {navigation.state !== "idle" ? (
                  <Loader className="w-5 h-5 animate-spin text-blue-300 mt-0.5 transition duration-700" />
                ) : null}
              </div>
            </Link>

            <div className="w-1/3 flex justify-end">
              {userId ? (
                <form method="post" action="/logout">
                  <button className="block text-center">
                    <span className="text-slate-500 text-xs uppercase font-bold">
                      Log out
                    </span>
                  </button>
                </form>
              ) : (
                <Link
                  to="/login"
                  className="text-slate-500 text-xs uppercase font-bold"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>

          <div className="flex-grow min-h-0 h-full bg-slate-900">
            <Outlet />
          </div>
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
