import { Accordion, AccordionItem, Button, Divider } from "@nextui-org/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import { IncidentType } from "types";
import { CreateIncidentCategory, CreateIncidentType } from "~/components";
import { createSupabaseServerClient } from "~/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const { data, error } = await supabaseClient
    .from("incident-types")
    .select("*");

  if (error) {
    return json({ error, data: [] as IncidentType[] });
  }
  return json({
    data,
    error: null,
  });
};

const IncidentTypes = () => {
  const { data, error } = useLoaderData<typeof loader>();
  return (
    <div>
      IncidentTypes
      <CreateIncidentType />
      <div className="">
        {data.map((t) => (
          <div key={t.id}>
            <Accordion key={t.id}>
              <AccordionItem
                key={t.id}
                aria-label={t.name}
                subtitle="Press to expand"
                title={t.name.toLocaleUpperCase()}
              >
                <div className="">Hii</div>
                <div className="flex justify-between">
                  <CreateIncidentCategory {...{ incident_types: data }} />
                  <Form
                    method="DELETE"
                    action="/settings/incident-types/incident-type"
                  >
                    <Button
                      type="submit"
                      size="sm"
                      color="danger"
                      variant="faded"
                    >
                      Delete Type
                    </Button>
                    <input type="hidden" name="inc_id" value={t.id} />
                    <input type="hidden" name="_action" value={"delete_type"} />
                  </Form>
                </div>
              </AccordionItem>
            </Accordion>
            <Divider className="my-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentTypes;
