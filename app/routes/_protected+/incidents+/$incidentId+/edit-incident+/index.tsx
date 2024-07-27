import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { Department, Incident, IncidentCategory } from "types";
import { createSupabaseServerClient } from "~/supabase.server";
import {
  getAllCategories,
  getAllDepartments,
  getIncidentById,
  setCategoriesArray,
  setDepartmentsArray,
  setIncident,
} from "~/utils/cache/dexie-cache";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIncidentSchema } from "~/form-schemas";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import {
  ZonedDateTime,
  getLocalTimeZone,
  now,
  parseAbsoluteToLocal,
  toCalendarDateTime,
} from "@internationalized/date";
import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { Controller } from "react-hook-form";
import { profileSessionData } from "~/sessions/session.server";
import { supabaseClient } from "~/services/supabase-auth.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { incidentId } = params;
  // const { supabaseClient } = createSupabaseServerClient(request);

  const url = new URL(request.url);
  const inc_time = url.searchParams.get("inc_time");
  const close_time = url.searchParams.get("close_time");

  const { data: incident, error } = await supabaseClient
    .from("incidents")
    .select("*")
    .eq("id", incidentId)
    .single();

  const { data: categories, error: catError } = await supabaseClient
    .from("incident_categories")
    .select("*");

  const { data: departments, error: deptError } = await supabaseClient
    .from("departments")
    .select("*");

  if (error || catError || deptError) {
    return json({
      error,
      incident: null,
      categories: null,
      departments: null,
      inc_time,
      close_time,
    });
  }

  return json({
    incident,
    categories,
    departments,
    error: null,
    inc_time,
    close_time,
  });
};

export async function clientLoader({
  params,
  serverLoader,
}: ClientLoaderFunctionArgs) {
  const { incidentId } = params;
  if (!incidentId) return { incident: null };

  const [cachedIncident, cachedDepts, cachedCats] = await Promise.all([
    getIncidentById(Number(incidentId)),
    getAllDepartments(),
    getAllCategories(),
  ]);

  if (cachedIncident && cachedDepts.length > 0 && cachedCats.length > 0) {
    return {
      incident: cachedIncident,
      categories: cachedCats,
      departments: cachedDepts,
    };
  }

  // @ts-ignore
  const { incident, categories, departments } = await serverLoader();

  await Promise.all([
    setIncident(incident),
    setDepartmentsArray(departments),
    setCategoriesArray(categories),
  ]);

  return { incident, categories, departments };
}

clientLoader.hydrate = true;

const partialIncidentSchema = createIncidentSchema.partial();

type FormData = zod.infer<typeof partialIncidentSchema>;
const resolver = zodResolver(partialIncidentSchema);

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

enum Status {
  Resolved = "Resolved",
  Pending = "Pending",
}

export const action = async ({ request }: ActionFunctionArgs) => {
  // const { supabaseClient } = createSupabaseServerClient(request);
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
    return json({ errors, defaultValues, error: null });
  }

  const { id, ...rest } = formData;

  console.info({ formData });

  const newData = {
    ...rest,
    ...(inc_time && { incident_time: inc_time }),
    ...(close_time && { incident_close_time: close_time }),
    editor_id: active_profile?.id,
    updated_at: new Date().toISOString(),
    is_resolved: formData.is_resolved === "Resolved" ? true : false,
  };

  const { error, data } = await supabaseClient
    .from("incidents")
    .update({ ...newData })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { error };
  }

  return { incident: data };
};

export const clientAction = async ({
  serverAction,
}: ClientActionFunctionArgs) => {
  // @ts-ignore
  const { incident } = await serverAction();

  await setIncident(incident);

  return { incident };
};

const EditIncident = () => {
  const { incident, categories, departments, inc_time, close_time } =
    useLoaderData<{
      incident: Incident | null;
      categories: IncidentCategory[] | [];
      departments: Department[] | [];
      inc_time: string;
      close_time: string;
    }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  if (!incident) return;

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      id: incident.id,
      incident_location: incident.incident_location,
      category_id: incident.category_id,
      reporter_name: incident.reporter_name,
      description: incident.description,
      action: incident.action,
    },
  });

  return (
    <div className="">
      <Form method="post" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between pb-2 h-[8dvh] border-b my-2">
          <div>
            <h3 className="text-2xl font-bold text-gray-700">Edit Incident </h3>
          </div>
          <Button type="submit" color="primary" variant="flat" size="md">
            Save Changes
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 max-h-[84dvh] overflow-y-scroll">
          <div className="col-span-2">
            <div className="grid grid-cols-3 gap-3">
              <DatePicker
                size="sm"
                label="Incident Date & Time"
                hideTimeZone
                showMonthAndYearPickers
                hourCycle={24}
                defaultValue={parseAbsoluteToLocal(incident.incident_time!)}
                onChange={(value) => {
                  setSearchParams((prev) => {
                    prev.set("inc_time", calculateDateTime(value));
                    return prev;
                  });
                }}
                minValue={parseAbsoluteToLocal(
                  incident.incident_time!
                ).subtract({
                  hours: 12,
                })}
                maxValue={now(getLocalTimeZone())}
                isInvalid={!!errors.incident_time?.message}
                errorMessage={errors?.incident_time?.message?.toString()}
                isRequired
              />
              <DatePicker
                size="sm"
                label="Time Completed"
                hideTimeZone
                showMonthAndYearPickers
                hourCycle={24}
                defaultValue={parseAbsoluteToLocal(
                  incident.incident_close_time!
                )}
                onChange={(value) => {
                  setSearchParams((prev) => {
                    prev.set("close_time", calculateDateTime(value));
                    return prev;
                  });
                }}
                minValue={inc_time ? parseAbsoluteToLocal(inc_time) : undefined}
                maxValue={inc_time ? parseAbsoluteToLocal(inc_time) : undefined}
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
                    size="sm"
                    label="Severity"
                    placeholder="Select severity"
                    {...field}
                    isInvalid={!!errors.severity?.message}
                    errorMessage={errors?.severity?.message?.toString()}
                    defaultSelectedKeys={[incident.severity]}
                    {...register("severity")}
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

          <Controller
            name="category_id"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                size="sm"
                items={categories}
                label="Category"
                placeholder="Select a category"
                {...field}
                isInvalid={!!errors.category_id?.message}
                errorMessage={errors?.category_id?.message?.toString()}
                defaultSelectedKeys={[incident.category_id.toString()]}
                // selectedKeys={[incident.category_id.toString()]}
                {...register("category_id")}
              >
                {(category) => (
                  <SelectItem key={category.id}>{category.name}</SelectItem>
                )}
              </Select>
            )}
          />
          <Controller
            name="incident_location"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                size="sm"
                label="Incident Location"
                {...field}
                isRequired
                isInvalid={!!errors.incident_location?.message}
                errorMessage={errors?.incident_location?.message?.toString()}
              />
            )}
          />

          <div className="col-span-2">
            <Controller
              name="description"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Textarea
                  label="Description"
                  {...field}
                  isRequired
                  isInvalid={!!errors.description?.message}
                  errorMessage={errors?.description?.message?.toString()}
                />
              )}
            />
          </div>
          <div className="col-span-2">
            <Controller
              name="action"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Textarea
                  label="Action"
                  {...field}
                  isRequired
                  isInvalid={!!errors.action?.message}
                  errorMessage={errors?.action?.message?.toString()}
                />
              )}
            />
          </div>

          <Controller
            name="reporter_name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                size="sm"
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
                size="sm"
                items={departments}
                label="Reporter Department"
                placeholder="Select a department"
                {...field}
                isInvalid={!!errors.reporter_dept?.message}
                errorMessage={errors?.reporter_dept?.message?.toString()}
                defaultSelectedKeys={[incident.reporter_dept.toString()]}
                // selectedKeys={[incident.reporter_dept.toString()]}
                {...register("reporter_dept")}
              >
                {(department) => (
                  <SelectItem key={department.id}>{department.name}</SelectItem>
                )}
              </Select>
            )}
          />
          <div className="">
            <Controller
              name="is_resolved"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                // @ts-expect-error
                <Select
                  {...field}
                  size="md"
                  label="Status"
                  placeholder="Choose"
                  isRequired
                  defaultSelectedKeys={[
                    incident.is_resolved === true
                      ? Status.Resolved
                      : Status.Pending,
                  ]}
                >
                  {Object.values(Status).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>
        </div>
        <div className="py-2">
          <Button type="submit" color="primary" variant="flat" size="md">
            Save Changes
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditIncident;
