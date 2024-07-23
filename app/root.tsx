import {
  ClientLoaderFunctionArgs,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useLocation,
  useNavigation,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { NextUIProvider, Progress } from "@nextui-org/react";
import { errSession } from "./flash.session";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import i18next, { localeCookie } from "./modules/i18next.server";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next/react";
import "@fontsource-variable/inter";
// import "@fontsource/fira-sans";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let locale = await i18next.getLocale(request);
  const session = await errSession.getSession(request.headers.get("Cookie"));

  const data = { error: session.get("error"), success: session.get("success") };

  const headers = new Headers();
  headers.append("Set-Cookie", await localeCookie.serialize(locale));
  headers.append("Set-Cookie", await errSession.commitSession(session));

  return json(
    { ...data, locale },
    {
      headers,
    }
  );
};

export let handle = {
  i18n: "common",
};

export function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();
  const location = useLocation();

  const data = useLoaderData<typeof loader>();

  let { i18n } = useTranslation();

  useEffect(() => {
    if (data && data?.error) {
      toast.error(data.error, {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    if (data && data?.success) {
      toast.success(data.success, {
        position: "bottom-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [data]);

  return (
    <html lang={data?.locale ?? "en"} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider>
          {location.pathname !== "/sign-in" && (
            <>
              <Progress
                size="sm"
                isIndeterminate={navigation.state !== "loading" ? false : true}
                aria-label="Loading..."
                className="max-w-full"
              />
            </>
          )}
          <div className="max-w-7xl mx-auto md:max-w-full ">
            {children}
            <ToastContainer />
          </div>
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  );
}

export default function App() {
  const { locale } = useLoaderData<typeof loader>();
  useChangeLanguage(locale);
  return <Outlet />;
}
