import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
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
import { Controller } from "react-hook-form";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import zod from "zod";
import { errSession } from "~/flash.session";
import { requestorProfileSchema } from "~/form-schemas";
import { createSupabaseServerClient } from "~/supabase.server";

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

type FormData = zod.infer<typeof requestorProfileSchema>;
const resolver = zodResolver(requestorProfileSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const session = await errSession.getSession(request.headers.get("Cookie"));

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    // The keys "errors" and "defaultValues" are picked up automatically by useRemixForm
    return json({ errors, defaultValues, error: null });
  }

  const { error } = await supabaseClient.from("requestors_profiles").insert({
    ...data,
  });

  if (error) {
    session.flash("error", error.details);
    return json(
      { success: false, error: error?.details },
      {
        headers: {
          "Set-Cookie": await errSession.commitSession(session),
        },
      }
    );
  }

  return redirect(`/requests/details?email=${data.email}`);
};

const CreateRequestorProfile = () => {
  const { departments, entities } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [searchParams, setSearchParams] = useSearchParams();

  const existingEmail = searchParams.get("email");

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      email: existingEmail ?? "",
    },
  });

  return (
    <div>
      <div>
        <div className="mb-6 space-y-1">
          <h2 className="text-md font-medium text-gray-600">
            Tell us more about yourself
          </h2>
          <p className="text-xs text-gray-500">
            For ease of providing you with the best service, please enter
            details below
          </p>
        </div>
        <Form
          method="post"
          onSubmit={handleSubmit}
          className="grid grid-flow-row gap-4"
        >
          <Controller
            name="full_name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                radius="none"
                size="sm"
                variant="bordered"
                label="Full Name"
                {...field}
                isRequired
                isInvalid={!!errors.full_name?.message}
                errorMessage={errors?.full_name?.message?.toString()}
              />
            )}
          />
          {!existingEmail && (
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  radius="none"
                  size="sm"
                  variant="bordered"
                  label="Email"
                  {...field}
                  isRequired
                  isInvalid={!!errors.email?.message}
                  errorMessage={errors?.email?.message?.toString()}
                />
              )}
            />
          )}
          <div className="grid grid-cols-2 gap-2">
            <Controller
              name="id_number"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  radius="none"
                  size="sm"
                  variant="bordered"
                  label="ID Number"
                  {...field}
                  isRequired
                  isInvalid={!!errors.id_number?.message}
                  errorMessage={errors?.id_number?.message?.toString()}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  radius="none"
                  size="sm"
                  variant="bordered"
                  label="Phone Number"
                  {...field}
                  isInvalid={!!errors.phone?.message}
                  errorMessage={errors?.phone?.message?.toString()}
                />
              )}
            />
          </div>

          <Controller
            name="department_id"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                radius="none"
                size="sm"
                variant="bordered"
                label="Department"
                placeholder="Select a department"
                {...field}
                isInvalid={!!errors.department_id?.message}
                errorMessage={errors?.department_id?.message?.toString()}
              >
                {departments?.map((department) => (
                  <SelectItem key={department.id}>{department.name}</SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="entity_id"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                radius="none"
                size="sm"
                variant="bordered"
                label="Entity"
                placeholder="Select an Entity"
                {...field}
                isInvalid={!!errors.entity_id?.message}
                errorMessage={errors?.entity_id?.message?.toString()}
              >
                {entities?.map((entity) => (
                  <SelectItem key={entity.id}>{entity.name}</SelectItem>
                ))}
              </Select>
            )}
          />
          <div className="flex justify-end gap-5">
            <Button
              variant="ghost"
              radius="none"
              as={Link}
              to="/requests"
              type="submit"
            >
              Cancel
            </Button>
            <Button
              endContent={<Send size={16} />}
              color="primary"
              radius="none"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateRequestorProfile;
