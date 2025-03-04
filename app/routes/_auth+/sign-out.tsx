import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { supabaseClient } from "~/services/supabase-auth.server";
import { createSupabaseServerClient } from "~/supabase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  // const { supabaseClient, headers } = createSupabaseServerClient(request);
  // check if user is logged in

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) {
    return redirect("/clear-data");
  }
  // sign out
  await supabaseClient.auth.signOut();
  return redirect("/clear-data");
};
