import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { Form } from "@remix-run/react";

export default function CreateIncidentType() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} variant="flat" color="primary">
        New Incident Type
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <Form method="post" action="/settings/incident-types/incident-type">
              <ModalHeader className="flex flex-col gap-1">
                Create Incident Type
              </ModalHeader>
              <ModalBody>
                <Input name="name" label="Type Name" />
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
