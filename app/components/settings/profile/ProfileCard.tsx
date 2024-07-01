import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@nextui-org/react";
import React from "react";
import { Company, Entity, Profile } from "types";
import UpdatePersonProfile from "./UpdatePersonProfile";
import { TrashIcon } from "@radix-ui/react-icons";
import { shiftStandAndStop } from "~/utils/shift_checker";
import { Form } from "@remix-run/react";

interface ProfileCardProps {
  profile: Profile;
  entities: Entity[];
  companies: Company[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  entities,
  companies,
}) => {
  const { shiftStart, shiftEnd } = shiftStandAndStop(
    profile.shift_start!,
    profile.shift_end!
  );
  return (
    <>
      <Card className="pb-3 border" shadow="none">
        <CardHeader className="justify-between">
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">
                {profile.name}
              </h4>
              <h5 className="text-small tracking-tight text-default-400">
                {profile.email}
              </h5>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UpdatePersonProfile {...{ profile, entities, companies }} />
            <Form
              action={`/settings/user-profiles/profile_action`}
              method="post"
            >
              <input type="hidden" name="profile_id" value={profile.id} />
              <input type="hidden" name="intent" value="delete_person" />
              <Button
                isIconOnly
                color="danger"
                radius="full"
                size="sm"
                variant={"flat"}
                type="submit"
              >
                <TrashIcon />
              </Button>
            </Form>
          </div>
        </CardHeader>
        <CardBody className="p-3 space-y-1 py-0 text-small text-default-400">
          <p className="text-tiny">
            Type: <span>{profile.employeeType}</span>
          </p>
          <p className="text-tiny">
            Company:{" "}
            <span>
              {profile.company?.name}/ {profile?.entity?.code}
            </span>
          </p>
          <p className="text-tiny">
            ID: <span>{profile.idNumber}</span>
          </p>
          <p className="text-tiny">
            Role: <span>{profile.role}</span>
          </p>
          <p className="text-tiny text-teal-700">
            Shift:{" "}
            <span>
              {shiftStart} to {shiftEnd}hrs
            </span>
          </p>
          <Chip
            className="capitalize"
            //   @ts-ignore
            color={profile.isActive ? "success" : "default"}
            size="sm"
            variant="flat"
          >
            {profile.isActive ? "Active" : "Inactive"}
          </Chip>
        </CardBody>
      </Card>
    </>
  );
};

export default ProfileCard;
