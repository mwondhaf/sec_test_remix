import { LoaderFunctionArgs, json } from "@remix-run/node";
import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";
import { PersonInvolved } from "types";
import { PeopleInvolvedList } from "~/components";
import { createSupabaseServerClient } from "~/supabase.server";
import { getPeopleInvolvedByIncidentId } from "~/utils/cache/dexie-cache";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { incidentId } = params;

  const { supabaseClient } = createSupabaseServerClient(request);

  // get people involved
  const { data: people_involved, error: peopleError } = await supabaseClient
    .from("people_involved")
    .select(
      "*, person_department:departments!people_involved_person_dept_fkey(*)"
    )
    .eq("incident_id", incidentId);

  console.log({ people_involved });

  if (peopleError) {
    return { error: peopleError, people_involved: null };
  }

  return { people_involved, error: null };
};

export const clientLoader = async ({
  params,
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  const { incidentId } = params;

  let cachedPeople = await getPeopleInvolvedByIncidentId(Number(incidentId));

  if (cachedPeople.length > 0) {
    return { people_involved: cachedPeople };
  }
  // @ts-ignore
  const { people_involved } = await serverLoader();

  return { people_involved, error: null };
};

const PeopleInvolved = () => {
  const { people_involved } = useLoaderData<{
    people_involved: PersonInvolved[];
  }>();

  if (people_involved.length > 0) {
    return (
      <>
        <h1 className="text-md font-bold text-gray-600">People Involved</h1>
        <PeopleInvolvedList {...{ people_involved }} />
      </>
    );
  }

  return (
    <div>
      <p className="text-sm text-orange-500">No people involved</p>
    </div>
  );
};

export default PeopleInvolved;
