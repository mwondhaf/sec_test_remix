import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { errSession } from "~/flash.session";
import { profileSchema } from "~/form-schemas";
import { createSupabaseServerClient } from "~/supabase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await errSession.getSession(request.headers.get("Cookie"));
  const { supabaseClient } = createSupabaseServerClient(request);

  const formData = await request.formData();

  const data = Object.fromEntries(formData);

  const { intent, status, profile_id, ...rest } = data;

  const finalData = {
    ...rest,
    isActive: status ? (status === "ACTIVE" ? true : false) : true,
    entityId: Number(rest.entityId),
  };

  switch (intent) {
    case "add_person":
      const validation = profileSchema.safeParse(finalData);

      if (!validation.success) {
        session.flash("error", "Enter details again");
        return redirect(`/settings/user-profiles`, {
          headers: {
            "Set-Cookie": await errSession.commitSession(session),
          },
        });
      }
      const parsedData = validation.data;
      const { email, entityId, ...rest } = parsedData;

      const { data: exists } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("entityId", entityId)
        .eq("email", email)
        .single();

      if (exists) {
        session.flash("error", "Person already exists in the entity");
        return redirect(`/settings/user-profiles`, {
          headers: {
            "Set-Cookie": await errSession.commitSession(session),
          },
        });
      }

      const { error } = await supabaseClient
        .from("profiles")
        .insert({ email, entityId, ...rest });

      if (error) {
        session.flash("error", error.message);
        return redirect(`/settings/user-profiles`, {
          headers: {
            "Set-Cookie": await errSession.commitSession(session),
          },
        });
      }
      session.flash("success", "Added Person Successfully");

      return redirect(`/settings/user-profiles`, {
        headers: {
          "Set-Cookie": await errSession.commitSession(session),
        },
      });

    case "update_person":
      const validationUpdate = profileSchema.safeParse(finalData);
      if (!validationUpdate.success) {
        session.flash("error", "Failed to update");
        return redirect(`/settings/user-profiles`, {
          headers: {
            "Set-Cookie": await errSession.commitSession(session),
          },
        });
      }
      const parsedDataUpdate = validationUpdate.data;

      const { error: updateError } = await supabaseClient
        .from("profiles")
        .update({ ...parsedDataUpdate })
        .eq("id", profile_id)
        .select()
        .single();

      if (updateError) {
        session.flash("error", updateError.message);
        return redirect(`/settings/user-profiles`, {
          headers: {
            "Set-Cookie": await errSession.commitSession(session),
          },
        });
      }
      session.flash("success", "Updated person successfully");

      return redirect(`/settings/user-profiles`, {
        headers: {
          "Set-Cookie": await errSession.commitSession(session),
        },
      });

    case "delete_person":
      const { error: deleteError } = await supabaseClient
        .from("profiles")
        .delete()
        .eq("id", profile_id);

      if (deleteError) {
        session.flash("error", deleteError.message);
        return redirect(`/settings/user-profiles`, {
          headers: {
            "Set-Cookie": await errSession.commitSession(session),
          },
        });
      }

      session.flash("success", "Deleted person successfully");

      return redirect(`/settings/user-profiles`, {
        headers: {
          "Set-Cookie": await errSession.commitSession(session),
        },
      });

    default:
      // return redirect(`/settings/user-profiles`);
      return {};
  }
};
