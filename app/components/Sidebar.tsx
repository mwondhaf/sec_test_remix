import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
  User,
} from "@nextui-org/react";
import { DotsVerticalIcon, FileIcon, HomeIcon } from "@radix-ui/react-icons";
import { Form, Link, NavLink, useLocation } from "@remix-run/react";
import clsx from "clsx";
import {
  Cctv,
  CogIcon,
  Construction,
  FileBarChart2,
  FilePieChartIcon,
  Key,
  LogOut,
  NotepadText,
  PieChart,
  Plus,
  Search,
  Settings2,
} from "lucide-react";
import React from "react";
import { Profile } from "types";

const Sidebar: React.FC<{ profile: Profile }> = ({ profile }) => {
  const location = useLocation();

  const links = [
    {
      name: "Statistics",
      href: "/",
    },
    {
      name: "Incidents",
      href: "/incidents",
    },
    {
      name: "Reports",
      href: "/reports",
    },
    {
      name: "Search",
      href: "/search",
    },
    {
      name: "Work Permits",
      href: "/permits",
    },
    {
      name: "CCTV Requests",
      href: "/cctv",
    },
    {
      name: "Access Requests",
      href: "/permits",
    },
    {
      name: "Settings",
      href: "/settings",
    },
  ];

  return (
    <div className="flex flex-col justify-between h-full p-5">
      <div className="space-y-10">
        <div className="px-4">
          <h2 className="font-bold text-2xl uppercase text-primary-700">
            SECURITY
          </h2>
          <p className="text-xs uppercase font-bold text-primary-600">
            Management System
          </p>
        </div>
        <div className="flex flex-col space-y-1">
          {links.map((link, index) => (
            <Button
              key={index}
              as={NavLink}
              startContent={
                link.name === "Statistics" ? (
                  <PieChart />
                ) : link.name === "Incidents" ? (
                  <NotepadText />
                ) : link.name === "Reports" ? (
                  <FileBarChart2 />
                ) : link.name === "Search" ? (
                  <Search />
                ) : link.name === "Work Permits" ? (
                  <Construction />
                ) : link.name === "CCTV Requests" ? (
                  <Cctv />
                ) : link.name === "Access Requests" ? (
                  <Key />
                ) : (
                  <Settings2 />
                )
              }
              to={link.href}
              variant="light"
              size="md"
              radius="full"
              className={clsx(
                "flex justify-start",
                (location.pathname.includes(link.href) && link.href !== "/") ||
                  (location.pathname === "/" && link.href === "/")
                  ? "font-semibold text-primary-600"
                  : "text-gray-500"
              )}
            >
              {link.name}
            </Button>
          ))}
        </div>

        <div className="mt-10 w-3/4">
          <Button
            size="md"
            radius="full"
            color="primary"
            as={NavLink}
            to={`/new-incident`}
            startContent={<Plus />}
            className={"flex justify-start"}
          >
            New Incident
          </Button>
        </div>
      </div>
      <div className="">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <User name={profile.name} description={profile?.entities?.name} />

            <Form action="/sign-out" method="post">
              <Tooltip content="Sign out">
                <Button type="submit" variant="light" isIconOnly>
                  <LogOut />
                </Button>
              </Tooltip>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
