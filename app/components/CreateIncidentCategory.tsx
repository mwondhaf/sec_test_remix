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
import { Form } from "@remix-run/react";
import { IncidentType } from "types";

export default function CreateIncidentCategory({
  incident_types,
}: {
  incident_types: IncidentType[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button color="default" variant="flat" onPress={onOpen}>
        New Category
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <Form
              method="post"
              action="/settings/incident-types/incident-category"
            >
              <ModalHeader className="flex flex-col gap-1">
                New Category
              </ModalHeader>
              <ModalBody>
                <Select
                  items={incident_types}
                  label="Incident Type"
                  placeholder="Select a type"
                  name={"type_id"}
                >
                  {(incident_type) => (
                    <SelectItem key={incident_type.id}>
                      {incident_type.name}
                    </SelectItem>
                  )}
                </Select>
                <Input name="name" label="Category Name" />
                <input type="hidden" name="action" value="create" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" onPress={onClose}>
                  Create
                </Button>
              </ModalFooter>
              <input type="hidden" name="_action" value={"create_type"} />
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
