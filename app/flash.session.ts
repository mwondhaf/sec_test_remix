// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionFlashData = {
  error: string;
  success: string;
};

export const errSession = createCookieSessionStorage<//   SessionData,
SessionFlashData>({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: "__err_session",

    // all of these are optional
    //   domain: "remix.run",
    // Expires can also be set (although maxAge overrides it when used in combination).
    // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
    //
    // expires: new Date(Date.now() + 60_000),
    //   httpOnly: true,
    maxAge: 60,
    //   path: "/",
    sameSite: "lax",
    secrets: ["s3cret1"], //Todo to be changed
    secure: false,
  },
});

// export { getSession, commitSession, destroySession };
