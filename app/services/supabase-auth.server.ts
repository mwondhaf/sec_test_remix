import { createCookieSessionStorage } from "@remix-run/node";
import { createClient } from "@supabase/supabase-js";
import { name as appName } from "../../package.json";

if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL is required");
}

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_ANON_KEY is required");
}

const supabaseOptions = {
  db: {
    schema: "public",
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: { "x-application-name": appName },
  },
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabaseClient = createClient(
  supabaseUrl,
  supabaseKey,
  supabaseOptions
);

type SessionData = {
  auth: {
    access_token: string;
    refresh_token: string;
  };
};

export const authCookie = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "auth_session",
    expires: new Date(Date.now() + 3600),
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    secrets: ["aStrongSecret"], //TODO get from env
    secure: process.env.NODE_ENV === "production",
  },
});
