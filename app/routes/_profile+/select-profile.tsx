import { Button, Select, SelectItem } from "@nextui-org/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { profileSession, profileSessionData } from "~/session";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { profiles, session } = await profileSessionData(request);

  const body = await request.formData();

  const selected_profile_id = body.get("profile");

  if (selected_profile_id) {
    const findProfile = profiles?.find(
      (profile) => profile.id === selected_profile_id
    );
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
    <div>
      <h2>Select Profile</h2>
      {actionData?.error && <p>{actionData.error}</p>}
      {profiles && (
        <Form method="post">
          <Select
            label="Your Company"
            placeholder="Select a company"
            name="profile"
          >
            {profiles?.map((profile) => (
              <SelectItem key={profile.id}>{profile.entities.name}</SelectItem>
            ))}
          </Select>
          <Button type="submit">Confirm</Button>
        </Form>
      )}
    </div>
  );
};

export default SelectProfile;
