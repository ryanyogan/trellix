import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { redirectIfLoggedInLoader, setAuthOnResponse } from "~/auth/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createAccount } from "./queries";
import { validate } from "./validate";

export const meta = () => {
  return [{ title: "Signup" }];
};

export const loader = redirectIfLoggedInLoader;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const errors = await validate(email, password);
  if (errors) {
    return json({ ok: false, errors }, 400);
  }

  const user = await createAccount(email, password);
  return setAuthOnResponse(redirect("/home"), user.id);
}

export default function Signup() {
  const actionResult = useActionData<typeof action>();

  return (
    <div className="flex min-h-full flex-1 flex-col pt-20 px-6 bg-slate-900">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-slate-800/50 px-6 py-12 shadow-md sm:px-12 border-slate-700/50 rounded-sm border flex flex-col w-full">
          <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-8">
            <span className="text-5xl">👋</span>
          </div>
          <Form className="space-y-6" method="POST">
            <div>
              <Label className="text-blue-400" htmlFor="email">
                Email address{" "}
                {actionResult?.errors?.email && (
                  <span id="email-error" className="text-brand-red">
                    {actionResult.errors.email}
                  </span>
                )}
              </Label>

              <Input
                id="email"
                className="mt-1 resize-none text-[16px] bg-slate-800 border text-blue-300 border-slate-700 focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm"
                name="email"
                type="email"
                autoComplete="email"
                aria-describedby={
                  actionResult?.errors?.email ? "email-error" : "signup-header"
                }
                required
              />
            </div>

            <div>
              <Label className="text-blue-400" htmlFor="password">
                Password{" "}
                {actionResult?.errors?.password && (
                  <span id="password-error" className="text-orange-400">
                    {actionResult.errors.password}
                  </span>
                )}
              </Label>

              <Input
                className="mt-1 resize-none text-[16px] bg-slate-800 border text-blue-300 border-slate-700 focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                aria-describedby="password-error"
                required
              />
            </div>

            <div className="flex flex-row justify-end">
              <Button
                variant="link"
                className="text-green-400 font-bold px-3 py-1"
                type="submit"
              >
                Sign Up
              </Button>
            </div>

            <div className="text-sm text-slate-500 flex justify-end">
              Already have an account?
              <Link to="/login" className="underline mx-2 text-blue-400">
                Log In
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
