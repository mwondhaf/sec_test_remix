import { Link, Outlet } from "@remix-run/react";
import React from "react";

const _layout = () => {
  return (
    <div className="grid grid-cols-3">
      <div className="flex flex-col">
        <Link to="/settings">Settings</Link>
        <Link to="/settings/incident-types">Incident Types</Link>
      </div>
      <div className="col-span-2 overflow-y-scroll h-screen border-l">
        <Outlet />
      </div>
    </div>
  );
};

export default _layout;
