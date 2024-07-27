import { LoaderFunctionArgs } from "@remix-run/node";
import fetch from "node-fetch";
import FormData from "form-data";
import { renderToStaticMarkup } from "react-dom/server";
import { Footer, Header, SingleIncidentPdf } from "~/components";
import { createSupabaseServerClient } from "~/supabase.server";
import i18nextServer from "~/modules/i18next.server";
import { supabaseClient } from "~/services/supabase-auth.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const locale = await i18nextServer.getLocale(request);

  const baseUrl = "http://localhost"; //TODO get from env
  // const { supabaseClient } = createSupabaseServerClient(request);

  const url = new URL(request.url);
  const incidentId = url.searchParams.get("id");

  const { data: incident, error } = await supabaseClient
    .from("incidents")
    .select("*, category:incident_categories!incidents_category_id_fkey(name)")
    .eq("id", incidentId)
    .single();

  if (error) {
    throw new Error("Incident not found");
  }

  try {
    // Render the React component to static HTML
    const htmlContent = renderToStaticMarkup(
      <SingleIncidentPdf incident={incident} locale={locale} />
    );

    const footerHtmlContent = renderToStaticMarkup(<Footer />);
    const headerHtmlContent = renderToStaticMarkup(<Header />);

    // Create form data and append the HTML content
    const form = new FormData();
    form.append("files", Buffer.from(htmlContent), {
      contentType: "text/html",
      filename: "index.html",
    });

    form.append("files", Buffer.from(footerHtmlContent), {
      contentType: "text/html",
      filename: "footer.html",
    });
    form.append("files", Buffer.from(headerHtmlContent), {
      contentType: "text/html",
      filename: "header.html",
    });
    form.append("marginTop", "0.8");
    form.append("paperWidth", "8.27");
    form.append("paperHeight", "11.7");

    // Send a request to Gotenberg to convert the HTML to PDF
    const response = await fetch(
      `${baseUrl}:3001/forms/chromium/convert/html`,
      {
        method: "POST",
        body: form,
        headers: form.getHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error generating PDF: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create the response with the PDF content
    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    });

    return new Response(buffer, { status: 200, headers });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response("Failed to generate PDF", { status: 500 });
  }
};
