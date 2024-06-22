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
import {
  ClientLoaderFunctionArgs,
  Form,
  useLoaderData,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import dayjs from "dayjs";
import { profileSessionData } from "~/session";
import {
  getAllCategories,
  getAllDepartments,
  setCategoriesArray,
  setDepartmentsArray,
} from "~/utils/cache/dexie-cache";

type FormData = zod.infer<typeof createIncidentSchema>;
const resolver = zodResolver(createIncidentSchema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);

  const url = new URL(request.url);
  const inc_time = url.searchParams.get("inc_time");
  const close_time = url.searchParams.get("close_time");

  const { data: categories, error } = await supabaseClient
    .from("incident_categories")
    .select("*");

  const { data: departments, error: error2 } = await supabaseClient
    .from("departments")
    .select("*");

  if (error || error2) {
    return json({ categories: [], departments: [], inc_time, close_time });
  }

  return json({ categories, departments, inc_time, close_time });
};

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const [cachedCats, cachedDepts] = await Promise.all([
    getAllCategories(),
    getAllDepartments(),
  ]);

  if (cachedDepts.length > 0 && cachedCats.length > 0) {
    return { departments: cachedDepts, categories: cachedCats };
  }

  // @ts-ignore
  let { departments, categories } = await serverLoader();

  await Promise.all([
    setDepartmentsArray(departments),
    setCategoriesArray(categories),
  ]);

  return { departments, categories };
}

clientLoader.hydrate = true;

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const { active_profile } = await profileSessionData(request);

  const url = new URL(request.url);
  const inc_time = url.searchParams.get("inc_time");
  const close_time = url.searchParams.get("close_time");

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
      incident_close_time: close_time,
      incident_time: inc_time,
    })
    .select()
    .single();

  if (error) {
    return json({ error });
  }

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
  const dateTimeNow = now(getLocalTimeZone());
  const [date, setDate] = React.useState(dateTimeNow);
  const [closeTime, setCloseTime] = React.useState(dateTimeNow);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams((prev) => {
      prev.set("inc_time", calculateDateTime(date));
      return prev;
    });
  }, [date]);

  useEffect(() => {
    // setIncidentCloseTime(calculateDateTime(closeTime));
    setSearchParams((prev) => {
      prev.set("close_time", calculateDateTime(closeTime));
      return prev;
    });
  }, [closeTime]);

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      severity: Severity.Low,
    },
  });

  return (
    <div>
      <h1>New Incident</h1>
      <Form method="post" onSubmit={handleSubmit}>
        <div className="">
          <div className="grid grid-cols-4 gap-4">
            <DatePicker
              label="Incident Date & Time"
              variant="bordered"
              hideTimeZone
              showMonthAndYearPickers
              hourCycle={24}
              value={date}
              onChange={setDate}
              minValue={now(getLocalTimeZone()).subtract({ hours: 12 })}
              maxValue={now(getLocalTimeZone())}
              // isInvalid={!!errors.incident_time?.message}
              // errorMessage={errors?.incident_time?.message?.toString()}
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
              value={closeTime}
              onChange={setCloseTime}
              minValue={
                data.inc_time ? parseAbsoluteToLocal(data.inc_time!) : undefined
              }
              maxValue={now(getLocalTimeZone())}
              isInvalid={
                data.close_time?.toString()! < data.inc_time?.toString()!
              }
              errorMessage={"errors?.incident_close_time?.message?.toString()"}
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
                  {Object.values(Severity).map((severity) => (
                    <SelectItem key={severity} value={severity}>
                      {severity}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>
        </div>
        <Button type="submit" color="primary">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default NewIncident;
