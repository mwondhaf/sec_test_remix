// app/sessions.ts
import { Session, createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno
import { Profile } from "types";

type SessionData = {
  profile: Profile;
};

export const userSession = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "__profile",
    httpOnly: true,
    maxAge: 60_4800,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret1"],
    secure: true,
  },
});

export const profileSessionData = async (
  request: Request
): Promise<{
  profile?: Profile;
  session: Session<SessionData, SessionData>;
}> => {
  const session = await userSession.getSession(request.headers.get("Cookie"));

  return {
    profile: session.get("profile"),
    session,
  };
};
