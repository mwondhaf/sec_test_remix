import React from "react";
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
import { IncidentType } from "types";

export default function CreateIncidentCategory({
  incident_types,
}: {
  incident_types: IncidentType[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>New Category</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <Form method="post" action="/settings/incident-types/incident-type">
              <ModalHeader className="flex flex-col gap-1">
                New Category
              </ModalHeader>
              <ModalBody>
                <Input name="name" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" onPress={onClose}>
                  Action
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
