import { Time } from "@internationalized/date";
import { Button, Tooltip } from "@nextui-org/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Outlet, json, redirect, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { FileWarning } from "lucide-react";
import { Profile } from "types";
import { Sidebar } from "~/components";
import { errSession } from "~/flash.session";
import { profileSession, profileSessionData } from "~/session";
import { createSupabaseServerClient } from "~/supabase.server";
import {
  isCurrentTimeWithinShift,
  shiftStandAndStop,
} from "~/utils/shift_checker";
// import customParseFormat from "dayjs/plugin/customParseFormat";

// dayjs.extend(customParseFormat);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, active_profile } = await profileSessionData(request);
  const { supabaseClient } = createSupabaseServerClient(request);
  const errorSession = await errSession.getSession(
    request.headers.get("Cookie")
  );

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  if (!active_profile) {
    const { data } = await supabaseClient
      .from("profiles")
      .select(`*, entities(*)`)
      .eq("email", user.email);
    // check if user has an active profile

    if (!data || data?.length === 0) {
      return redirect(`/create-profile?email=${user.email}`);
    }

    if (data.length >= 1) {
      session.set("profiles", data);

      return redirect("/select-profile", {
        headers: {
          "Set-Cookie": await profileSession.commitSession(session),
        },
      });
    }
  }

  // Check if the current time is within the shift hours and active_profile has values
  if (active_profile?.shift_start && active_profile?.shift_end) {
    const isWithinShift = isCurrentTimeWithinShift(
      active_profile?.shift_start,
      active_profile?.shift_end
    );

    if (!isWithinShift) {
      // Invalidate active_profile and redirect to sign-out
      session.set("active_profile", undefined);
      const message = "Your shift has ended";
      console.log(message);
      return json({
        active_profile,
        shift_ended: true,
      });
    }
  }

  if (active_profile?.isActive === false) {
    errorSession.flash("error", "This profile is not active");

    return redirect("/sign-out", {
      headers: {
        "Set-Cookie": await errSession.commitSession(errorSession),
      },
    });
  }

  return json({ active_profile });
};

const _layout = () => {
  const { active_profile, shift_ended } = useLoaderData<{
    active_profile: Profile;
    shift_ended?: boolean;
  }>();

  const { shiftStart, shiftEnd } = shiftStandAndStop(
    active_profile.shift_start!,
    active_profile.shift_end!
  );

  if (shift_ended) {
    return (
      <div className="flex h-screen max-w-sm mx-auto flex-col justify-center items-center">
        <div className="space-y-4 justify-center flex flex-col items-center">
          <FileWarning className="text-red-400" size={40} />
          <h3 className="text-md text-red-400 font-semibold">
            Your shift has ended
          </h3>
          <p className="text-sm text-center text-gray-600">
            Your shift starts at {shiftStart} and ends at {shiftEnd}
          </p>
        </div>
        <Form
          action="/sign-out"
          method="post"
          className="w-full flex justify-center mt-10"
        >
          <Button color="primary" type="submit" className="w-full">
            Sign out
          </Button>
        </Form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 max-h-screen min-h-screen overscroll-none scrollbar-hide">
      <div className="col-span-1">
        <Sidebar {...{ profile: active_profile }} />
      </div>
      <div className="col-span-4 border-l">
        <Outlet />
      </div>
    </div>
  );
};

export default _layout;
