import { Button } from "@nextui-org/react";
import { TrashIcon } from "@radix-ui/react-icons";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { Department } from "types";
import { CreateDepartment } from "~/components";
import { createSupabaseServerClient } from "~/supabase.server";
import { getAllDepartments } from "~/utils/cache/dexie-cache";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const { data, error } = await supabaseClient.from("departments").select("*");

  if (error) {
    return json({ error });
  }

  return json({
    data,
  });
};

export const clientLoader = async ({
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  let cachedDepts = await getAllDepartments();
  if (cachedDepts.length > 0) {
    return { data: cachedDepts };
  }

  // @ts-ignore
  let { data } = await serverLoader();

  return { data };
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const formData = await request.formData();
  const name = String(formData.get("name"));
  const intent = String(formData.get("intent"));

  switch (intent) {
    case "delete_dept":
      const dept_id = String(formData.get("dept_id"));
      await supabaseClient.from("departments").delete().eq("id", dept_id);
      break;

    default:
      const { error } = await supabaseClient
        .from("departments")
        .insert([{ name }])
        .select();

      if (error) {
        return json({ error });
      }
      break;
  }

  return null;
};

const Departments = () => {
  const fetcher = useFetcher();
  const { data, error } = useLoaderData<{
    error?: string;
    data?: Department[];
  }>();

  return (
    <div>
      <div className="">Departments</div>
      <CreateDepartment />
      {data?.map((d) => (
        <div key={d.id} className="flex items-center justify-between my-4">
          <h2>{d.name}</h2>
          <div className="">
            <fetcher.Form method="delete">
              <Button isIconOnly type="submit">
                <TrashIcon />
              </Button>
              <input type="hidden" name="intent" value={"delete_dept"} />
              <input type="hidden" name="dept_id" value={d.id} />
            </fetcher.Form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Departments;
