// app/sessions.ts
import { Session, createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno
import { Profile } from "types";

type SessionData = {
  profiles: Profile[] | undefined;
  active_profile: Profile | undefined;
};

export const profileSession = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "__profile",
    httpOnly: true,
    maxAge: 86_400,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret1"], //TODO Change this
    secure: false,
  },
});

export const profileSessionData = async (
  request: Request
): Promise<{
  profiles?: Profile[];
  active_profile?: Profile;
  session: Session<SessionData, SessionData>;
}> => {
  const session = await profileSession.getSession(
    request.headers.get("Cookie")
  );

  return {
    profiles: session.get("profiles"),
    active_profile: session.get("active_profile"),
    session,
  };
};
