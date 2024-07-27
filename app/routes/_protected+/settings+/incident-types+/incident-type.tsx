import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";
import localforage from "localforage";
import { supabaseClient } from "~/services/supabase-auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  // const { supabaseClient } = createSupabaseServerClient(request);
  const formData = await request.formData();
  const action = String(formData.get("_action"));
  const name = String(formData.get("name"));
  const incident_type_id = String(formData.get("inc_id"));

  switch (action) {
    case "delete_type":
      await supabaseClient
        .from("incident-types")
        .delete()
        .eq("id", incident_type_id);
      return redirect("/settings/incident-types");

    default:
      const { error } = await supabaseClient
        .from("incident-types")
        .insert({ name });

      if (!error) {
        return redirect("/settings/incident-types");
      }
  }

  return redirect("/settings/incident-types");
};
