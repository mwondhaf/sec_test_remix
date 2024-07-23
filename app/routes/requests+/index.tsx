import { Button, Image, Input } from "@nextui-org/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { ChevronRight } from "lucide-react";
import {
  requestorProfileSession,
  requestorProfileSessionData,
} from "~/sessions/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await requestorProfileSessionData(request);

  session.set("requestor_profile", undefined);
  return json({
    headers: {
      "Set-Cookie": await requestorProfileSession.commitSession(session),
    },
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");

  if (email && typeof email === "string" && email.length > 0) {
    return redirect(`/requests/details?email=${email}`);
  }

  return {};
};

const Welcome = () => {
  return (
    <div className="px-4">
      <div className="mb-6 space-y-3">
        <div className="flex justify-center items-center mb-12">
          <Image width={120} src="/images/request.png" />
        </div>
        <h2 className="text-xl text-center font-semibold text-gray-600">
          Hi, Make your Request
        </h2>
        <p className="text-xs text-center text-gray-500">
          Start by entering your email and then click continue to proceed with
          your request.
        </p>
      </div>
      <Form method="POST">
        <div className="space-y-4">
          <Input
            name="email"
            isRequired
            variant="bordered"
            type="email"
            label="Email"
            size="sm"
            radius="none"
          />
          <div className="flex justify-end">
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

export default Welcome;
