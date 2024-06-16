import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  ZonedDateTime,
  getLocalTimeZone,
  now,
  parseAbsoluteToLocal,
  toCalendarDateTime,
} from "@internationalized/date";
import React, { useEffect } from "react";
import { createSupabaseServerClient } from "~/supabase.server";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIncidentSchema } from "~/form-schemas";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { Controller } from "react-hook-form";
import { Form, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { profileSessionData } from "~/session";
import { getCache, setCache } from "~/utils/cache/localforage-cache";

type FormData = zod.infer<typeof createIncidentSchema>;
const resolver = zodResolver(createIncidentSchema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);

  const { data: categories, error } = await supabaseClient
    .from("incident-categories")
    .select("*");

  const { data: departments, error: error2 } = await supabaseClient
    .from("departments")
    .select("*");

  if (error || error2) {
    return json({ categories: [], departments: [] });
  }

  return json(
    { categories, departments },
    {
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    }
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const { active_profile } = await profileSessionData(request);
  const {
    errors,
    data: formData,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    // The keys "errors" and "defaultValues" are picked up automatically by useRemixForm
    return json({ errors, defaultValues, error: null });
  }

  const { data, error } = await supabaseClient
    .from("incidents")
    .insert({
      ...formData,
      entity_id: active_profile?.entities.id,
      compiler_id: active_profile?.id,
    })
    .select()
    .single();

  if (error) {
    return json({ error });
  }

  // Update the localforage cache with the new incident
  const cacheKey = "incidents";
  let cachedIncidents = (await getCache(cacheKey)) ?? [];

  console.log({ cachedIncidents });

  // cachedIncidents = [...cachedIncidents, data]; // Add the new incident
  // await setCache(cacheKey, cachedIncidents);

  // if (!incidents) incidents = [];
  // incidents.push(data);
  // await setCache(cacheKey, incidents);

  return redirect(`/incidents/${data.id}`);
};

const calculateDateTime = (date: ZonedDateTime) => {
  const cal = toCalendarDateTime(date);
  // @ts-ignore
  return dayjs(cal).format();
};

enum Severity {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

const NewIncident = () => {
  const data = useLoaderData<typeof loader>();
  const dateTimeNow = new Date().toISOString();
  const [date, setDate] = React.useState(parseAbsoluteToLocal(dateTimeNow));
  const [closeTime, setCloseTime] = React.useState(
    parseAbsoluteToLocal(dateTimeNow)
  );

  let [incidentTime, setIncidentTime] = React.useState<string | undefined>(
    calculateDateTime(date)
  );

  let [incidentCloseTime, setIncidentCloseTime] = React.useState<
    string | undefined
  >(calculateDateTime(date));

  useEffect(() => {
    if (date) {
      const cal = calculateDateTime(date);
      setIncidentTime(cal);
    }
    if (closeTime) {
      const cal = calculateDateTime(closeTime);
      setIncidentCloseTime(cal);
    }
  }, [date, closeTime]);

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      incident_time: incidentTime,
      incident_close_time: incidentCloseTime,
      severity: Severity.Low,
    },
  });

  return (
    <div>
      <h1>New Incident</h1>
      <Form method="post" onSubmit={handleSubmit}>
        <div className="">
          <div className="grid grid-cols-4 gap-4">
            <input name="incident_time" type="hidden" value={incidentTime} />
            <input
              name="incident_close_time"
              type="hidden"
              value={incidentCloseTime}
            />
            <DatePicker
              label="Incident Date & Time"
              variant="bordered"
              hideTimeZone
              showMonthAndYearPickers
              hourCycle={24}
              defaultValue={now(getLocalTimeZone())}
              value={date}
              onChange={setDate}
              minValue={now(getLocalTimeZone()).subtract({ hours: 12 })}
              maxValue={now(getLocalTimeZone())}
              isInvalid={!!errors.incident_time?.message}
              errorMessage={errors?.incident_time?.message?.toString()}
              isRequired
            />
            <Controller
              name="incident_location"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  label="Incident Location"
                  {...field}
                  isRequired
                  isInvalid={!!errors.incident_location?.message}
                  errorMessage={errors?.incident_location?.message?.toString()}
                />
              )}
            />
            <Controller
              name="category_id"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  items={data.categories}
                  label="Category"
                  placeholder="Select a category"
                  {...field}
                  isInvalid={!!errors.category_id?.message}
                  errorMessage={errors?.category_id?.message?.toString()}
                >
                  {(category) => (
                    <SelectItem key={category.id}>{category.name}</SelectItem>
                  )}
                </Select>
              )}
            />

            <Controller
              name="reporter_name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  label="Reporter Name"
                  {...field}
                  isRequired
                  isInvalid={!!errors.reporter_name?.message}
                  errorMessage={errors?.reporter_name?.message?.toString()}
                />
              )}
            />
            <Controller
              name="reporter_dept"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  items={data.departments}
                  label="Reporter Department"
                  placeholder="Select a department"
                  {...field}
                  isInvalid={!!errors.reporter_dept?.message}
                  errorMessage={errors?.reporter_dept?.message?.toString()}
                >
                  {(department) => (
                    <SelectItem key={department.id}>
                      {department.name}
                    </SelectItem>
                  )}
                </Select>
              )}
            />
            <div className="col-span-4">
              <Controller
                name="description"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    label="Description"
                    {...field}
                    isRequired
                    isInvalid={!!errors.description?.message}
                    errorMessage={errors?.description?.message?.toString()}
                  />
                )}
              />
            </div>
            <div className="col-span-4">
              <Controller
                name="action"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    label="Action"
                    {...field}
                    isRequired
                    isInvalid={!!errors.action?.message}
                    errorMessage={errors?.action?.message?.toString()}
                  />
                )}
              />
            </div>
            <DatePicker
              label="Time Completed"
              variant="bordered"
              hideTimeZone
              showMonthAndYearPickers
              hourCycle={24}
              defaultValue={now(getLocalTimeZone())}
              value={closeTime}
              onChange={setCloseTime}
              // minValue={now(getLocalTimeZone()).subtract({ hours: 12 })}
              minValue={
                incidentTime ? parseAbsoluteToLocal(incidentTime) : undefined
              }
              maxValue={now(getLocalTimeZone())}
              isInvalid={!!errors.incident_close_time?.message}
              errorMessage={errors?.incident_close_time?.message?.toString()}
              isRequired
            />
            <Controller
              name="severity"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  label="Severity"
                  placeholder="Select severity"
                  {...field}
                  isInvalid={!!errors.severity?.message}
                  errorMessage={errors?.severity?.message?.toString()}
                >
                  {/* Map over the Severity enum values */}
                  {Object.values(Severity).map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>
          <Button type="submit">Create</Button>
        </div>
      </Form>
    </div>
  );
};

export default NewIncident;
