import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { ChevronRight } from "lucide-react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { errSession } from "~/flash.session";
import { createSupabaseServerClient } from "~/supabase.server";
import {
  requestorProfileSession,
  requestorProfileSessionData,
} from "~/sessions/session.server";
import { supabaseClient } from "~/services/supabase-auth.server";

const reports = [
  // {
  //   id: "1",
  //   name: "Work Permit",
  //   description: "Work Permit",
  // },
  {
    id: "2",
    name: "CCTV Review",
    target: "cctv",
    description: "CCTV Review Request",
  },
  {
    id: "3",
    name: "Access Key",
    target: "access",
    description: "Access Cards & Keys",
  },
  {
    id: "4",
    name: "Other",
    target: "other",
    description: "Other",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // const { supabaseClient } = createSupabaseServerClient(request);
  const { requestor_profile, session } = await requestorProfileSessionData(
    request
  );

  let url = new URL(request.url);
  let email = url.searchParams.get("email");

  const { data, error } = await supabaseClient
    .from("requestors_profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    return redirect(`/requests/create_requestor_profile?email=${email}`);
  }

  // set cookies
  session.set("requestor_profile", data);
  return json(
    { data },
    {
      headers: {
        "Set-Cookie": await requestorProfileSession.commitSession(session),
      },
    }
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await errSession.getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  // console.log({ formData });
  const target = formData.get("target");
  const id = formData.get("id");

  if (!target || !id) {
    session.flash("error", "An Error has occurred");

    return json({
      headers: {
        "Set-Cookie": await errSession.commitSession(session),
      },
    });
  }

  const intended = reports.find((report) => report.id === target);

  switch (intended?.target) {
    case "cctv":
      return redirect(`/requests/details/cctv_request`);

    default:
      break;
  }

  return {};
};

const Details = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="mb-6 space-y-1">
        <h2 className="text-md font-medium text-gray-600">
          Hi, {data?.data?.full_name as any}
        </h2>
        <p className="text-xs text-gray-500">
          What would you like to request for?
        </p>
      </div>
      <Form method="POST">
        <div className="space-y-4">
          <input type="hidden" name="id" value={data?.data?.id} />
          <Select
            name="target"
            size="sm"
            radius="none"
            variant="bordered"
            label="Request"
          >
            {reports?.map((report) => (
              <SelectItem value={report.target} key={report.id}>
                {report.name}
              </SelectItem>
            ))}
          </Select>
          <div className="flex justify-end gap-5 items-center">
            <Button variant="ghost" as={Link} to="/requests" radius="none">
              Cancel
            </Button>
            <Button
              color="primary"
              radius="none"
              endContent={<ChevronRight />}
              type="submit"
            >
              Continue
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Details;
