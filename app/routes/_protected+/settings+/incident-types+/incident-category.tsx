import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const formData = await request.formData();
  const action = String(formData.get("_action"));
  const name = String(formData.get("name"));
  const incident_type_id = String(formData.get("type_id"));
  const cat_id = Number(formData.get("cat_id"));

  switch (action) {
    case "delete_cat":
      await supabaseClient
        .from("incident-categories")
        .delete()
        .eq("id", cat_id);

      return redirect("/settings/incident-types");
    default:
      const { error } = await supabaseClient
        .from("incident-categories")
        .insert({ name, incident_type_id });

      if (!error) {
        return redirect("/settings/incident-types");
      }
  }

  return redirect("/settings/incident-types");
};
