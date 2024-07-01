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
import { Company, Entity } from "types";

enum EmployeeType {
  INHOUSE = "INHOUSE",
  CONTRACTOR = "CONTRACTOR",
  OTHER = "OTHER",
}

enum Role {
  BASIC = "BASIC",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  SUPERVISOR = "SUPERVISOR",
}

export default function AddPersonProfile({
  entities,
  companies,
}: {
  entities: Entity[];
  companies: Company[];
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button variant="flat" color="primary" onPress={onOpen}>
          Add User Profile
        </Button>
      </div>
      <Modal
        isDismissable={false}
        size={"4xl"}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <Form
              action={`/settings/user-profiles/profile_action`}
              method="post"
            >
              <ModalHeader className="flex flex-col gap-1">
                Add User Profile
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-5">
                  <input type="hidden" name="intent" value={"add_person"} />
                  <Input name="name" label="Name" size="md" isRequired />
                  <Input
                    name="email"
                    type="email"
                    label="Email"
                    size="md"
                    isRequired
                  />
                  <Select
                    name="companyId"
                    items={companies}
                    label="Company"
                    placeholder="Select a company"
                  >
                    {(company) => (
                      <SelectItem key={company.id}>{company.name}</SelectItem>
                    )}
                  </Select>
                  <Input name="idNumber" label="ID Number" size="md" />
                  <Select
                    name="employeeType"
                    size="md"
                    label="Employee Type"
                    placeholder="Choose"
                    isRequired
                  >
                    {Object.values(EmployeeType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    items={entities}
                    label="Entities"
                    placeholder="Select an entity"
                    name="entityId"
                    isRequired
                  >
                    {(entity) => (
                      <SelectItem key={entity.id}>{entity.name}</SelectItem>
                    )}
                  </Select>
                  <Select
                    name="role"
                    size="md"
                    label="Role"
                    placeholder="Choose"
                    isRequired
                    // isInvalid={!!errors.severity?.message}
                    // errorMessage={errors?.severity?.message?.toString()}
                    // defaultSelectedKeys={[incident.severity]}
                  >
                    {Object.values(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button type="submit" color="primary" onPress={onClose}>
                  Add Profile
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
