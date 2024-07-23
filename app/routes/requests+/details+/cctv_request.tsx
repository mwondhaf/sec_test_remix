import { zodResolver } from "@hookform/resolvers/zod";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { Button, DateRangePicker, Input, Textarea } from "@nextui-org/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Link,
  json,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { Send } from "lucide-react";
import React from "react";
import { Controller } from "react-hook-form";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { customAlphabet } from "nanoid";
import zod from "zod";
import { errSession } from "~/flash.session";
import { cctvSchema } from "~/form-schemas/requestor";
import { createSupabaseServerClient } from "~/supabase.server";
import {
  requestorProfileSession,
  requestorProfileSessionData,
} from "~/sessions/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);

  const { data: departments } = await supabaseClient
    .from("departments")
    .select("*");
  const { data: entities } = await supabaseClient.from("entities").select("*");

  if (
    !departments ||
    departments.length === 0 ||
    !entities ||
    entities.length === 0
  ) {
    return json({
      departments: [],
      entities: [],
    });
  }

  return json({ departments, entities, error: null });
};

type FormData = zod.infer<typeof cctvSchema>;
const resolver = zodResolver(cctvSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const { requestor_profile, session: requestor_session } =
    await requestorProfileSessionData(request);

  const session = await errSession.getSession(request.headers.get("Cookie"));
  const nanoid = customAlphabet("1234567890EMAR", 6);

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    // The keys "errors" and "defaultValues" are picked up automatically by useRemixForm
    return json({ errors, defaultValues, error: null });
  }

  const { error, data: request_data } = await supabaseClient
    .from("cctv_requests")
    .insert({
      ...data,
      requested_by: Number(requestor_profile?.id!),
      request_id: nanoid(),
    })
    .select()
    .single();

  if (error) {
    session.flash("error", error?.details ?? "Something went wrong");
    return json(
      { success: false, error: error?.details },
      {
        headers: {
          "Set-Cookie": await errSession.commitSession(session),
        },
      }
    );
  }

  // insert into log
  await supabaseClient.from("cctv_events_log").insert({
    event: "created",
    event_by: requestor_profile?.full_name,
    cctv_ref: request_data.id,
    remarks: "Pending",
  });

  requestor_session.set("requestor_profile", undefined);
  return redirect(`/requests/success?track=${request_data.request_id}`, {
    headers: {
      "Set-Cookie": await requestorProfileSession.commitSession(
        requestor_session
      ),
    },
  });
};

const CCTVRequest = () => {
  let date = new Date();

  const [value, setValue] = React.useState({
    start: parseAbsoluteToLocal(
      new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
    ),
    end: parseAbsoluteToLocal(new Date().toISOString()),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
  });

  return (
    <div>
      <div>
        <div className="mb-6 space-y-1">
          <h2 className="text-md font-medium text-gray-600">
            CCTV Review Details
          </h2>
          <p className="text-xs text-gray-500">
            Please fill out the form below to request a CCTV review
          </p>
        </div>
        <Form
          method="post"
          onSubmit={handleSubmit}
          className="grid grid-flow-row gap-4"
        >
          <input
            {...register("from_time")}
            type="hidden"
            name="from_time"
            value={value.start.toAbsoluteString()}
          />
          <input
            {...register("to_time")}
            type="hidden"
            name="to_time"
            value={value.end.toAbsoluteString()}
          />
          <DateRangePicker
            variant="bordered"
            size="sm"
            radius="none"
            label="Time & Date"
            hideTimeZone
            visibleMonths={1}
            value={value}
            onChange={(value) => {
              setValue(value);
            }}
            defaultValue={null}
          />
          <Controller
            name="reason"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                radius="none"
                size="sm"
                variant="bordered"
                label="Reason of requesting"
                {...field}
                isRequired
                isInvalid={!!errors.reason?.message}
                errorMessage={errors?.reason?.message?.toString()}
              />
            )}
          />
          <Controller
            name="location"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                radius="none"
                size="sm"
                variant="bordered"
                label="Location to check"
                {...field}
                isRequired
                isInvalid={!!errors.location?.message}
                errorMessage={errors?.location?.message?.toString()}
              />
            )}
          />
          <div>
            <Controller
              name="details"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Textarea
                  radius="none"
                  size="sm"
                  variant="bordered"
                  label="Request details"
                  {...field}
                  isRequired
                  isInvalid={!!errors.details?.message}
                  errorMessage={errors?.details?.message?.toString()}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-5">
            <Button variant="ghost" radius="none" as={Link} to="/requests">
              Cancel
            </Button>
            <Button
              endContent={<Send size={16} />}
              color="primary"
              radius="none"
              type="submit"
            >
              Submit Request
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CCTVRequest;
