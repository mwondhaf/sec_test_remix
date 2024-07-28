import type { Session } from "@remix-run/node";
import type { User } from "@supabase/supabase-js";
import { Error } from "types";
import { supabaseClient } from "~/services/supabase-auth.server";

export async function setSBAuth(session: Session): Promise<void> {
  const userAccessToken = session.get("access_token");
  supabaseClient.auth.setSession(userAccessToken);
}

export function setAuthSession(
  session: Session,
  accessToken: string,
  refreshToken: string
): Session {
  session.set("access_token", accessToken);
  session.set("refresh_token", refreshToken);

  return session;
}
