import { Button } from "@nextui-org/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  Outlet,
  json,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Incident } from "types";
import { DetailTopBar, FilterBar, ListIncident } from "~/components";
import i18nextServer from "~/modules/i18next.server";
import { supabaseClient } from "~/services/supabase-auth.server";
import { profileSessionData } from "~/sessions/session.server";
import { createSupabaseServerClient } from "~/supabase.server";
import {
  filterIncidentsByQuery,
  getAllIncidents,
  getIncidentsBySeverity,
  setIncidentsArray,
} from "~/utils/cache/dexie-cache";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { active_profile } = await profileSessionData(request);
  let locale = await i18nextServer.getLocale(request);
  let isEnLocale = locale === "en";

  const url = new URL(request.url);
  const severity = url.searchParams.get("severity");

  if (severity) {
    const { data: incidents, error } = await supabaseClient
      .from("incidents")
      .select(
        "*, reporter_department:departments!incidents_reporter_dept_fkey(*), entity:entities!incidents_entity_id_fkey(*), compiler: profiles!incidents_compiler_id_fkey(*), editor: profiles!incidents_editor_id_fkey(*),category:incident_categories!incidents_category_id_fkey(*)"
      )
      .eq("severity", severity)
      .eq("entity_id", active_profile?.entityId)
      .order("incident_time", { ascending: false });

    if (error) {
      return json({
        incidents: [] as Incident[],
        error: error?.message,
      });
    }

    let finalIncidents = !isEnLocale
      ? incidents.map((incident) => {
          return {
            ...incident,
            description: incident.description_ar,
            action: incident.action_ar,
            reporter_name: incident.reporter_name_ar,
            incident_location: incident.incident_location_ar,
          };
        })
      : incidents;

    return json({
      incidents:
        (finalIncidents as unknown as Incident[]) ?? ([] as Incident[]),
    });
  }

  const { data: incidents, error } = await supabaseClient
    .from("incidents")
    .select(
      "*, reporter_department:departments!incidents_reporter_dept_fkey(*), entity:entities!incidents_entity_id_fkey(*), compiler: profiles!incidents_compiler_id_fkey(*), editor: profiles!incidents_editor_id_fkey(*),category:incident_categories!incidents_category_id_fkey(*)"
    )
    .eq("entity_id", active_profile?.entityId)
    .order("incident_time", { ascending: false });

  if (error) {
    return json({
      incidents: null,
      error: error?.message,
    });
  }

  let finalIncidents = !isEnLocale
    ? incidents.map((incident) => {
        return {
          ...incident,
          description: incident.description_ar,
          action: incident.action_ar,
          reporter_name: incident.reporter_name_ar,
          incident_location: incident.incident_location_ar,
          category: {
            ...incident.category,
            name: incident.category.name_ar,
          },
        };
      })
    : incidents;

  return json({
    incidents: (finalIncidents as unknown as Incident[]) ?? ([] as Incident[]),
  });
};

export async function clientLoader({
  serverLoader,
  request,
}: ClientLoaderFunctionArgs) {
  const url = new URL(request.url);
  const severity = url.searchParams.get("severity") as
    | "Low"
    | "Medium"
    | "High";

  const query = url.searchParams.get("q") as string;

  // severity and no query
  if (severity && !query) {
    const severity_incidents = await getIncidentsBySeverity(severity);

    if (severity_incidents.length > 0)
      return json({ incidents: severity_incidents });

    // @ts-ignore
    let { incidents } = await serverLoader();

    return json({ incidents });
  }

  // query && !severity
  if (query && !severity) {
    const query_incidents = await filterIncidentsByQuery(query);

    if (query_incidents.length > 0) return json({ incidents: query_incidents });

    return json({ incidents: [], message: "No Incident Found" });
  }

  if (severity && query) {
    const query_incidents = await filterIncidentsByQuery(query, severity);

    if (query_incidents.length > 0) {
      const filtered = query_incidents.filter(
        (incident) => (incident.severity as unknown as string) === severity
      );
      return json({ incidents: filtered });
    }

    return json({ incidents: [], message: "No Incident Found" });
  }

  const [cachedIncidents] = await Promise.all([getAllIncidents()]);

  if (cachedIncidents.length > 0)
    return json({
      incidents: cachedIncidents,
    });

  // @ts-ignore
  let { incidents } = await serverLoader();

  await Promise.all([setIncidentsArray(incidents)]);

  return { incidents };
}

clientLoader.hydrate = true;

const Layout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { incidents } = useLoaderData<{ incidents: Incident[] }>();
  const { t } = useTranslation();

  const query = searchParams.get("q");

  return (
    <div className="">
      <div className="min-h-[8dvh] border-b grid grid-cols-6">
        <div className="col-span-2 px-4 py-2 flex items-center gap-2">
          <FilterBar />
        </div>
        <div className="col-span-4 border-l border-r py-2 px-4">
          <DetailTopBar />
        </div>
      </div>
      <div className="grid grid-cols-6 h-[92dvh]">
        <div className="h-full overflow-y-auto col-span-2 bg-white">
          {incidents.length === 0 ? (
            <div className="text-center my-10 items-center h-full space-y-4">
              <h1>{t("no_incidents")}</h1>
              {query && (
                <>
                  <Button
                    onClick={() => {
                      searchParams.delete("q");
                      setSearchParams(searchParams);
                    }}
                    variant="flat"
                    size="sm"
                    radius="full"
                  >
                    Clear search
                  </Button>
                </>
              )}
            </div>
          ) : (
            <>
              {incidents.map((incident) => (
                <ListIncident {...{ incident }} key={incident.id} />
              ))}
            </>
          )}
        </div>
        <div className="col-span-4 border-l border-r px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
