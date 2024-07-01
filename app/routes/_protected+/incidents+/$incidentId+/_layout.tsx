import { Link } from "@nextui-org/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  Link as RemixLink,
  Outlet,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
import dayjs from "dayjs";
import React from "react";
import { Incident } from "types";
import AddPeopleInvolvedModal from "~/components/incidents/AddPeopleInvolvedModal";
import { createSupabaseServerClient } from "~/supabase.server";
import {
  getAllDepartments,
  getIncidentById,
  setDepartmentsArray,
  setIncident,
} from "~/utils/cache/dexie-cache";

interface DetailedIncidentProps {}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { incidentId } = params;

  const { supabaseClient } = createSupabaseServerClient(request);

  const { data: incident, error } = await supabaseClient
    .from("incidents")
    .select("*, category:incident_categories!incidents_category_id_fkey(name)")
    .eq("id", incidentId)
    .single();

  const { data: departments, error: deptError } = await supabaseClient
    .from("departments")
    .select("*");

  if (error || deptError) {
    return { error, incident: null, departments: null };
  }

  return {
    incident,
    departments,
    error: null,
  };
};

export const shouldRevalidate = async () => {
  return true;
};

export async function clientLoader({
  params,
  serverLoader,
}: ClientLoaderFunctionArgs) {
  const { incidentId } = params;
  if (!incidentId) return { incident: null };

  const [cachedIncident, cachedDepts] = await Promise.all([
    getIncidentById(Number(incidentId)),
    getAllDepartments(),
  ]);

  if (cachedIncident && cachedDepts.length > 0) {
    return {
      incident: cachedIncident,
      departments: cachedDepts,
    };
  }

  // @ts-ignore
  const { incident, departments } = await serverLoader();
  await Promise.all([setIncident(incident), setDepartmentsArray(departments)]);

  return { incident, departments };
}

const DetailedIncident: React.FC<DetailedIncidentProps> = (props) => {
  const { incident } = useLoaderData<{
    incident: Incident | null;
  }>();

  const matches = useMatches();
  const editPage: any = matches.find(
    (match) => match.pathname === `/incidents/${incident?.id}/edit-incident`
  );

  const involvedPage = matches.find(
    (match) => match.pathname === `/incidents/${incident?.id}/people_involved`
  );

  const incident_time = dayjs(incident?.incident_time).format(
    "DD-MM-YYYY HH:mm"
  );
  const close_time = dayjs(incident?.incident_close_time).format(
    "DD-MM-YYYY HH:mm"
  );

  const updated_at = dayjs(incident?.updated_at).format("DD-MM-YYYY HH:mm");

  if (editPage) {
    return (
      <div className="h-[92dvh] overflow-y-scroll">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="h-[92dvh]">
      <div className="pb-2 sticky border-b h-[8dvh] ">
        <div className="flex items-center justify-between">
          <div className="">
            <h3 className="text-2xl font-bold text-gray-700">
              {incident?.category?.name}
            </h3>
            <p className="text-tiny">
              Reported by: {incident?.reporter_name}/{" "}
              {incident?.reporter_department?.name}
            </p>
          </div>
          <h3 className="text-xs font-bold text-gray-600">
            Severity: {incident?.severity}
          </h3>
          <div className="">
            <p className="text-sm font-bold text-gray-700">
              Time: {incident_time}
            </p>
            <p className="text-tiny text-gray-400">Closed: {close_time}</p>
          </div>
        </div>
      </div>
      <div className="space-y-4 py-4 h-[84dvh] overflow-y-auto">
        <div className="">
          <h1 className="text-md font-bold text-gray-600">Occurrence</h1>
          <p className="text-gray-500 text-sm">{incident?.description}</p>
        </div>
        <div className="">
          <h1 className="text-md font-bold text-gray-600">Action Taken</h1>
          <p className="text-gray-500 text-sm">{incident?.action}</p>
        </div>
        <div className="">
          <Outlet />
        </div>
        <div className="py-2">
          <div className="space-y-2">
            {!involvedPage && (
              <Link as={RemixLink} to="people_involved">
                <span className="text-tiny">Show people involved</span>
              </Link>
            )}
            <AddPeopleInvolvedModal />
          </div>
        </div>
        <div className="text-tiny text-cyan-500">
          <p className="">Compiled by: {incident?.compiler?.name}</p>
          {incident?.compiler?.name !== incident?.compiler?.name && (
            <p className="">Edited by: {incident?.editor?.name}</p>
          )}
          <p className="">Last changed: {updated_at}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailedIncident;
