import { LoaderFunctionArgs } from "@remix-run/node";
import fetch from "node-fetch";
import FormData from "form-data";
import { renderToStaticMarkup } from "react-dom/server";
import { DispatchTable } from "~/components";
import { useFetchIncidents } from "~/helpers/fetcher.server";
import { Entity, Incident } from "types";
import dayjs from "dayjs";
import i18nextServer from "~/modules/i18next.server";
import { useTranslation } from "react-i18next";
import { profileSessionData } from "~/sessions/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { active_profile } = await profileSessionData(request);
  const locale = await i18nextServer.getLocale(request);

  const url = new URL(request.url);
  let from = url.searchParams.get("from");
  let to = url.searchParams.get("to");
  let occupancy = url.searchParams.get("occupancy");
  let exclude_severity = url.searchParams.get("exclude");

  const { fetchIncidentsWithPeopleInvolved } = await useFetchIncidents(request);
  const incidents = await fetchIncidentsWithPeopleInvolved(from, to);
  const baseUrl = "http://localhost"; //TODO get from env

  //   const profileName = active_profile?.entities?.name || "profile";
  //   const pdfFilename = `${profileName}_DispatchReport_${dayjs().format(
  //     "lll"
  //   )}.pdf`;
  console.log({ occupancy });

  try {
    const htmlContent = renderToStaticMarkup(
      <DispatchReport
        {...{
          incidents: exclude_severity
            ? incidents.filter(
                (incident) =>
                  (incident.severity as unknown) !== exclude_severity
              )
            : incidents,
          entity: active_profile?.entities,
          occupancy: occupancy ?? "Unknown",
          from: from ?? "",
          to: to ?? "",
          title: exclude_severity ? "Summary" : "",
          locale,
        }}
      />
    );

    const footerHtmlContent = renderToStaticMarkup(<Footer />);

    const form = new FormData();
    form.append("files", Buffer.from(htmlContent), {
      contentType: "text/html",
      filename: "index.html",
    });
    form.append("files", Buffer.from(footerHtmlContent), {
      contentType: "text/html",
      filename: "footer.html",
    });
    form.append("landscape", "true");
    form.append("paperWidth", "11.7");
    form.append("paperHeight", "16.54");

    const response = await fetch(
      `${baseUrl}:3001/forms/chromium/convert/html`,
      { method: "POST", body: form, headers: form.getHeaders() }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error generating PDF: ${errorText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      //   "Content-Disposition": `attachment; filename="${pdfFilename}"`,
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    });
    return new Response(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response("Failed to generate PDF", { status: 500 });
  }
};

const DispatchReport = ({
  incidents,
  entity,
  occupancy,
  from = dayjs().startOf("day").toISOString(),
  to = dayjs().endOf("day").toISOString(),
  title,
  locale,
}: {
  incidents: Incident[];
  entity: Entity;
  occupancy: string;
  from: string;
  to: string;
  title: string;
  locale: string;
}) => {
  let { i18n } = useTranslation();

  return (
    <html lang={locale ?? "en"} dir={i18n.dir()}>
      <head>
        <title>Dispatch Report</title>
        <style>
          {`
          body {
            font-family: Arial, sans-serif;
          }
        `}
        </style>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com" />
      </head>
      <body>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1 mb-2">
              <h1 className="font-bold text-xl">
                {entity.name} - Dispatch {title} Report
              </h1>
              <div className="text-sm">
                From {dayjs(from).format("DD-MMM-YY HH:mm")} to{" "}
                {dayjs(to).format("DD-MMM-YY HH:mm")}
              </div>
            </div>
            <div className="text-sm">Occupancy: {occupancy}%</div>
          </div>
          <DispatchTable {...{ incidents }} />
        </div>
      </body>
    </html>
  );
};

const Footer = () => (
  <html>
    <head>
      <style>
        {`
          body {
            font-family: Arial, sans-serif;
            font-size: 8rem;
            max-width: 56rem; 
            margin-left: auto;
            margin-right: auto;
          }
        `}
      </style>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.tailwindcss.com" />
    </head>
    <body className="">
      <div className="max-w-4xl mx-auto">
        <span className="text-5xl">
          Page <span className="pageNumber"></span>
        </span>
      </div>
    </body>
  </html>
);
