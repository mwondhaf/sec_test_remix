import { ActionFunctionArgs, json } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  Form,
  redirect,
  useActionData,
  useLocation,
} from "@remix-run/react";
import { createSupabaseServerClient } from "~/supabase.server";
import * as zod from "zod";
import { signInSchema } from "~/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { Button, Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import i18next from "node_modules/i18next";
import { clearCategories } from "~/utils/cache/dexie-cache";

type FormData = zod.infer<typeof signInSchema>;
const resolver = zodResolver(signInSchema);

// clear data
export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  await clearCategories();
  return {};
};

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

  let { t } = useTranslation();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      email: "rem@mail.com",
      password: "password",
    },
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
            <h4 className="text-xl font-semibold">{t("sign_in_header")}</h4>
            <p className="text-sm text-gray-600">
              Use your email and password to access
            </p>
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
                  label={t("email")}
                  size="sm"
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
                  label={t("password")}
                  size="sm"
                  {...field}
                  isRequired
                  type="password"
                  isInvalid={!!errors.password?.message}
                  errorMessage={errors?.password?.message?.toString()}
                />
              )}
            />
            <div className="my-4">
              <Button type="submit" className="w-full" color="primary">
                {t("sign_in")}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
