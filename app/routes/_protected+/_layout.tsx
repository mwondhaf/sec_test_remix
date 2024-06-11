import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, json, redirect } from "@remix-run/react";
import { profileSessionData } from "~/session";
import { createSupabaseServerClient } from "~/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = profileSessionData(request);
  const { supabaseClient } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("email", user.email);
  // check if user has an active profile

  if (!data || data?.length === 0) {
    return redirect(`/create-profile?email=${user.email}`);
  }

  if (data.length > 1) {
    return redirect("/select-profile");
  }

  // console.log({ data });
  // console.log({ error });

  return json({ user });
};

const _layout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default _layout;
