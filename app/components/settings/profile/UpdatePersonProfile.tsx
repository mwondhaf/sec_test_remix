import { Time, parseAbsolute, parseTime } from "@internationalized/date";
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
  TimeInput,
} from "@nextui-org/react";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { useDateFormatter } from "@react-aria/i18n";
import { Form } from "@remix-run/react";
import React from "react";
import { Company, Entity, Profile } from "types";

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

enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export default function UpdatePersonProfile({
  entities,
  companies,
  profile,
}: {
  entities: Entity[];
  companies: Company[];
  profile: Profile;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [shiftStartTime, setShiftStartTime] = React.useState(
    parseTime(profile.shift_start!)
  );
  const [shiftEndTime, setShiftEndTime] = React.useState(
    parseTime(profile.shift_end!)
  );

  console.log(shiftStartTime.toString());

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          isIconOnly
          color="primary"
          radius="full"
          size="sm"
          variant={"flat"}
          onPress={onOpen}
        >
          <Pencil2Icon />
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
                Update User Profile
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-5">
                  <input type="hidden" name="intent" value={"update_person"} />
                  <input type="hidden" name="profile_id" value={profile.id} />

                  <Input
                    name="name"
                    defaultValue={profile.name}
                    label="Name"
                    size="md"
                    isRequired
                  />
                  <Input
                    name="email"
                    type="email"
                    label="Email"
                    size="md"
                    isRequired
                    defaultValue={profile.email}
                  />
                  <Select
                    name="companyId"
                    items={companies}
                    label="Company"
                    placeholder="Select a company"
                    defaultSelectedKeys={[profile.companyId!.toString()]}
                  >
                    {(company) => (
                      <SelectItem key={company.id}>{company.name}</SelectItem>
                    )}
                  </Select>
                  <Input
                    name="idNumber"
                    defaultValue={profile.idNumber}
                    label="ID Number"
                    size="md"
                  />
                  <Select
                    name="employeeType"
                    size="md"
                    label="Employee Type"
                    placeholder="Choose"
                    isRequired
                    defaultSelectedKeys={[profile.employeeType]}
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
                    defaultSelectedKeys={[profile.entityId.toString()]}
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
                    defaultSelectedKeys={[profile.role]}
                  >
                    {Object.values(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    name="status"
                    size="md"
                    label="Status"
                    placeholder="Status"
                    isRequired
                    defaultSelectedKeys={[
                      profile.isActive ? Status.ACTIVE : Status.INACTIVE,
                    ]}
                  >
                    {Object.values(Status).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </Select>
                  <TimeInput
                    name={"shift_start"}
                    label="Shift Start Time"
                    value={shiftStartTime}
                    onChange={setShiftStartTime}
                  />
                  <TimeInput
                    name={"shift_end"}
                    label="Shift End Time"
                    value={shiftEndTime}
                    onChange={setShiftEndTime}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button type="submit" color="primary" onPress={onClose}>
                  Update Profile
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
