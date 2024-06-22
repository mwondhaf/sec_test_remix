import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { ClientActionFunctionArgs } from "@remix-run/react";
import { profileSession, profileSessionData } from "~/session";
import { createSupabaseServerClient } from "~/supabase.server";
import { clearAllIncidents } from "~/utils/cache/dexie-cache";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabaseClient, headers } = createSupabaseServerClient(request);
  // check if user is logged in

  const { session } = await profileSessionData(request);

  await Promise.all([profileSession.destroySession(session)]);

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) {
    return redirect("/sign-in");
  }
  // sign out
  await supabaseClient.auth.signOut();
  return redirect("/sign-in", {
    headers,
  });
};

// export const clientAction = async ({
//   serverAction,
// }: ClientActionFunctionArgs) => {
//   await clearAllIncidents();

//   const data = await serverAction();
//   return data;
// };
