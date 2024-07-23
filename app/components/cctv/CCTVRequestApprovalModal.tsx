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
import { Form, useParams } from "@remix-run/react";
import { Mail } from "lucide-react";

export default function CCTVRequestApprovalModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const params = useParams();

  return (
    <>
      <Button onPress={onOpen} color="secondary" variant="flat" size="sm">
        Request Approval
      </Button>
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <Form method="post" action="/cctv/cctv_actions">
              <ModalHeader className="flex flex-col gap-1">
                Request Approval
              </ModalHeader>
              <ModalBody>
                <input type="hidden" name="intent" value="approval" />
                <input type="hidden" name="id" value={params.cctvRequestId} />
                <Input
                  startContent={<Mail size={16} />}
                  name="approver_email"
                  autoFocus
                  label="Approver Email"
                  size="sm"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose} type="submit">
                  Send Request
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
