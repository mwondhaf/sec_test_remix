import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, redirect, useActionData, useLocation } from "@remix-run/react";
import { createSupabaseServerClient } from "~/supabase.server";
import * as zod from "zod";
import { signInSchema } from "~/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { Button, Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";

type FormData = zod.infer<typeof signInSchema>;
const resolver = zodResolver(signInSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabaseClient, headers } = createSupabaseServerClient(request);

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    // The keys "errors" and "defaultValues" are picked up automatically by useRemixForm
    return json({ errors, defaultValues, error: null });
  }

  const { error } = await supabaseClient.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return json({ success: false, error: error?.message }, { headers });
  }

  return redirect("/", { headers });
};

const SignIn = () => {
  const actionData = useActionData<typeof action>();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
  });

  return (
    <div className="h-screen">
      <div className="grid grid-cols-2 h-full">
        <div className=""></div>
        <div className="flex flex-col px-32 justify-center">
          <div className="my-10">
            <h4 className="text-2xl font-bold">Sign in to your account</h4>
            <>{actionData && <p>{actionData?.error}</p>}</>
          </div>
          <Form
            method="post"
            onSubmit={handleSubmit}
            className="grid grid-flow-row gap-4"
          >
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  label="Email"
                  {...field}
                  isRequired
                  isInvalid={!!errors.email?.message}
                  errorMessage={errors?.email?.message?.toString()}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  label="Password"
                  {...field}
                  isRequired
                  type="password"
                  isInvalid={!!errors.password?.message}
                  errorMessage={errors?.password?.message?.toString()}
                />
              )}
            />

            <Button size="lg" type="submit" className="w-full" color="primary">
              Sign In
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
