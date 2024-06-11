import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useMatches,
  useParams,
} from "@remix-run/react";
import React from "react";
import { Controller } from "react-hook-form";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { Company, Entity } from "types";
import * as zod from "zod";
import { createProfileSchema } from "~/form-schemas";
import { createSupabaseServerClient } from "~/supabase.server";

type FormData = zod.infer<typeof createProfileSchema>;
const resolver = zodResolver(createProfileSchema);

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { supabaseClient, headers } = createSupabaseServerClient(request);
  console.log({ params });

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    // The keys "errors" and "defaultValues" are picked up automatically by useRemixForm
    return json({ errors, defaultValues, error: null });
  }

  const { error } = await supabaseClient.from("profiles").insert({
    ...data,
  });

  if (error) {
    return json({ success: false, error: error?.message }, { headers });
  }

  return redirect("/");
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  const { supabaseClient } = createSupabaseServerClient(request);

  const { data: companies } = await supabaseClient
    .from("companies")
    .select("*");
  const { data: entities } = await supabaseClient.from("entities").select("*");

  if (
    !companies ||
    companies.length === 0 ||
    !entities ||
    entities.length === 0
  ) {
    return json({
      error: "There needs to be at least one Company and one Entity",
      companies: null,
      entities: null,
      email: email ?? "",
    });
  }

  return json({ companies, entities, error: null, email: email ?? "" });
};

const CreateProfile = () => {
  const { companies, error, entities } = useLoaderData<{
    companies: Company[];
    error: string | null;
    entities: Entity[];
  }>();

  const actionData = useActionData<typeof action>();
  const { email } = useLoaderData<typeof loader>();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      email: email ?? "",
    },
  });
  return (
    <div>
      <h1>Create Profile</h1>
      {!error ? (
        <>
          <div className="flex flex-col px-32 justify-center">
            <>{actionData && <p>{actionData?.error}</p>}</>

            <Form
              method="post"
              onSubmit={handleSubmit}
              className="grid grid-flow-row gap-4"
            >
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    label="Full Name"
                    {...field}
                    isRequired
                    isInvalid={!!errors.name?.message}
                    errorMessage={errors?.name?.message?.toString()}
                  />
                )}
              />

              <Controller
                name="companyId"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    label="Your Company"
                    placeholder="Select a company"
                    {...field}
                    isInvalid={!!errors.companyId?.message}
                    errorMessage={errors?.companyId?.message?.toString()}
                  >
                    {companies?.map((company) => (
                      <SelectItem key={company.id}>{company.name}</SelectItem>
                    ))}
                  </Select>
                )}
              />

              <Controller
                name="idNumber"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    label="ID Number"
                    {...field}
                    isRequired
                    isInvalid={!!errors.idNumber?.message}
                    errorMessage={errors?.idNumber?.message?.toString()}
                  />
                )}
              />

              <Controller
                name="entityId"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    label="Entity"
                    placeholder="Select an Entity"
                    {...field}
                    isInvalid={!!errors.entityId?.message}
                    errorMessage={errors?.entityId?.message?.toString()}
                  >
                    {entities?.map((entity) => (
                      <SelectItem key={entity.id}>{entity.name}</SelectItem>
                    ))}
                  </Select>
                )}
              />

              <Button
                size="lg"
                type="submit"
                className="w-full"
                color="primary"
              >
                Create Profile
              </Button>
            </Form>
          </div>
        </>
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
};

export default CreateProfile;
