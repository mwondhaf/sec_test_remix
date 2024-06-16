import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  Divider,
} from "@nextui-org/react";
import { TrashIcon } from "@radix-ui/react-icons";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import { IncidentCategory, IncidentType } from "types";
import { CreateIncidentCategory, CreateIncidentType } from "~/components";
import { createSupabaseServerClient } from "~/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const { data, error } = await supabaseClient
    .from("incident-types")
    .select("*");

  const { data: categories, error: error2 } = await supabaseClient
    .from("incident-categories")
    .select("*");

  if (error || error2) {
    return json({
      error,
      data: [] as any[],
    });
  }

  const finalData = data?.map((t) => {
    const cats: IncidentCategory[] = categories?.filter(
      (c) => c.incident_type_id === t.id
    );
    return { ...t, cats };
  });

  return json({
    data: finalData,
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
                subtitle={`${t?.cats?.length} - Categories`}
                title={t.name.toLocaleUpperCase()}
              >
                <div className="pb-4 flex items-center gap-3">
                  {t?.cats?.map((c: IncidentCategory) => (
                    <div key={c.id}>
                      <Form
                        method="DELETE"
                        action="/settings/incident-types/incident-category"
                      >
                        <Button
                          endContent={<TrashIcon />}
                          variant="flat"
                          color="secondary"
                          size="sm"
                          radius="full"
                          type="submit"
                        >
                          {c.name}
                        </Button>
                        <input type="hidden" name="cat_id" value={c.id} />
                        <input
                          type="hidden"
                          name="_action"
                          value={"delete_cat"}
                        />
                      </Form>
                    </div>
                  ))}
                </div>
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
