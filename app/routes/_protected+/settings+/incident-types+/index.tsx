import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Divider,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { TrashIcon } from "@radix-ui/react-icons";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  Form,
  json,
  useLoaderData,
} from "@remix-run/react";
import { Delete, Trash2Icon, X } from "lucide-react";
import { IncidentCategory } from "types";
import { CreateIncidentCategory, CreateIncidentType } from "~/components";
import { createSupabaseServerClient } from "~/supabase.server";
import {
  getIncidentTypes,
  setIncidentTypesArray,
} from "~/utils/cache/dexie-cache";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const { data, error } = await supabaseClient
    .from("incident-types")
    .select("*");

  const { data: categories, error: error2 } = await supabaseClient
    .from("incident_categories")
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

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const cachedIncidentTypes = await getIncidentTypes();

  if (cachedIncidentTypes.length > 0)
    return json({ incident_types: cachedIncidentTypes });

  // @ts-ignore
  let { data } = await serverLoader();

  await setIncidentTypesArray(data);

  return { data };
}

clientLoader.hydrate = true;

const IncidentTypes = () => {
  const { data, error } = useLoaderData<typeof loader>();

  return (
    <div className="">
      {/* <IncidentTabs /> */}
      <div className="flex px-4 items-center justify-between h-[8dvh] my-2">
        <div>
          <h3 className="text-2xl font-bold text-gray-700">Incident Types</h3>
        </div>
        <div className="flex gap-4 items-center">
          <CreateIncidentCategory {...{ incident_types: data }} />
          <CreateIncidentType />
        </div>
      </div>
      <div className="">
        {data.map((t) => (
          <div key={t.id}>
            <Accordion key={t.id}>
              <AccordionItem
                key={t.id}
                aria-label={t.name}
                subtitle={`${t?.cats?.length} - Categories`}
                title={t.name.toLocaleUpperCase()}
                className="font-medium text-gray-700 px-4"
              >
                <div className="pb-4 gap-10 grid grid-cols-3">
                  {t?.cats?.map((c: IncidentCategory, index: number) => (
                    <div key={c.id}>
                      <Form
                        method="DELETE"
                        action="/settings/incident-types/incident-category"
                      >
                        <input type="hidden" name="cat_id" value={c.id} />
                        <input
                          type="hidden"
                          name="_action"
                          value={"delete_cat"}
                        />
                        <Card shadow="none">
                          <CardBody className="px-0">
                            <div className="flex justify-start gap-5 items-center">
                              <p className="text-gray-700 text-sm">
                                <span className="font-medium">
                                  {index + 1}.
                                </span>{" "}
                                {c.name}
                              </p>
                              <Button
                                isIconOnly
                                radius="full"
                                color="danger"
                                variant="light"
                                size="sm"
                                type="submit"
                              >
                                <Trash2Icon size={16} />
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      </Form>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Form
                    method="DELETE"
                    action="/settings/incident-types/incident-type"
                  >
                    <Button
                      type="submit"
                      size="md"
                      color="danger"
                      variant="flat"
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

const IncidentTabs = () => {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options" variant="light">
        <Tab key="photos" title="Photos">
          <Card>
            <CardBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="music" title="Music">
          <Card>
            <CardBody>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="videos" title="Videos">
          <Card>
            <CardBody>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default IncidentTypes;
