import { Card, CardBody, Divider } from "@nextui-org/react";
import { Link, useLocation, useMatches } from "@remix-run/react";
import clsx from "clsx";
import dayjs from "dayjs";
import React from "react";
import { Incident } from "types";

interface ListIncidentProps {
  incident: Incident;
}

const ListIncident: React.FC<ListIncidentProps> = ({ incident }) => {
  const location = useLocation();
  const matches = useMatches();

  const destination = location.search.includes("?")
    ? `/incidents/${incident.id}${location.search}`
    : `/incidents/${incident.id}`;

  const incident_time = dayjs(incident.incident_time).format(
    "DD-MM-YYYY HH:mm"
  );
  const currentlySelected = matches.some(
    (match) => match.pathname === `/incidents/${incident.id}`
  );

  return (
    <div>
      <Link to={destination}>
        <Card
          radius="none"
          shadow="none"
          className={clsx(
            "bg-transparent",
            incident.severity === ("Medium" as any) && "bg-orange-50",
            incident.severity === ("High" as any) && "bg-red-50",
            currentlySelected && "bg-sky-50"
          )}
        >
          <CardBody>
            <div className="">
              <div className="flex items-center justify-between">
                <p className="text-sm line-clamp-1 font-medium text-gray-600">
                  {incident?.category?.name}
                </p>
                <p className="text-tiny text-gray-400">{incident_time}</p>
              </div>
              <p className="text-xs line-clamp-2 text-gray-400">
                {incident.description}
              </p>
            </div>
          </CardBody>
        </Card>
      </Link>
      <Divider />
    </div>
  );
};

export default ListIncident;
