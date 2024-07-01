import { Button, Select, SelectItem, Tooltip } from "@nextui-org/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { LogOut } from "lucide-react";
import { errSession } from "~/flash.session";
import { profileSession, profileSessionData } from "~/session";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { profiles, session } = await profileSessionData(request);
  const erSession = await errSession.getSession(request.headers.get("Cookie"));

  const body = await request.formData();
  const headers = new Headers();

  const selected_profile_id = body.get("profile");

  if (selected_profile_id) {
    const findProfile = profiles?.find(
      (profile) => profile.id === selected_profile_id
    );

    if (!findProfile?.isActive) {
      session.set("active_profile", undefined);
      return json(
        { error: "Profile is not active" },
        {
          headers: {
            "Set-Cookie": await profileSession.commitSession(session),
          },
        }
      );
    }

    if (findProfile) {
      session.set("active_profile", findProfile);
      return redirect("/", {
        headers: {
          "Set-Cookie": await profileSession.commitSession(session),
        },
      });
    }
  }

  return json({ error: "No profile selected" });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, profiles } = await profileSessionData(request);
  if (profiles?.length === 1) {
    session.set("active_profile", profiles[0]);
    return redirect("/", {
      headers: {
        "Set-Cookie": await profileSession.commitSession(session),
      },
    });
  }

  return json({ profiles });
};

const SelectProfile = () => {
  const { profiles } = useLoaderData<typeof loader>();
  const actionData = useActionData<{ error: string | undefined }>();

  return (
    <div className="max-w-md mx-auto flex flex-col justify-center h-screen">
      <div className="space-y-2 pb-8">
        <h2 className="text-2xl font-bold text-center">Select Profile</h2>
        <p className="text-sm text-center text-gray-600">
          You have {profiles?.length} profiles, select which one to use
        </p>
      </div>
      {actionData?.error && (
        <p className="text-red-400 text-tiny pb-2">{actionData.error}</p>
      )}
      {profiles && (
        <Form method="post" className="space-y-4">
          <Select label="Select profile" name="profile">
            {profiles?.map((profile) => (
              <SelectItem key={profile.id}>
                {profile?.entities?.name}
              </SelectItem>
            ))}
          </Select>
          <Button color="primary" className="w-full" size="lg" type="submit">
            Select
          </Button>
        </Form>
      )}
      <Form
        action="/sign-out"
        method="post"
        className="w-full flex  justify-center mt-20"
      >
        <Tooltip content="Sign-out">
          <Button
            color="warning"
            radius="full"
            type="submit"
            variant="flat"
            isIconOnly
          >
            <LogOut size={18} />
          </Button>
        </Tooltip>
      </Form>
    </div>
  );
};

export default SelectProfile;
