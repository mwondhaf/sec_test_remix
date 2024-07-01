import { Card } from "@nextui-org/react";
import { BarList } from "@tremor/react";
import { Incident, IncidentType } from "types";

export function IncidentTypesBar({
  incidents,
  incident_types,
}: {
  incidents: Incident[];
  incident_types: IncidentType[];
}) {
  const types_incidents = incident_types.map((type) => {
    return {
      name: `${type.name}`,
      value: incidents.filter(
        (incident) => incident.incident_type_id.incident_type_id === type.id
      ).length,
    };
  });

  return (
    <>
      <Card shadow="none" className="p-4 h-full border">
        <div className="flex items-center justify-between  dark:border-dark-tremor-border">
          <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Incident Type
          </p>
          <p className="text-tremor-label font-medium uppercase text-tremor-content dark:text-dark-tremor-content">
            {/* Visitors */}
          </p>
        </div>
        <div className={`overflow-hidden pb-6 pt-2`}>
          <BarList data={types_incidents} />
        </div>

        {/* <div
          className={`flex justify-center ${
            extended
              ? "px-6 pb-6"
              : "absolute inset-x-0 bottom-0 rounded-b-tremor-default bg-gradient-to-t from-tremor-background to-transparent py-7 dark:from-dark-tremor-background"
          }`}
        >
          <button
            className="flex items-center justify-center rounded-tremor-small border border-tremor-border bg-tremor-background px-2.5 py-2 text-tremor-default font-medium text-tremor-content-strong shadow-tremor-input hover:bg-tremor-background-muted dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-content-strong dark:shadow-dark-tremor-input hover:dark:bg-dark-tremor-background-muted"
            onClick={() => setExtended(!extended)}
          >
            {extended ? "Show less" : "Show more"}
          </button>
        </div> */}
      </Card>
    </>
  );
}
