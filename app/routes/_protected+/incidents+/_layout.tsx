import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, json, useLoaderData } from "@remix-run/react";
import { Incident } from "types";
import { createSupabaseServerClient } from "~/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  // const incidents = [
  //   { id: 1, desc: "hello there" },
  //   { id: 2, desc: "hell" },
  // ];

  const { data: incidents, error } = await supabaseClient
    .from("incidents")
    .select("*");

  if (error) {
  }

  return json({ incidents: incidents ?? ([] as Incident[]) });
};

const _layout = () => {
  const { incidents } = useLoaderData<typeof loader>();
  return (
    <div className="grid grid-cols-3 h-screen">
      <div className="">
        {incidents.map((incident) => (
          <div key={incident.id}>
            <Link to={`/incidents/${incident.id}`}>{incident.desc}</Link>
          </div>
        ))}
      </div>
      <div className="col-span-2 bg-green-200">
        <Outlet />
      </div>
    </div>
  );
};

export default _layout;
