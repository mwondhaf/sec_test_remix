import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { Link } from "@remix-run/react";
import { ChooseOption } from "~/components";

const reports = [
  {
    name: "Dispatch Report",
    description: "Security Dispatch report",
    link: "/reports/dispatch",
  },
  {
    name: "Dispatch Summary Report",
    description: "Dispatch Summary report",
    link: "/templates/dispatch",
  },
  {
    name: "Weekly Arabic Report",
    description: "Arabic Weekly report",
    link: "/templates/dispatch",
  },
  {
    name: "Weekly English Report",
    description: "English Weekly report",
    link: "/templates/dispatch",
  },
  {
    name: "Incident Statistics Report",
    description: "Incident Statistics report",
    link: "/templates/dispatch",
  },
];

const index = () => {
  return (
    <div className="p-4 h-full">
      <ChooseOption />
    </div>
  );
};

export default index;
