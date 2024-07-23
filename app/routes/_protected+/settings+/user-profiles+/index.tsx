import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Company, Entity, Profile } from "types";
import { AddPersonProfile, ProfileCard } from "~/components";
import { profileSessionData } from "~/sessions/session.server";
import { createSupabaseServerClient } from "~/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const { active_profile } = await profileSessionData(request);

  const { data: profiles, error } =
    active_profile?.role === "ADMIN"
      ? await supabaseClient
          .from("profiles")
          .select(
            "*, company:companies!profiles_companyId_fkey(name), entity:entities!profiles_entityId_fkey1(*)"
          )
      : await supabaseClient
          .from("profiles")
          .select(
            "*, company:companies!profiles_companyId_fkey(name), entity:entities!profiles_entityId_fkey1(*)"
          )
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
      <div className="flex items-center justify-between h-[8dvh] my-2">
        <div>
          <h3 className="text-2xl font-bold text-gray-700">User Profiles</h3>
        </div>
        <AddPersonProfile {...{ entities, companies }} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {profiles.map((profile) => (
          <ProfileCard {...{ profile, entities, companies }} />
        ))}
      </div>
    </div>
  );
};

export default UserProfiles;
