import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import CreateIncidentType from "~/components/CreateIncidentType";
import { createSupabaseServerClient } from "~/supabase.server";

const IncidentSettings = () => {
  return (
    <div>
      <h3>Incident Settings</h3>
    </div>
  );
};

export default IncidentSettings;
