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
import { useNavigate, useParams, useSearchParams } from "@remix-run/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDebouncedCallback } from "use-debounce";

interface FilterBarProps {}

const Severity: any = ["Low", "Medium", "High"];

const FilterBar: React.FC<FilterBarProps> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();

  const { incidentId } = params;

  const severity_name = (severity: string) => {
    switch (severity) {
      case "Low":
        return t("low");
      case "Medium":
        return t("medium");
      case "High":
        return t("high");
      default:
        return "success";
    }
  };

  const debounced = useDebouncedCallback(
    (value) => {
      if (value) {
        if (incidentId) {
          return navigate(`/incidents?q=${value}`);
        }
        setSearchParams((prev) => {
          prev.set("q", value);
          return prev;
        });
      } else {
        searchParams.delete("q");
        setSearchParams(searchParams);
        // clear input
      }
    },
    // delay in ms
    1000
  );

  return (
    <>
      <Input
        placeholder={t("search")}
        labelPlacement="outside"
        onChange={(e) => debounced(e.target.value)}
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
              {severity_name(severity)}
            </DropdownItem>
          ))}
          <DropdownItem
            onClick={() => {
              navigate(`/incidents`);
            }}
          >
            {t("all")}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {/* <Button isIconOnly radius="full" variant="light">
        <FileTextIcon />
      </Button> */}
    </>
  );
};

export default FilterBar;
