import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import { DeleteIcon, EditIcon, EyeIcon } from "lucide-react";
import { Profile } from "types";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
  { name: "COMPANY", uid: "company" },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap = {
  true: "success",
  false: "danger",
};

export default function ProfilesTable({ profiles }: { profiles: Profile[] }) {
  const renderCell = React.useCallback(
    (profile: Profile, columnKey: string | boolean | number) => {
      //   @ts-ignore
      const cellValue = profile[columnKey];

      switch (columnKey) {
        case "name":
          return (
            <User description={profile.email} name={profile.name}>
              {profile.email}
            </User>
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{profile.role}</p>
            </div>
          );
        case "company":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-xs capitalize">
                {profile.company?.name}
              </p>
              <p className="text-bold text-xs capitalize">
                {profile.employeeType}
              </p>
              <p className="text-bold text-xs capitalize">{profile.idNumber}</p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              //   @ts-ignore
              color={statusColorMap[profile.isActive.toString()]}
              size="sm"
              variant="flat"
            >
              {profile.isActive ? "Active" : "Inactive"}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-5">
              <Tooltip content="Edit user">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <Pencil2Icon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <TrashIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <Table shadow="none" aria-labelledby="profiles">
      <TableHeader>
        {columns.map((column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody items={profiles}>
        {(profile) => (
          <TableRow key={profile.id}>
            {(columnKey) => (
              <TableCell>{renderCell(profile, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
