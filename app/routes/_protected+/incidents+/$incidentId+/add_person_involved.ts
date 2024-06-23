import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { personInvolvedSchema } from "~/form-schemas";
import * as zod from "zod";
import { errSession } from "~/flash.session";
import { createSupabaseServerClient } from "~/supabase.server";

type FormData = zod.infer<typeof personInvolvedSchema>;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const { supabaseClient } = createSupabaseServerClient(request);
  const session = await errSession.getSession(request.headers.get("Cookie"));

  const finalData = {
    ...data,
    incident_id: Number(data.incident_id),
    person_dept: Number(data.person_dept),
    intent: data.intent,
    person_id: data.person_id, // Only to enable deletion of person
  };

  const { intent, person_id, ...rest } = finalData;

  switch (intent) {
    case "add_person":
      const validation = personInvolvedSchema.safeParse(rest);

      if (!validation.success) {
        session.flash("error", "Enter details again");
        // If validation fails, return a JSON response with the errors
        // return json({ errors: validation.error.flatten() }, { status: 400 });
        return redirect(`/incidents/${data.incident_id}`, {
          headers: {
            "Set-Cookie": await errSession.commitSession(session),
          },
        });
      }

      const parsedData: FormData = validation.data;

      const { error } = await supabaseClient
        .from("people_involved")
        .insert({ ...parsedData });

      if (error) {
        session.flash("error", "Failed to Add Person");
        return redirect(`/incidents/${parsedData.incident_id}`, {
          headers: {
            "Set-Cookie": await errSession.commitSession(session),
          },
        });
      }

      session.flash("success", "Added Person Successfully");
      return redirect(`/incidents/${parsedData.incident_id}/people_involved`, {
        headers: {
          "Set-Cookie": await errSession.commitSession(session),
        },
      });

    case "delete_person":
      const { error: deleteError } = await supabaseClient
        .from("people_involved")
        .delete()
        .eq("id", person_id);
      if (deleteError) {
        console.log({ deleteError });

        session.flash("error", "Failed to Delete Person");
        return redirect(`/incidents/${data.incident_id}/people_involved`, {
          headers: {
            "Set-Cookie": await errSession.commitSession(session),
          },
        });
      }
      session.flash("success", "Deleted Person Successfully");
      return redirect(`/incidents/${data.incident_id}/people_involved`, {
        headers: {
          "Set-Cookie": await errSession.commitSession(session),
        },
      });
    default:
      return redirect(`/incidents/${data.incident_id}/people_involved`);
  }
};
