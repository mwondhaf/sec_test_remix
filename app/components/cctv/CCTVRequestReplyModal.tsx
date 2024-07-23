import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Form, useParams } from "@remix-run/react";

enum Status {
  ONGOING = "ONGOING",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export default function CCTVRequestReplyModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const params = useParams();

  return (
    <>
      <Button onPress={onOpen} color="primary" variant="flat" size="sm">
        Reply
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
              <ModalHeader className="flex flex-col gap-1">Reply</ModalHeader>
              <ModalBody>
                <input type="hidden" name="id" value={params.cctvRequestId} />
                <Textarea
                  name="reply"
                  autoFocus
                  label="Reply"
                  placeholder="Enter reply"
                />
                <Select
                  name="status"
                  size="sm"
                  label="Status"
                  placeholder="Status"
                  isRequired
                  defaultSelectedKeys={[Status.COMPLETED]}
                >
                  {Object.values(Status).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose} type="submit">
                  Submit
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
