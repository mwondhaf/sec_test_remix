import type { Session } from "@remix-run/node";
import type { User } from "@supabase/supabase-js";
import { Error } from "types";
import { supabaseClient } from "~/services/supabase-auth.server";

type AuthForm = {
  email: string;
  password: string;
};

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

function hasAuthSession(session: Session): boolean {
  try {
    return session.has("access_token");
  } catch {
    return false;
  }
}

// type LoginReturn = {
//   accessToken?: string;
//   refreshToken?: string;
// } & Error;
// export async function loginUser({
//   email,
//   password,
// }: AuthForm): Promise<LoginReturn> {
//   try {
//     const { data: sessionData, error: loginError } =
//       await supabaseClient.auth.signInWithPassword(email, password);

//     if (
//       loginError ||
//       !sessionData ||
//       !sessionData.access_token ||
//       !sessionData.refresh_token
//     ) {
//       return { error: loginError?.message || "Something went wrong" };
//     }

//     return {
//       accessToken: sessionData.access_token,
//       refreshToken: sessionData.refresh_token,
//     };
//   } catch {
//     return { error: "Something went wrong" };
//   }
// }

// type RegisterReturn = {
//   user?: User;
// } & Error;
// export async function registerUser({
//   email,
//   password,
// }: AuthForm): Promise<RegisterReturn> {
//   try {
//     const { user, error: signUpError } = await supabaseClient.signUp({
//       email,
//       password,
//     });

//     if (signUpError || !user) {
//       return { error: signUpError?.message || "Something went wrong" };
//     }

//     return { user };
//   } catch {
//     return {
//       error: "Something went wrong",
//     };
//   }
// }
