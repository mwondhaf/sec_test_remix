import { LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  Outlet,
  json,
  useLoaderData,
} from "@remix-run/react";
import { Department, Incident, IncidentCategory } from "types";
import { DetailTopBar, FilterBar, ListIncident } from "~/components";
import { createSupabaseServerClient } from "~/supabase.server";
import {
  getAllCategories,
  getAllDepartments,
  getAllIncidents,
  getIncidentsBySeverity,
  setCategoriesArray,
  setDepartmentsArray,
  setIncidentsArray,
} from "~/utils/cache/dexie-cache";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);

  const url = new URL(request.url);
  const severity = url.searchParams.get("severity");

  if (severity) {
    const { data: incidents, error } = await supabaseClient
      .from("incidents")
      .select(
        "*, reporter_department:departments!incidents_reporter_dept_fkey(*), entity:entities!incidents_entity_id_fkey(*), compiler: profiles!incidents_compiler_id_fkey(*), editor: profiles!incidents_editor_id_fkey(*),category:incident_categories!incidents_category_id_fkey(*)"
      )
      .eq("severity", severity)
      .order("incident_time", { ascending: false });

    const { data: departments, error: deptError } = await supabaseClient
      .from("departments")
      .select("*");

    const { data: categories, error: catError } = await supabaseClient
      .from("incident_categories")
      .select("*");

    if (error || deptError || catError) {
      return json({ incidents: [] as Incident[], error: error?.message });
    }

    return json({
      incidents: (incidents as unknown as Incident[]) ?? ([] as Incident[]),
      departments: departments ?? ([] as Department[]),
      categories: categories ?? ([] as IncidentCategory[]),
    });
  }

  const { data: incidents, error } = await supabaseClient
    .from("incidents")
    .select(
      "*, reporter_department:departments!incidents_reporter_dept_fkey(*), entity:entities!incidents_entity_id_fkey(*), compiler: profiles!incidents_compiler_id_fkey(*), editor: profiles!incidents_editor_id_fkey(*),category:incident_categories!incidents_category_id_fkey(*)"
    )
    .order("incident_time", { ascending: false });

  const { data: departments, error: deptError } = await supabaseClient
    .from("departments")
    .select("*");

  const { data: categories, error: catError } = await supabaseClient
    .from("incident_categories")
    .select("*");

  if (error || deptError || catError) {
    return json({ incidents: [] as Incident[], error: error?.message });
  }

  return json({
    incidents: (incidents as unknown as Incident[]) ?? ([] as Incident[]),
    departments: departments ?? ([] as Department[]),
    categories: categories ?? ([] as IncidentCategory[]),
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

  if (severity) {
    const severity_incidents = await getIncidentsBySeverity(severity);

    if (severity_incidents.length > 0)
      return json({ incidents: severity_incidents });

    // @ts-ignore
    let { incidents } = await serverLoader();

    return json({ incidents });
  }

  const [cachedIncidents, cachedDepts, cachedCats] = await Promise.all([
    getAllIncidents(),
    getAllDepartments(),
    getAllCategories(),
  ]);

  if (
    cachedIncidents.length > 0 &&
    cachedDepts.length > 0 &&
    cachedCats.length > 0
  )
    return json({ incidents: cachedIncidents, departments: cachedDepts });

  // @ts-ignore
  let { incidents, departments, categories } = await serverLoader();

  await Promise.all([
    setIncidentsArray(incidents),
    setDepartmentsArray(departments),
    setCategoriesArray(categories),
  ]);

  return json({ incidents, departments, categories });
}

clientLoader.hydrate = true;

const Layout = () => {
  const { incidents } = useLoaderData<{ incidents: Incident[] }>();

  return (
    <div className="">
      <div className="min-h-[8dvh] border-b grid grid-cols-6">
        <div className="col-span-2 px-4 py-2 flex items-center gap-2">
          <FilterBar />
        </div>
        <div className="col-span-4 border-l py-2 px-4">
          <DetailTopBar />
        </div>
      </div>
      <div className="grid grid-cols-6 h-[92dvh]">
        <div className="h-full overflow-y-scroll col-span-2">
          {incidents.map((incident) => (
            <ListIncident {...{ incident }} key={incident.id} />
          ))}
        </div>
        <div className="col-span-4 border-l px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
