// app/sessions.ts
import { Session, createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno
import { Profile, RequestorProfile } from "types";

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

type RequestorData = {
  requestor_profile: RequestorProfile | undefined;
};

export const requestorProfileSession =
  createCookieSessionStorage<RequestorData>({
    cookie: {
      name: "__req_profile",
      httpOnly: true,
      maxAge: 3_600,
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"], //TODO Change this
      secure: false,
    },
  });

export const requestorProfileSessionData = async (
  request: Request
): Promise<{
  requestor_profile?: RequestorProfile;
  session: Session<RequestorData, RequestorData>;
}> => {
  const session = await requestorProfileSession.getSession(
    request.headers.get("Cookie")
  );

  return {
    requestor_profile: session.get("requestor_profile"),
    session,
  };
};
