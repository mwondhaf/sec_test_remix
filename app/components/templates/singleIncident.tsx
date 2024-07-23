// app/components/SingleIncidentPdf.tsx
import { Divider } from "@nextui-org/react";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Incident } from "types";
import { loader } from "~/root";

const sampleIncident = {
  id: 72,
  created_at: "2024-06-28T12:11:37.561109+00:00",
  description:
    "Late, but I figured I would show how I handle something similar to this. Once my option hits the mongo db the value is set as a boolean, but before the page is refreshed redux stores the option as a string, so added a check for the string to show the change in the meantime. Late, but I figured I would show how I handle something similar to this. Once my option hits the mongo db the value is set as a boolean, but before the page is refreshed redux stores the option as a string, so added a check for the string to show the change in the meantime.Late, but I figured I would show how I handle something similar to this. Once my option hits the mongo db the value is set as a boolean, but before the page is refreshed redux stores the option as a string, so added a check for the string to show the change in the meantime.Late, but I figured I would show how I handle something similar to this. Once my option hits the mongo db the value is set as a boolean, but before the page is refreshed redux stores the option as a string, so added a check for the string to show the change in the meantime.",
  incident_time: "2024-06-28T12:05:01+00:00",
  entity_id: 1,
  category_id: 2,
  reporter_name: "Franka",
  reporter_dept: 9,
  compiler_id: "9f3fa443-f42c-4767-8f1e-6c53f170ef93",
  editor_id: "9f3fa443-f42c-4767-8f1e-6c53f170ef93",
  incident_close_time: "2024-06-28T12:05:01+00:00",
  severity: "Low",
  action:
    "Late, but I figured I would show how I handle something similar to this. Once my option hits the mongo db the value is set as a boolean, but before the page is refreshed redux stores the option as a string, so added a check for the string to show the change in the meantime.Late, but I figured I would show how I handle something similar to this. Once my option hits the mongo db the value is set as a boolean, but before the page is refreshed redux stores the option as a string, so added a check for the string to show the change in the meantime.Late, but I figured I would show how I handle something similar to this. Once my option hits the mongo db the value is set as a boolean, but before the page is refreshed redux stores the option as a string, so added a check for the string to show the change in the meantime.Late, but I figured I would show how I handle something similar to this. Once my option hits the mongo db the value is set as a boolean, but before the page is refreshed redux stores the option as a string, so added a check for the string to show the change in the meantime.Late, but I figured I would show how I handle something similar to this. Once my option hits the mongo db the value is set as a boolean, but before the page is refreshed redux stores the option as a string, so added a check for the string to show the change in the meantime.Late, but I figured I would show how I handle something similar to this. Once my option hits the mongo db the value is set as a boolean, but before the page is refreshed redux stores the option as a string, so added a check for the string to show the change in the meantime.Late, but I figured I would show how I handle something similar to this. Once my option hits the mongo db the value is set as a boolean, but before the page is refreshed redux stores the option as a string, so added a check for the string to show the change in the meantime.",
  incident_location: "208",
  updated_at: "2024-06-30T07:35:13.458+00:00",
  is_resolved: true,
  category: {
    name: "Smoking",
  },
};

const SingleIncidentPdf: React.FC<{ incident: Incident; locale?: string }> = ({
  incident = sampleIncident,
  locale,
}) => {
  let { i18n } = useTranslation();

  return (
    <html lang={locale ?? "en"} dir={i18n.dir()}>
      <head>
        <title>{incident.id}</title>
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-center  text-md font-bold text-gray-700">
            Dispatch Report for Incident {incident.id}
          </h1>
          <hr className="my-4" />

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <h3 className="font-semibold text-gray-700 text-sm">
                Reported By:{" "}
                <span className="text-gray-600 text-sm font-normal">
                  {incident.reporter_name}
                </span>
              </h3>
              <p className="text-gray-600 text-sm">
                {/* @ts-ignore  */}
                {incident.reporter_department?.name}Housekeeping
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 text-sm">
                Date of Report
              </h3>
              <p className="text-gray-600 text-sm">{incident.created_at}</p>
              <h3 className="font-semibold text-sm text-gray-700 mt-4">
                Incident Number
              </h3>
              <p className="text-gray-600 text-sm">{incident.id}</p>
            </div>
          </div>

          <h2 className="text-center bg-gray-700 text-xl font-semibold text-white mb-6">
            Incident Information
          </h2>

          <div className="grid grid-cols-2 gap-2 mb-8">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Incident Category
              </label>
              <p className="border-gray-300  text-gray-600 text-sm">
                {incident.category?.name}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Date of Incident
              </label>
              <p className="border-gray-300  text-gray-600 text-sm">
                {incident.incident_time}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Incident Location
              </label>
              <p className="border-gray-300  text-gray-600 text-sm">
                {incident.incident_location}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Severity of Incident
              </label>
              <p className="border-gray-300  text-gray-600 text-sm">
                {incident.severity}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Incident Description
            </label>
            <p className="border-gray-300 text-justify py-4 text-gray-600 text-sm">
              {incident.description}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Actions Taken
            </label>
            <p className="border-gray-300 text-justify py-4 text-gray-600 text-sm">
              {incident.action}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default SingleIncidentPdf;
