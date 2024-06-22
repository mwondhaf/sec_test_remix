import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Form, useMatches, useParams } from "@remix-run/react";
import { Controller } from "react-hook-form";
import { countries } from "~/utils/countries-json";
import { useRemixForm } from "remix-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { personInvolvedSchema } from "~/form-schemas";
import { Department } from "types";
import { useRef } from "react";

type FormData = zod.infer<typeof personInvolvedSchema>;
const resolver = zodResolver(personInvolvedSchema);

export default function AddPeopleInvolvedModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const matches = useMatches();
  const { incidentId } = useParams();

  const foundData: any = matches.find(
    (match) => match.pathname === `/incidents/${incidentId}`
  );

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      incident_id: Number(incidentId),
      //   severity: Severity.Low,
    },
  });

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button onPress={onOpen}>Add People Involved</Button>
      </div>
      <Modal
        isDismissable={false}
        size={"md"}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <Form
              // ref={formRef}
              action="/incidents/add_person_involved"
              // onSubmit={handleSubmit}
              method="post"
            >
              <ModalHeader className="flex flex-col gap-1">
                Person Involved
              </ModalHeader>
              <ModalBody>
                <input type="hidden" name="intent" value={"add_person"} />
                <input type="hidden" name="incident_id" value={incidentId} />
                <Input name="name" label="Name" size="sm" isRequired />

                <Input name="id_number" label="ID Number" size="sm" />

                <Select
                  items={foundData?.data?.departments as Department[]}
                  label="Person Department"
                  placeholder="Select a department"
                  name="person_dept"
                  isRequired
                >
                  {(department) => (
                    <SelectItem key={department.id}>
                      {department.name}
                    </SelectItem>
                  )}
                </Select>

                <Select
                  name="nationality"
                  items={countries}
                  label="Nationality"
                  placeholder="Select a country"
                >
                  {(country) => (
                    <SelectItem key={country.code}>{country.name}</SelectItem>
                  )}
                </Select>
                <Input name="remarks" label="Remarks" size="sm" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button type="submit" color="primary" onPress={onClose}>
                  Add
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
