import { LoaderFunctionArgs } from "@remix-run/node";
import fetch from "node-fetch";
import FormData from "form-data";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    // Get the URL to convert from the query parameters
    const urlToConvert = new URL(request.url).searchParams.get("url");
    if (!urlToConvert) {
      throw new Error("URL parameter is missing");
    }

    // Log the URL being converted
    console.log(`Converting URL to PDF: ${urlToConvert}`);

    // Create form data
    const form = new FormData();
    form.append("url", urlToConvert);

    // Send a request to Gotenberg to convert the URL to PDF
    const response = await fetch(
      "http://0.0.0.0:3001/forms/chromium/convert/url",
      {
        method: "POST",
        body: form,
        headers: form.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Error generating PDF: ${response.statusText}`);
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
