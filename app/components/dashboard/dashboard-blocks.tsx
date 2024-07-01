import { Card } from "@nextui-org/react";
import React from "react";
import { Incident } from "types";

const DashboardBlocks = ({ incidents }: { incidents: Incident[] }) => {
  const totalIncidents = incidents.length;
  const resolvedIncidents = incidents.filter((incident) => {
    return incident.is_resolved === true;
  });

  const un_resolvedIncidents = incidents.filter((incident) => {
    return incident.is_resolved === false;
  });

  const usage = [
    {
      id: 1,
      resource: "TOTAL INCIDENTS",
      usage: totalIncidents,
      maximum: "1,000",
      href: "#",
    },
    {
      id: 2,
      resource: "UNRESOLVED INCIDENTS",
      usage: un_resolvedIncidents.length,
      maximum: "10 GB",
      href: "#",
    },
    {
      id: 3,
      resource: "RESOLVED INCIDENTS",
      usage: resolvedIncidents.length,
      maximum: "10 GB",
      href: "#",
    },
  ];

  return (
    <div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {usage.map((item) => (
          <Card
            shadow="none"
            key={item.id}
            radius="sm"
            className="p-4 border hover:bg-tremor-background-muted hover:dark:bg-dark-tremor-background-muted"
          >
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              <a href={item.href} className="focus:outline-none">
                {/* extend link to entire card */}
                <span
                  className="absolute inset-0 uppercase"
                  aria-hidden={true}
                />
                {item.resource}
              </a>
            </p>
            <p className="mt-3 flex items-end">
              <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {item.usage}
              </span>
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardBlocks;
