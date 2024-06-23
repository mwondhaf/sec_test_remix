import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardHeader,
  Button,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import { PersonInvolved } from "types";
import { TrashIcon } from "@radix-ui/react-icons";
import { Form, useParams } from "@remix-run/react";

export default function PeopleInvolvedList({
  people_involved,
}: {
  people_involved: PersonInvolved[];
}) {
  const { incidentId } = useParams();

  return (
    <div className="">
      <div className="grid grid-cols-2 text-sm gap-10 text-gray-600">
        {people_involved.map((person, index) => (
          <div key={index}>
            <Card className="max-w-[340px]" shadow="none">
              <CardHeader className="justify-between px-0">
                <div className="flex gap-5">
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      Name: {person.name}
                    </h4>
                    <h5 className="text-small tracking-tight text-default-400">
                      Department: {person.person_department.name}
                    </h5>
                    {person.nationality && (
                      <h5 className="text-small tracking-tight text-default-400">
                        Nationality: {person.nationality}
                      </h5>
                    )}
                    {person.id_number && (
                      <h5 className="text-small tracking-tight text-default-400">
                        ID No.: {person.id_number}
                      </h5>
                    )}
                  </div>
                </div>
                <Form
                  method="delete"
                  action={`/incidents/${incidentId}/add_person_involved`}
                >
                  <input type="hidden" name="person_id" value={person.id} />
                  <input type="hidden" name="incident_id" value={incidentId} />
                  <input name="intent" type="hidden" value={"delete_person"} />

                  <Button
                    color="warning"
                    radius="full"
                    size="sm"
                    variant={"light"}
                    isIconOnly
                    type="submit"
                  >
                    <TrashIcon />
                  </Button>
                </Form>
              </CardHeader>
              {person.remarks && (
                <CardBody className="px-1 py-0 text-small text-default-400">
                  <p>{person.remarks}</p>
                </CardBody>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
