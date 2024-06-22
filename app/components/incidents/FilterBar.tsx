import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import {
  ChevronDownIcon,
  FileTextIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { useNavigate, useSearchParams } from "@remix-run/react";
import React from "react";

interface FilterBarProps {}

const Severity: any = ["Low", "Medium", "High"];

const FilterBar: React.FC<FilterBarProps> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <>
      <Input
        type="email"
        placeholder="search"
        labelPlacement="outside"
        startContent={
          <MagnifyingGlassIcon className="text-4xl text-default-400 pointer-events-none flex-shrink-0" />
        }
      />

      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly radius="full" variant="light">
            <ChevronDownIcon />
          </Button>
          {/* <Button variant="bordered">Open Menu</Button> */}
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          {Severity.map((severity: string) => (
            <DropdownItem
              key={severity}
              onClick={() => {
                // navigate(`/incidents?severity=${severity}`);
                setSearchParams((prev) => {
                  prev.set("severity", severity);
                  return prev;
                });
              }}
            >
              {severity}
            </DropdownItem>
          ))}
          <DropdownItem
            onClick={() => {
              navigate(`/incidents`);
            }}
          >
            All
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button isIconOnly radius="full" variant="light">
        <FileTextIcon />
      </Button>
    </>
  );
};

export default FilterBar;
