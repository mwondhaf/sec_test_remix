import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import i18nextServer from "~/modules/i18next.server";
import { translateEnToAr } from "~/services/libretranslate.server";
import { supabaseClient } from "~/services/supabase-auth.server";
import { createSupabaseServerClient } from "~/supabase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  let locale = await i18nextServer.getLocale(request);
  let isEnLocale = locale === "en";

  const formData = await request.formData();
  const action = String(formData.get("_action"));
  const name = String(formData.get("name"));
  const name_ar = isEnLocale
    ? await translateEnToAr(String(formData.get("name")))
    : String(formData.get("name_ar"));
  const incident_type_id = String(formData.get("type_id"));
  const cat_id = Number(formData.get("cat_id"));

  switch (action) {
    case "delete_cat":
      await supabaseClient
        .from("incident_categories")
        .delete()
        .eq("id", cat_id);

      return redirect("/settings/incident-types");
    default:
      const { error } = await supabaseClient
        .from("incident_categories")
        .insert({ name, incident_type_id, name_ar });

      if (!error) {
        return redirect("/settings/incident-types");
      }
  }

  return redirect("/settings/incident-types");
};
