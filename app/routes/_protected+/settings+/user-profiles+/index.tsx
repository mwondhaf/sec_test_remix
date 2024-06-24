import { Button } from "@nextui-org/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  useLoaderData,
} from "@remix-run/react";
import { Company, Entity, Profile } from "types";
import { AddPersonProfile, ProfilesTable } from "~/components";
import { profileSessionData } from "~/session";
import { createSupabaseServerClient } from "~/supabase.server";
import { getCache, setCache } from "~/utils/cache";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const { active_profile } = await profileSessionData(request);

  const { data: profiles, error } = await supabaseClient
    .from("profiles")
    .select("*, company:companies!user_profiles_duplicate_companyId_fkey(name)")
    .eq("entityId", active_profile?.entityId);

  const { data: entities, error: entitiesError } = await supabaseClient
    .from("entities")
    .select("*");

  const { data: companies, error: companiesError } = await supabaseClient
    .from("companies")
    .select("*");

  if (error || entitiesError || companiesError) {
    return json({
      error: "There was an error loading your profiles",
      profiles: null,
    });
  }
  return json({ profiles, entities, companies });
};

const UserProfiles = () => {
  const { profiles, entities, companies } = useLoaderData<{
    profiles: Profile[];
    entities: Entity[];
    companies: Company[];
  }>();
  return (
    <div className="px-4">
      <div className="flex items-center justify-between pb-2 h-[8dvh] border-b my-2">
        <div>
          <h3 className="text-2xl font-bold text-gray-700">User Profiles</h3>
        </div>
        <Button type="submit" color="primary" variant="flat" size="md">
          Add User Profile
        </Button>
        <AddPersonProfile {...{ entities, companies }} />
      </div>
      <ProfilesTable {...{ profiles }} />
    </div>
  );
};

export default UserProfiles;
