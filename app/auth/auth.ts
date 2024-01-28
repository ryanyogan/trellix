import { LoaderFunctionArgs, createCookie, redirect } from "@remix-run/node";

let secret = process.env.COOKIE_SECRET || "default-nonsense-for-dev";
if (secret === "default-nonsense-for-dev") {
  console.warn(
    "No COOKIE_SECRET env var set, using default for dev.. DO NOT DO THIS IN PRODUCTION!!!!",
  );
}

let cookie = createCookie("auth", {
  secrets: [secret],
  maxAge: 30 * 24 * 60 * 60, // 30 days
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});

export async function getAuthFromRequest(
  request: Request,
): Promise<string | null> {
  let userId = await cookie.parse(request.headers.get("Cookie"));
  return userId ?? null;
}

export async function setAuthOnResponse(
  response: Response,
  userId: string,
): Promise<Response> {
  let header = await cookie.serialize(userId);
  response.headers.append("Set-Cookie", header);
  return response;
}

export async function requireAuthCookie(request: Request) {
  let userId = await getAuthFromRequest(request);
  if (!userId) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await cookie.serialize("", {
          maxAge: 0,
        }),
      },
    });
  }

  return userId;
}

export async function redirectIfLoggedInLoader({
  request,
}: LoaderFunctionArgs) {
  let userId = await getAuthFromRequest(request);
  if (userId) {
    throw redirect("/home");
  }

  return null;
}

export async function redirectWithClearedCookie(): Promise<Response> {
  return redirect("/", {
    headers: {
      "Set-Cookie": await cookie.serialize(null, {
        expires: new Date(0),
      }),
    },
  });
}
