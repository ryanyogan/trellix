import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { redirectIfLoggedInLoader, setAuthOnResponse } from "~/auth/auth";
import { Label } from "~/components/input";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { createAccount } from "./queries";
import { validate } from "./validate";

export const meta = () => {
  return [{ title: "Trellix Signup" }];
};

export const loader = redirectIfLoggedInLoader;

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();

  let email = String(formData.get("email") || "");
  let password = String(formData.get("password") || "");

  let errors = await validate(email, password);
  if (errors) {
    return json({ ok: false, errors }, 400);
  }

  let user = await createAccount(email, password);
  return setAuthOnResponse(redirect("/home"), user.id);
}

export default function Signup() {
  let actionResult = useActionData<typeof action>();

  return (
    <div className="flex min-h-full flex-1 flex-col mt-20 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2
          id="signup-header"
          className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        >
          Sign up
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <Form className="space-y-6" method="POST">
            <div>
              <Label htmlFor="email">
                Email address{" "}
                {actionResult?.errors?.email && (
                  <span id="email-error" className="text-brand-red">
                    {actionResult.errors.email}
                  </span>
                )}
              </Label>

              <Input
                autoFocus
                id="email"
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
              <Label htmlFor="password">
                Password{" "}
                {actionResult?.errors?.password && (
                  <span id="password-error" className="text-brand-red">
                    {actionResult.errors.password}
                  </span>
                )}
              </Label>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                aria-describedby="password-error"
                required
              />
            </div>

            <Button type="submit">Sign up</Button>

            <div className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Log in
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
