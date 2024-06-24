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
import { countries } from "~/utils/countries-json";
import { Company, Department, Entity } from "types";

export default function AddPersonProfile({
  entities,
  companies,
}: {
  entities: Entity[];
  companies: Company[];
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const matches = useMatches();

  // const foundData: any = matches.find(
  //   (match) => match.pathname === `/incidents/${incidentId}`
  // );

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button onPress={onOpen}>Add Person Involved</Button>
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
              // action={`/incidents/${incidentId}/add_person_involved`}
              method="post"
            >
              <ModalHeader className="flex flex-col gap-1">
                Person Involved
              </ModalHeader>
              <ModalBody>
                <input type="hidden" name="intent" value={"add_person"} />
                {/* <input type="hidden" name="incident_id" value={incidentId} /> */}
                <Input name="name" label="Name" size="sm" isRequired />

                <Input name="id_number" label="ID Number" size="sm" />
                <Select
                  name="nationality"
                  items={companies}
                  label="Company"
                  placeholder="Select a company"
                >
                  {(company) => (
                    <SelectItem key={company.id}>{company.name}</SelectItem>
                  )}
                </Select>
                <Select
                  items={entities}
                  label="Entities"
                  placeholder="Select an entity"
                  name="person_dept"
                  isRequired
                >
                  {(entity) => (
                    <SelectItem key={entity.id}>{entity.name}</SelectItem>
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
