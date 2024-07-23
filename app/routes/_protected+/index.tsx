import { DateRangePicker } from "@nextui-org/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import {
  CategoryGraph,
  DashboardBlocks,
  IncidentTypesBar,
  SeverityDonut,
} from "~/components";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { parseAbsoluteToLocal } from "@internationalized/date";
import React from "react";
import { createSupabaseServerClient } from "~/supabase.server";
import { Incident, IncidentCategory, IncidentType } from "types";
import dayjs from "dayjs";
import { profileSessionData } from "~/sessions/session.server";

ChartJS.register(ArcElement, Tooltip, Legend);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { active_profile } = await profileSessionData(request);
  const { supabaseClient } = createSupabaseServerClient(request);

  const url = new URL(request.url);
  let from = url.searchParams.get("from");
  let to = url.searchParams.get("to");

  if (!from || !to) {
    from = dayjs().startOf("month").toISOString();
    to = dayjs().endOf("day").toISOString();
  }

  const { data, error } = await supabaseClient
    .from("incidents")
    .select(
      "*, incident_type_id:incident_categories!incidents_category_id_fkey(incident_type_id)"
    )
    .gte("incident_time", from)
    .eq("entity_id", active_profile?.entityId)
    .lte("incident_time", to);

  const { data: incident_types, error: typesError } = await supabaseClient
    .from("incident-types")
    .select("*");

  const { data: categories, error: catError } = await supabaseClient
    .from("incident_categories")
    .select("*");

  if (error || typesError || catError) {
    return json({
      error: {
        message: error?.message,
      },
      incidents: [] as Incident[],
      incident_types: [] as IncidentType[],
      categories: [] as IncidentCategory[],
    });
  }

  return json({
    active_profile,
    incidents: data as Incident[],
    incident_types: incident_types as IncidentType[],
    categories: categories as IncidentCategory[],
  });
};

const index = () => {
  let date = new Date();
  const [value, setValue] = React.useState({
    start: parseAbsoluteToLocal(
      new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
    ),
    end: parseAbsoluteToLocal(new Date().toISOString()),
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const data = useLoaderData<typeof loader>();

  return (
    <div className="px-4 h-screen overflow-y-auto">
      <div className="flex justify-end sticky top-0 mx-auto py-2 z-10 bg-white">
        <div className="">
          <DateRangePicker
            label="Time Period"
            hideTimeZone
            visibleMonths={3}
            value={value}
            onChange={(value) => {
              setValue(value);
              setSearchParams((prev) => {
                prev.set("from", value.start.toAbsoluteString());
                prev.set("to", value.end.toAbsoluteString());
                return prev;
              });
            }}
            defaultValue={null}
          />
        </div>
      </div>
      <div className="mt-10">
        <DashboardBlocks {...{ incidents: data.incidents }} />
        <div className="grid grid-cols-2 gap-4">
          <div className="my-10">
            <SeverityDonut {...{ incidents: data.incidents }} />
          </div>
          <div className="my-10">
            <IncidentTypesBar
              {...{
                incidents: data.incidents,
                incident_types: data.incident_types,
              }}
            />
          </div>
        </div>
        <div className="">
          <CategoryGraph
            {...{ incidents: data.incidents, categories: data.categories }}
          />
        </div>
      </div>
    </div>
  );
};

export default index;
