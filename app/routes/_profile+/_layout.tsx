import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import React from "react";
import { redirect } from "react-router";
import { supabaseClient } from "~/services/supabase-auth.server";
import { createSupabaseServerClient } from "~/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // const { supabaseClient } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }
  return {};
};

const _layout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default _layout;
