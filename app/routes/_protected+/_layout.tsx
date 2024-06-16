import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, json, redirect, useLoaderData } from "@remix-run/react";
import { Profile } from "types";
import { Sidebar } from "~/components";
import { profileSession, profileSessionData } from "~/session";
import { createSupabaseServerClient } from "~/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, active_profile } = await profileSessionData(request);
  const { supabaseClient } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  if (!active_profile) {
    const { data } = await supabaseClient
      .from("profiles")
      .select(`*, entities(*)`)
      .eq("email", user.email);
    // check if user has an active profile

    if (!data || data?.length === 0) {
      return redirect(`/create-profile?email=${user.email}`);
    }

    if (data.length >= 1) {
      session.set("profiles", data);

      return redirect("/select-profile", {
        headers: {
          "Set-Cookie": await profileSession.commitSession(session),
        },
      });
    }
  }
  return json(
    { user, active_profile },
    {
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );
};

const _layout = () => {
  const { active_profile } = useLoaderData<{ active_profile: Profile }>();
  return (
    <div>
      <div className="grid grid-cols-5 h-screen">
        <div className="col-span-1">
          <Sidebar {...{ profile: active_profile }} />
        </div>
        <div className="col-span-4 border-l">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default _layout;
