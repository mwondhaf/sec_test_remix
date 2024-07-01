import { Button } from "@nextui-org/react";
import { Link, Outlet } from "@remix-run/react";
import React from "react";

const _layout = () => {
  return (
    <div className="grid grid-cols-3">
      <div className="flex flex-col">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-primary-400">Settings</h3>
        </div>
        <Button
          as={Link}
          radius="none"
          variant="light"
          className="flex justify-start"
          to="/settings/incident-types"
          size="lg"
        >
          Incident Types
        </Button>
        <Button
          size="lg"
          as={Link}
          radius="none"
          variant="light"
          className="flex justify-start"
          to="/settings/departments"
        >
          Departments
        </Button>
        <Button
          as={Link}
          size="lg"
          radius="none"
          variant="light"
          className="flex justify-start"
          to="/settings/user-profiles"
        >
          User Profiles
        </Button>
      </div>
      <div className="col-span-2 overflow-y-scroll h-screen border-l">
        <Outlet />
      </div>
    </div>
  );
};

export default _layout;
