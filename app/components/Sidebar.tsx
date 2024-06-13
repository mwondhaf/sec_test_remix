import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { DotsVerticalIcon, ExitIcon } from "@radix-ui/react-icons";
import { Form, Link } from "@remix-run/react";
import React from "react";
import { Profile } from "types";

const Sidebar: React.FC<{ profile: Profile }> = ({ profile }) => {
  return (
    <div className="flex flex-col justify-between h-full p-5">
      <div className="">
        <div className="flex flex-col">
          <Link to="/">Dashboard</Link>
          <Link to="/incidents">Incidents</Link>
        </div>
      </div>
      <div className="">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <User name={profile.name} description={profile.entities.name} />
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="flat"
                  aria-label="Logout"
                  type="submit"
                >
                  <DotsVerticalIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="new">
                  <Link to="/settings">Incident Settings</Link>
                </DropdownItem>
                <DropdownItem key="delete" color="default">
                  <Form action="/sign-out" method="post">
                    <Button
                      className="w-full"
                      type="submit"
                      variant="light"
                      size="sm"
                    >
                      Logout
                    </Button>
                  </Form>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
