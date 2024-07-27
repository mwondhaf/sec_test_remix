import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authCookie } from "~/services/supabase-auth.server";
import { profileSession, profileSessionData } from "~/sessions/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await profileSessionData(request);
  const auth_session = await authCookie.getSession(
    request.headers.get("Cookie")
  );

  const headers = new Headers();
  headers.append("Set-Cookie", await profileSession.destroySession(session));
  headers.append("Set-Cookie", await authCookie.destroySession(auth_session));

  return redirect("/sign-in", {
    headers,
  });
};
