import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Incident, Severity } from "types";
import clsx from "clsx";
import dayjs from "dayjs";

export default function DispatchTable({
  incidents,
}: {
  incidents: Incident[];
}) {
  const tableColumns = [
    { name: "Time" },
    { name: "ID" },
    { name: "Reporter" },
    { name: "Category" },
    { name: "Description" },
    { name: "Compiler" },
    { name: "Action Taken" },
    { name: "Severity" },
    { name: "Closed" },
    { name: "Status" },
  ];

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500"],
      td: [
        // changing the rows border radius
        // first
        // "group-data-[first=true]:first:before:rounded-none",
        // "group-data-[first=true]:last:before:rounded-none",
        // middle
        // "group-data-[middle=true]:before:rounded-none",
        // last
        // "group-data-[last=true]:first:before:rounded-none",
        // "group-data-[last=true]:last:before:rounded-none",
        "border",
      ],
      tr: ["group", "border"],
    }),
    []
  );

  return (
    <Table
      radius="none"
      shadow="none"
      aria-label="Example static collection table"
      isStriped
      removeWrapper
      classNames={classNames}
    >
      {/* serial, time, reporter&dept, category, description, compiler, action,severity, time_closed, status */}

      <TableHeader>
        {tableColumns.map((column, index) => (
          <TableColumn className="text-sm" key={index}>
            {column.name}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {incidents.map((incident) => (
          <TableRow
            key={incident.id}
            className={clsx(
              "text-sm",
              (incident.severity as unknown) === "Medium"
                ? "bg-orange-400"
                : (incident.severity as unknown) === "High"
                ? "bg-red-400"
                : "bg-none"
            )}
          >
            <TableCell>
              {dayjs(incident.incident_time).format("HH:mm")}
            </TableCell>
            <TableCell>{incident.id}</TableCell>
            <TableCell>
              {incident.reporter_name}/ {incident.reporter_department?.name}
            </TableCell>
            <TableCell>{incident.category?.name}</TableCell>
            <TableCell>{incident.description}</TableCell>
            <TableCell>{incident.compiler?.name}</TableCell>
            <TableCell>
              <div className="space-y-2">
                <p>{incident.action}</p>
                {incident.people_involved!.length > 0 && (
                  <>
                    <h5 className="font-bold">People Involved</h5>
                    {incident.people_involved?.map((person) => (
                      <div className="flex gap-5">
                        <div className="flex flex-col gap-1 items-start justify-center">
                          <h4 className="text-small leading-none">
                            Name: {person.name}
                          </h4>
                          <h5 className="text-small tracking-tight">
                            Department: {person.person_department.name}
                          </h5>
                          {person.nationality && (
                            <h5 className="text-small tracking-tight">
                              Nationality: {person.nationality}
                            </h5>
                          )}
                          {person.id_number && (
                            <h5 className="text-small tracking-tight">
                              ID No.: {person.id_number}
                            </h5>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </TableCell>
            <TableCell>{incident.severity}</TableCell>
            <TableCell>
              {dayjs(incident.incident_close_time).format("HH:mm")}
            </TableCell>
            <TableCell>{!incident.is_resolved ? "Pending" : ""}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
