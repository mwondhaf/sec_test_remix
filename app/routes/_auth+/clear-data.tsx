import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { profileSession, profileSessionData } from "~/sessions/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await profileSessionData(request);

  const headers = new Headers();
  headers.append("Set-Cookie", await profileSession.destroySession(session));

  return redirect("/sign-in", {
    headers,
  });
};
