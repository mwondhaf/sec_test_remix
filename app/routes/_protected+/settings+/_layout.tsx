import { Button } from "@nextui-org/react";
import { Link, Outlet } from "@remix-run/react";
import React from "react";

const _layout = () => {
  return (
    <div className="grid grid-cols-3 max-h-screen min-h-screen overflow-y-auto">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="col-span-2 overflow-y-scroll p-4 h-screen border-l">
        <Outlet />
      </div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div>
      <div className="p-4">
        <h3 className="text-2xl font-bold text-primary-400">Settings</h3>
        <p className="text-primary-700 text-sm">
          Manage your entity settings here
        </p>
      </div>
      <div className="my-4">
        <Button
          as={Link}
          radius="none"
          variant="light"
          className="flex justify-start"
          to="/settings/incident-types"
          size="md"
        >
          Incident Types
        </Button>
        <Button
          size="md"
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
          size="md"
          radius="none"
          variant="light"
          className="flex justify-start"
          to="/settings/user-profiles"
        >
          User Profiles
        </Button>
      </div>
    </div>
  );
};

export default _layout;
