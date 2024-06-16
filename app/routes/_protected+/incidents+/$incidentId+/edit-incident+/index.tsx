import { LoaderFunctionArgs } from "@remix-run/node";
import React from "react";

export async function loader({ params }: LoaderFunctionArgs) {
  console.log({ params });

  return null;
}

const EditIncident = () => {
  return <div>EditIncident</div>;
};

export default EditIncident;
