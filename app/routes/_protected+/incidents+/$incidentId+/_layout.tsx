import { Link } from "@nextui-org/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  Link as RemixLink,
  Outlet,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
import clsx from "clsx";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Incident } from "types";
import AddPeopleInvolvedModal from "~/components/incidents/AddPeopleInvolvedModal";
import i18nextServer from "~/modules/i18next.server";
import { supabaseClient } from "~/services/supabase-auth.server";
import { createSupabaseServerClient } from "~/supabase.server";
import {
  getAllDepartments,
  getIncidentById,
  setDepartmentsArray,
  setIncident,
} from "~/utils/cache/dexie-cache";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { incidentId } = params;
  let locale = await i18nextServer.getLocale(request);
  let isEnLocale = locale === "en";

  const { data: incident, error } = await supabaseClient
    .from("incidents")
    .select(
      "*, category:incident_categories!incidents_category_id_fkey(name, name_ar)"
    )
    .eq("id", incidentId)
    .single();

  const { data: departments, error: deptError } = await supabaseClient
    .from("departments")
    .select("*");

  if (error || deptError) {
    return {
      error,
      incident: null,
      departments: null,
    };
  }

  let foundIncident = {
    ...incident,
    description: isEnLocale ? incident.description : incident.description_ar,
    action: isEnLocale ? incident.action : incident.action_ar,
    reporter_name: isEnLocale
      ? incident.reporter_name
      : incident.reporter_name_ar,
    incident_location: isEnLocale
      ? incident.incident_location
      : incident.incident_location_ar,
  };

  return {
    incident: foundIncident,
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

const DetailedIncident = () => {
  let { t, i18n } = useTranslation();
  const locale = i18n.language; // Get the current language from i18n
  const isEnLocale = locale === "en";

  const { incident: foundIncident } = useLoaderData<{
    incident: Incident | null;
  }>();

  const incident = {
    ...foundIncident,
    description: isEnLocale
      ? foundIncident?.description
      : foundIncident?.description_ar,
    action: isEnLocale ? foundIncident?.action : foundIncident?.action_ar,
    reporter_name: isEnLocale
      ? foundIncident?.reporter_name
      : foundIncident?.reporter_name_ar,
    incident_location: isEnLocale
      ? foundIncident?.incident_location
      : foundIncident?.incident_location_ar,
    category: {
      ...foundIncident?.category,
      name: isEnLocale
        ? foundIncident?.category?.name
        : foundIncident?.category?.name_ar,
    },
  };

  const matches = useMatches();
  const editPage: any = matches.find(
    (match) => match.pathname === `/incidents/${incident?.id}/edit-incident`
  );

  const involvedPage = matches.find(
    (match) => match.pathname === `/incidents/${incident?.id}/people_involved`
  );

  const incident_time = dayjs(incident?.incident_time)
    .locale(isEnLocale ? "en" : "ar")
    .format("DD-MM-YYYY HH:mm");
  const close_time = dayjs(incident?.incident_close_time)
    .locale(isEnLocale ? "en" : "ar")
    .format("DD-MM-YYYY HH:mm");

  const updated_at = dayjs(incident?.updated_at)
    .locale(isEnLocale ? "en" : "ar")
    .format("DD-MM-YYYY HH:mm");

  const severity_name = (severity: string | undefined) => {
    switch (severity) {
      case "Low":
        return t("low");
      case "Medium":
        return t("medium");
      case "High":
        return t("high");
      default:
        return "success";
    }
  };

  if (editPage) {
    return (
      <div className="h-[92dvh] overflow-y-scroll">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="h-[92dvh] px-4">
      <div className="sticky flex flex-col justify-center border-b h-[10dvh] ">
        <div className="flex items-center justify-between">
          <div className="">
            <h3 className="text-xl font-semibold text-gray-600">
              {incident?.category?.name}
            </h3>
            <p className="text-tiny text-gray-500">
              {t("reported_by")}: {incident?.reporter_name}/{" "}
              {incident?.reporter_department?.name}
            </p>
          </div>
          <h3 className="text-xs font-medium text-gray-600">
            {t("severity")}:{" "}
            <span
              className={clsx(
                "",
                (incident?.severity as unknown) === "Medium"
                  ? "text-orange-400"
                  : (incident?.severity as unknown) === "High"
                  ? "text-red-500"
                  : "text-gray-600"
              )}
            >
              {severity_name(incident?.severity as string | undefined)}
            </span>
          </h3>
          <div className="">
            <p className="text-sm font-medium text-gray-700">
              {t("time")}: {incident_time}
            </p>
            <p className="text-tiny text-gray-400">
              {t("closed")}: {close_time}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4 py-4 h-[82dvh] overflow-y-auto">
        <div className="">
          <h1 className="font-medium text-sm text-gray-700">
            {t("occurrence")}
          </h1>
          <p className="text-gray-500 text-sm">{incident?.description}</p>
        </div>
        <div className="">
          <h1 className="text-sm font-medium text-gray-700">
            {t("action_taken")}
          </h1>
          <p className="text-gray-500 text-sm">{incident?.action}</p>
        </div>
        <div className="">
          <Outlet />
        </div>
        <div className="py-2">
          <div className="space-y-2">
            {!involvedPage && (
              <Link as={RemixLink} to="people_involved">
                <span className="text-tiny">{t("show_people_involved")}</span>
              </Link>
            )}
            <AddPeopleInvolvedModal />
          </div>
        </div>
        <div className="text-tiny text-cyan-500">
          <p className="">
            {t("compiled_by")}: {incident?.compiler?.name}
          </p>
          {incident?.compiler?.name !== incident?.compiler?.name && (
            <p className="">
              {t("edited_by")}: {incident?.editor?.name}
            </p>
          )}
          <p className="">
            {t("last_changed")}: {updated_at}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailedIncident;
