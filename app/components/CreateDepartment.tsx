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
import { Form, useFetcher } from "@remix-run/react";

export default function CreateDepartment() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetcher = useFetcher();
  return (
    <>
      <Button onPress={onOpen}>New Department</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <fetcher.Form method="post">
              <ModalHeader className="flex flex-col gap-1">
                Create Department
              </ModalHeader>
              <ModalBody>
                <Input name="name" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" onPress={onClose}>
                  Create
                </Button>
              </ModalFooter>
              <input type="hidden" name="intent" value={"create_dept"} />
            </fetcher.Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
