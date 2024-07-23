import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import { Outlet } from "@remix-run/react";
import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const reports = [
  {
    name: "Dispatch & Summary Report",
    description: "Security Dispatch report",
    link: "/reports/dispatch",
  },
  {
    name: "Weekly Arabic Report",
    description: "Arabic Weekly report",
    link: "/reports/coming_soon",
  },
  {
    name: "Weekly English Report",
    description: "English Weekly report",
    link: "/reports/coming_soon",
  },
  {
    name: "Incident Statistics Report",
    description: "Incident Statistics report",
    link: "/reports/coming_soon",
  },
];

const _layout = () => {
  return (
    <div className="grid grid-cols-3 max-h-screen min-h-screen">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="col-span-2 border-l rtl:border-r p-4">
        <Outlet />
      </div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="">
      <div className="p-4">
        <h3 className="text-2xl font-bold text-primary-400">Reports</h3>
        <p className="text-primary-700 text-sm">
          Generate reports from incidents
        </p>
      </div>
      <div className="my-4">
        {reports.map((report) => (
          <Button
            as={Link}
            to={report.link}
            size="md"
            variant="light"
            className="w-full text-gray-600 px-4 rounded-none flex justify-between"
            endContent={<ChevronRight size={16} />}
          >
            {report.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default _layout;
