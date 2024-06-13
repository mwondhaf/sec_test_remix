import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { profileSessionData } from "~/session";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { active_profile } = await profileSessionData(request);
  return json({ active_profile });
};

const index = () => {
  const { active_profile } = useLoaderData<typeof loader>();
  return (
    <div>
      <h2>Home</h2>
      <pre>{JSON.stringify(active_profile, null, 2)}</pre>
    </div>
  );
};

export default index;
