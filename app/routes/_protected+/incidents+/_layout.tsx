import { Card, CardBody, Divider } from "@nextui-org/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  Link,
  Outlet,
  json,
  useLoaderData,
} from "@remix-run/react";
import { Incident } from "types";
import { createSupabaseServerClient } from "~/supabase.server";
import { getAllIncidents, setIncidentsArray } from "~/utils/cache/dexie-cache";
import { getCache, setCache } from "~/utils/cache/localforage-cache";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const { data: incidents, error } = await supabaseClient
    .from("incidents")
    .select("*");

  if (error) {
    return json({ incidents: [] as Incident[], error: error.message });
  }

  return json({ incidents: (incidents as Incident[]) ?? ([] as Incident[]) });
};

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const cachedIncidents = await getAllIncidents();

  if (cachedIncidents.length > 0) return json({ incidents: cachedIncidents });

  // @ts-ignore
  let { incidents } = await serverLoader();

  await setIncidentsArray(incidents);

  return json({ incidents });
}

clientLoader.hydrate = true;

const Layout = () => {
  const { incidents } = useLoaderData<{ incidents: Incident[] }>();

  return (
    <div className="grid grid-cols-6 h-screen">
      <div className="h-full overflow-y-scroll col-span-2">
        {incidents.map((incident) => (
          <div key={incident.id}>
            <Link to={`/incidents/${incident.id}`}>
              <Card radius="none" shadow="none">
                <CardBody>
                  <p className="text-sm line-clamp-1">
                    Make beautiful websites regardless of your design
                    experience.
                  </p>
                  <p className="text-xs line-clamp-1 text-gray-400">
                    Make beautiful websites regardless of your design
                    experience.
                  </p>
                  <p className="text-xs line-clamp-1 text-gray-400">
                    Make beautiful websites regardless of your design
                    experience.
                  </p>
                </CardBody>
              </Card>
            </Link>
            <Divider />
          </div>
        ))}
      </div>
      <div className="col-span-4 border-l px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
