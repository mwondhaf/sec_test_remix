import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetchIncidents } from "~/helpers/fetcher.server";
import {
  Link,
  useLoaderData,
  useLocation,
  useSearchParams,
} from "@remix-run/react";
import {
  Button,
  DateRangePicker,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React from "react";
import {
  getLocalTimeZone,
  now,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import { profileSessionData } from "~/sessions/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { active_profile } = await profileSessionData(request);

  const { fetchIncidentsWithPeopleInvolved } = await useFetchIncidents(request);
  const incidents = await fetchIncidentsWithPeopleInvolved();

  return json({ incidents, entity: active_profile?.entities }, 200);
};

enum Severity {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

const DispatchReport = () => {
  const { incidents, entity } = useLoaderData<typeof loader>();
  let date = new Date();
  const [value, setValue] = React.useState({
    start: parseAbsoluteToLocal(
      new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
    ),
    end: parseAbsoluteToLocal(new Date().toISOString()),
  });

  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="">
      <div className="pb-6">
        <h3 className="text-xl font-normal text-primary-400">
          Report Requirements
        </h3>
        <p className="text-primary-700 text-sm">
          Fill below before generating the report
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="">
          <DateRangePicker
            label="Time Period"
            hideTimeZone
            visibleMonths={1}
            value={value}
            onChange={(value) => {
              setValue(value);
              setSearchParams((prev) => {
                prev.set("from", value.start.toAbsoluteString());
                prev.set("to", value.end.toAbsoluteString());
                return prev;
              });
            }}
            defaultValue={null}
            maxValue={now(getLocalTimeZone())}
          />
        </div>

        <div className="">
          <Input
            label="Entity Occupancy (%)"
            type="number"
            onChange={(e) => {
              setSearchParams((prev) => {
                prev.set("occupancy", e.target.value);
                return prev;
              });
            }}
          />
        </div>
        <div className="">
          <Select
            label="Exclude Severity (Optional)"
            placeholder="Select severity"
            onChange={(e) => {
              setSearchParams((prev) => {
                prev.set("exclude", e.target.value);
                return prev;
              });
            }}
          >
            {Object.values(Severity).map((severity) => (
              <SelectItem key={severity} value={severity}>
                {severity}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="my-8">
        <Button
          as={Link}
          to={`/templates/dispatch${location.search}`}
          target="_blank"
          size="lg"
          variant="flat"
          color="primary"
        >
          Generate Report
        </Button>
      </div>
    </div>
  );
};

export default DispatchReport;
