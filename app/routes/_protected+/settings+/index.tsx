import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { ChooseOption } from "~/components";
import CreateIncidentType from "~/components/CreateIncidentType";
import { createSupabaseServerClient } from "~/supabase.server";

const IncidentSettings = () => {
  return (
    <div className="p-4 h-full">
      <ChooseOption />
    </div>
  );
};

export default IncidentSettings;
