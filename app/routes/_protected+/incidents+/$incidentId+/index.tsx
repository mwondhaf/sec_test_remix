import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  Link,
  useLoaderData,
} from "@remix-run/react";
import React from "react";
import { Incident } from "types";
import { EditIncident } from "~/components";
import { createSupabaseServerClient } from "~/supabase.server";
import { getCache, setCache } from "~/utils/cache";
import { getIncidentById, setIncident } from "~/utils/cache/dexie-cache";

interface DetailedIncidentProps {}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { incidentId } = params;

  const { supabaseClient } = createSupabaseServerClient(request);

  const { data: incident, error } = await supabaseClient
    .from("incidents")
    .select("*")
    .eq("id", incidentId)
    .single();

  if (error) {
    return json({ error, incident: null });
  }

  return json({ incident, error: null });
};

export async function clientLoader({
  params,
  serverLoader,
}: ClientLoaderFunctionArgs) {
  const { incidentId } = params;
  if (!incidentId) return { incident: null };

  let cachedIncident = await getIncidentById(Number(incidentId));

  if (cachedIncident) {
    return { incident: cachedIncident };
  }

  // @ts-ignore
  const { incident } = await serverLoader();

  await setIncident(incident);

  return { incident };
}

clientLoader.hydrate = true;

const DetailedIncident: React.FC<DetailedIncidentProps> = (props) => {
  const { incident } = useLoaderData<{ incident: Incident | null }>();
  return (
    <>
      <h1>Detailed Incident</h1>
      <pre>{JSON.stringify(incident, null, 2)}</pre>
      <Link to="edit-incident">Edit</Link>
      {incident && <EditIncident incident={incident} />}
    </>
  );
};

export default DetailedIncident;
