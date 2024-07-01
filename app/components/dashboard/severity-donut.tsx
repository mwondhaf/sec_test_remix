import { Card, Chip } from "@nextui-org/react";
import { Doughnut } from "react-chartjs-2";
import { Incident } from "types";

export default function SeverityDonut({
  incidents,
}: {
  incidents: Incident[];
}) {
  const high_incidents = incidents.filter(
    (incident) => incident.severity.toString() === "High"
  );
  const medium_incidents = incidents.filter(
    (incident) => incident.severity.toString() === "Medium"
  );
  const low_incidents = incidents.filter(
    (incident) => incident.severity.toString() === "Low"
  );

  const data = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "# of Incidents",
        data: [
          high_incidents.length,
          medium_incidents.length,
          low_incidents.length,
        ],
        backgroundColor: [
          "rgba(249, 52, 94, 0.829)",
          "rgba(255, 207, 86, 0.835)",
          "rgba(201, 201, 201, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Card className="border p-4" shadow="none">
        <h3 className="pb-2 font-medium">Incidents by Severity</h3>
        <div className="flex items-center">
          <div className="">
            <Doughnut
              //   options={...}
              //   data={...}
              //   {...props}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                // cutout: "50%",
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
              data={data}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="w-56 rounded-md  bg-tremor-background p-2 ">
              <div className="flex flex-1 space-x-2.5">
                <div className={`flex w-1 flex-col bg-red-500 rounded`} />
                <div className="space-y-1">
                  <p className="text-sm">High</p>
                  <p className="font-medium text-sm">{high_incidents.length}</p>
                </div>
              </div>
            </div>
            <div className="w-56 rounded-md  bg-tremor-background p-2 ">
              <div className="flex flex-1 space-x-2.5">
                <div className={`flex w-1 flex-col bg-orange-400 rounded`} />
                <div className="space-y-1">
                  <p className="text-sm">Medium</p>
                  <p className="font-medium text-sm">
                    {medium_incidents.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-56 rounded-md  bg-tremor-background p-2 ">
              <div className="flex flex-1 space-x-2.5">
                <div className={`flex w-1 flex-col bg-gray-200 rounded`} />
                <div className="space-y-1">
                  <p className="text-sm">Low</p>
                  <p className="font-medium text-sm">{low_incidents.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
