import { BarChart, EventProps } from "@tremor/react";
import { useState } from "react";
import { Incident, IncidentType } from "types";

export function CategoryGraph({
  incidents,
  categories,
}: {
  incidents: Incident[];
  categories: IncidentType[];
}) {
  const data = categories.map((category) => {
    const incidents_total = incidents.filter(
      (incident) => incident.category_id === category.id
    ).length;

    return {
      name: category.name,
      Count: incidents_total,
    };
  });

  return (
    <>
      <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Incidents by Category
      </h3>
      <BarChart
        className="mt-6"
        data={data.filter((i) => i.Count > 0)}
        index="name"
        categories={["Count"]}
        colors={["blue-400"]}
        yAxisWidth={40}
      />
    </>
  );
}
