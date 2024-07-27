import { ActionFunctionArgs, json } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  Form,
  Link,
  redirect,
  useActionData,
} from "@remix-run/react";
import { createSupabaseServerClient } from "~/supabase.server";
import * as zod from "zod";
import { signInSchema } from "~/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { Button, Input, Link as NextLink } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import i18next from "node_modules/i18next";
import { supabaseClient } from "~/services/supabase-auth.server";

const pickedSchema = signInSchema.pick({ email: true });

type FormData = zod.infer<typeof pickedSchema>;
const resolver = zodResolver(pickedSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
  // const { supabaseClient, headers } = createSupabaseServerClient(request);

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    // The keys "errors" and "defaultValues" are picked up automatically by useRemixForm
    return json({ errors, defaultValues, error: null });
  }

  const { data: resetData, error } =
    await supabaseClient.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.BASE_URL}/update-password`,
    });

  // const { error } = await supabaseClient.auth.signInWithOtp({
  //   email: data.email,
  //   options: {
  //     emailRedirectTo: `${process.env.BASE_URL}/update-password`,
  //   },
  // });

  if (error) {
    return json({ success: false, error: error?.message });
  }

  return redirect("/sign-in");
};

const ForgotPassword = () => {
  const actionData = useActionData<typeof action>();

  let { t } = useTranslation();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
  });

  const changeLanguage = (lng: string) => {
    i18next.changeLanguage(lng);
  };

  return (
    <div className="h-screen pb-10">
      <div className="w-full bg-primary-600 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className=" text-white font-semibold">
            Security Management System
          </h1>
          <div className="">
            <Form className="flex gap-1">
              <Button
                radius="full"
                size="sm"
                type="submit"
                name="lng"
                value="en"
                variant="flat"
              >
                English
              </Button>
              <Button
                size="sm"
                radius="full"
                type="submit"
                name="lng"
                value="ar"
                variant="flat"
              >
                العربية
              </Button>
            </Form>
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col px-32 justify-center">
          <div className="mb-6 mt-32 space-y-2">
            <h4 className="text-xl font-semibold">Reset Password</h4>
            <p className="text-sm text-gray-600">
              Enter your email to reset password
            </p>
            <>
              {actionData && (
                <p className="text-red-500 text-sm">{actionData?.error}</p>
              )}
            </>
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
                  label={t("email")}
                  size="sm"
                  {...field}
                  isRequired
                  isInvalid={!!errors.email?.message}
                  errorMessage={errors?.email?.message?.toString()}
                />
              )}
            />
            <div className="my-4">
              <Button type="submit" className="w-full" color="primary">
                Reset Password
              </Button>
            </div>
            <div className="flex justify-center items-center">
              <NextLink as={Link} to="/sign-in" className="text-xs">
                Sign In
              </NextLink>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
