import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, redirect, useActionData } from "@remix-run/react";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { Button, Input, Link as NextLink } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import i18next from "node_modules/i18next";
import { errSession } from "~/flash.session";
import { supabaseClient } from "~/services/supabase-auth.server";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("token_hash");
  const erSession = await errSession.getSession(request.headers.get("Cookie"));

  if (code) {
    const { error } = await supabaseClient.auth.verifyOtp({
      token_hash: code,
      type: "email",
    });

    if (error) {
      erSession.flash("error", error.status!.toString());
      return redirect("/sign-in", {
        headers: {
          "Set-Cookie": await errSession.commitSession(erSession),
        },
      });
    }

    return {};
  }
  return redirect("/sign-in");
};

const resetSchema = zod
  .object({
    password: zod
      .string()
      .min(6, { message: "Must be 6 or more characters long" }),
    repeat_password: zod
      .string()
      .min(6, { message: "Must be 6 or more characters long" }),
  })
  .refine((data) => data.password === data.repeat_password, {
    message: "Passwords do not match",
    path: ["repeat_password"], // path of error
  });

type FormData = zod.infer<typeof resetSchema>;
const resolver = zodResolver(resetSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
  // const { supabaseClient, headers } = createSupabaseServerClient(request);
  const url = new URL(request.url);
  const token = url.searchParams.get("token_hash") as string;

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    // The keys "errors" and "defaultValues" are picked up automatically by useRemixForm
    return json({ errors, defaultValues, error: null });
  }

  const { data: updateData, error } = await supabaseClient.auth.updateUser({
    password: data.password,
  });

  if (error) {
    return json({ success: false, error: error?.message });
  }

  return redirect("/sign-in");
};

const UpdatePassword = () => {
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
            <h4 className="text-xl font-semibold">Update Password</h4>
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
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  label={t("password")}
                  size="sm"
                  {...field}
                  isRequired
                  isInvalid={!!errors.password?.message}
                  errorMessage={errors?.password?.message?.toString()}
                />
              )}
            />
            <Controller
              name="repeat_password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  label={t("repeat_password")}
                  size="sm"
                  {...field}
                  isRequired
                  isInvalid={!!errors.repeat_password?.message}
                  errorMessage={errors?.repeat_password?.message?.toString()}
                />
              )}
            />
            <div className="my-4">
              <Button type="submit" className="w-full" color="primary">
                Update Password
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

export default UpdatePassword;
