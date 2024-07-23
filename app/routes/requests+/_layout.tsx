import { Button } from "@nextui-org/react";
import { Link, Outlet } from "@remix-run/react";
import { HelpCircle, HomeIcon } from "lucide-react";
import React from "react";

const _layout = () => {
  return (
    <div className="max-h-screen overflow-y-clip mx-auto">
      <div className="border-b min-h-[6dvh] px-4 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link to="/requests" className="text-sm font-medium text-gray-600">
            Security Requests
          </Link>
          <div className="flex items-center">
            <Button
              startContent={<HelpCircle size={16} />}
              size="sm"
              variant="light"
            >
              Do you need help?
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-xl mx-auto flex flex-col mt-20 h-[90dvh]">
        <Outlet />
      </div>
    </div>
  );
};

export default _layout;
