import { LoaderFunctionArgs, json } from "@remix-run/node";
import React from "react";
import { useLoaderData } from "react-router";

interface DetailedIncidentProps {}

export const loader = ({ request, params }: LoaderFunctionArgs) => {
  const { incidentId } = params;
  return json({ incidentId });
};

const DetailedIncident: React.FC<DetailedIncidentProps> = (props) => {
  return <>Detailed </>;
};

export default DetailedIncident;
