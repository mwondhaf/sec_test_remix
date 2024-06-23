import {
  ClientLoaderFunctionArgs,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { NextUIProvider, Progress } from "@nextui-org/react";
import { errSession } from "./flash.session";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await errSession.getSession(request.headers.get("Cookie"));

  const data = { error: session.get("error"), success: session.get("success") };

  return json(data, {
    headers: {
      "Set-Cookie": await errSession.commitSession(session),
    },
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();

  const data = useLoaderData<typeof loader>();
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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider>
          {/* {navigation.state === "loading" && ( */}
          <Progress
            size="sm"
            isIndeterminate={navigation.state !== "loading" ? false : true}
            aria-label="Loading..."
            className="max-w-full"
          />
          {/* )} */}
          {children}
          <ToastContainer />
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
