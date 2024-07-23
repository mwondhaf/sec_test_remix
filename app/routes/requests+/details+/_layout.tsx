import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import zod from "zod";
import { requestorProfileSessionData } from "~/sessions/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  let email = url.searchParams.get("email");

  const { requestor_profile } = await requestorProfileSessionData(request);

  const details_home = url.pathname === "/requests/details";

  if (details_home) {
    const emailSchema = zod.string().email();
    try {
      emailSchema.parse(email);
    } catch (error) {
      return redirect(`/requests`);
    }
  } else {
    if (!requestor_profile) {
      return redirect(`/requests`);
    }
  }

  return {};
};

const _layout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default _layout;
