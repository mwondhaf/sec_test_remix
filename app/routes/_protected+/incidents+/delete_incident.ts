import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { supabaseClient } from "~/services/supabase-auth.server";
import { createSupabaseServerClient } from "~/supabase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  // const { supabaseClient } = createSupabaseServerClient(request);

  const formData = await request.formData();
  const id = formData.get("id");

  const { error } = await supabaseClient
    .from("incidents")
    .delete()
    .eq("id", id);
  if (error) {
    return { error };
  }
  return redirect("/incidents");
};

// export const clientAction = async ({
//   serverAction,
// }: ClientActionFunctionArgs) => {
//   // await clearAllIncidents();

//   const data = await serverAction();
//   return data;
// };
