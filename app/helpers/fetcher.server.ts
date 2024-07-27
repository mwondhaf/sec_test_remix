import dayjs from "dayjs";
import { Incident } from "types";
import { supabaseClient } from "~/services/supabase-auth.server";
import { profileSessionData } from "~/sessions/session.server";
import { createSupabaseServerClient } from "~/supabase.server";

export const useFetchIncidents = async (request: Request) => {
  // const { supabaseClient } = createSupabaseServerClient(request);
  const { active_profile } = await profileSessionData(request);

  const fetchAllIncidents = async (
    from?: string | null,
    to?: string | null
  ) => {
    if (!from || !to) {
      from = dayjs().startOf("day").toISOString();
      to = dayjs().endOf("day").toISOString();
    }

    const { data: incidents, error } = await supabaseClient
      .from("incidents")
      .select(
        "*, reporter_department:departments!incidents_reporter_dept_fkey(*), entity:entities!incidents_entity_id_fkey(*), compiler: profiles!incidents_compiler_id_fkey(*), editor: profiles!incidents_editor_id_fkey(*),category:incident_categories!incidents_category_id_fkey(*)"
      )
      .eq("entity_id", active_profile?.entityId)
      .order("incident_time", { ascending: true })
      .gte("incident_time", from)
      .lte("incident_time", to);

    if (error) {
      return [] as Incident[];
    }
    return incidents as Incident[];
  };

  const fetchPeopleInvolved = async (incidentId: number) => {
    const { data: people_involved, error } = await supabaseClient
      .from("people_involved")
      .select(
        "*, person_department:departments!people_involved_person_dept_fkey(*)"
      )
      .eq("incident_id", incidentId);

    if (error) {
      return { error, people_involved: [] };
    }

    return { people_involved, error: null };
  };

  const fetchIncidentsWithPeopleInvolved = async (
    from?: string | null,
    to?: string | null
  ) => {
    const incidents = await fetchAllIncidents(from, to);

    const incidentsWithPeopleInvolved = await Promise.all(
      incidents.map(async (incident) => {
        const { people_involved, error } = await fetchPeopleInvolved(
          incident.id
        );

        if (error) {
          return { ...incident, people_involved: [] };
        }

        return { ...incident, people_involved };
      })
    );

    return incidentsWithPeopleInvolved;
  };

  return {
    fetchAllIncidents,
    fetchPeopleInvolved,
    fetchIncidentsWithPeopleInvolved,
  };
};
