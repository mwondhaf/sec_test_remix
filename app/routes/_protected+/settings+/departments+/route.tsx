import { Button } from "@nextui-org/react";
import { TrashIcon } from "@radix-ui/react-icons";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { Trash2Icon } from "lucide-react";
import { Department } from "types";
import { CreateDepartment } from "~/components";
import { errSession } from "~/flash.session";
import { supabaseClient } from "~/services/supabase-auth.server";
import { createSupabaseServerClient } from "~/supabase.server";
import { getAllDepartments } from "~/utils/cache/dexie-cache";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // const { supabaseClient } = createSupabaseServerClient(request);
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
  // const { supabaseClient } = createSupabaseServerClient(request);
  const session = await errSession.getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const name = String(formData.get("name"));
  const intent = String(formData.get("intent"));

  switch (intent) {
    case "delete_dept":
      const dept_id = String(formData.get("dept_id"));
      const { error: deptError } = await supabaseClient
        .from("departments")
        .delete()
        .eq("id", dept_id);
      if (deptError) {
        session.flash("error", deptError.message);

        return json(
          { error: deptError },
          {
            headers: {
              "Set-Cookie": await errSession.commitSession(session),
            },
          }
        );
      }

      session.flash("success", "Deleted successfully");
      return json({
        headers: {
          "Set-Cookie": await errSession.commitSession(session),
        },
      });

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
    <div className="px-4">
      <div className="flex items-center justify-between h-[8dvh] my-2">
        <div>
          <h3 className="text-2xl font-bold text-gray-700">Departments</h3>
        </div>
        <CreateDepartment />
      </div>
      {data?.map((d) => (
        <div key={d.id} className="flex items-center justify-between my-4">
          <h2 className="text-gray-600 text-sm">{d.name}</h2>
          <div className="w-3/4">
            <fetcher.Form method="delete">
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
