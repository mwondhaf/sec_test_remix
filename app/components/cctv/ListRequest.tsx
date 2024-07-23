import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Divider,
  Link as NextLink,
} from "@nextui-org/react";
import { CCTVRequest } from "types";
import { Link } from "@remix-run/react";

export default function ListRequest({ request }: { request: CCTVRequest }) {
  return (
    <Card className="pb-2" shadow="none">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small capitalize font-semibold leading-none text-default-600">
              {request.requestor?.full_name} -{" "}
              <span className="font-medium text-gray-400 text-xs">
                {request.requestor?.department?.name}
              </span>
            </h4>
            <div className="flex gap-3">
              <h5 className="text-small capitalize tracking-tight text-default-400">
                <span className="text-gray-500 font-medium">Location: </span>{" "}
                {request.location}
              </h5>
              <Divider orientation="vertical" />
              <div className="">
                <h5 className="text-small capitalize tracking-tight line-clamp-1 text-default-400">
                  <span className="text-gray-500 font-medium">Reason: </span>{" "}
                  {request.reason}
                </h5>
              </div>
            </div>
          </div>
        </div>
        <NextLink as={Link} to={`/cctv/${request.id}`} size="sm">
          {request?.request_id}
        </NextLink>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p className="clamp-line-3">{request.details}</p>
      </CardBody>
      {/* <CardFooter className="gap-3">
        <Button size="sm" radius="full" variant="light" color="danger">
          Reject
        </Button>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">4</p>
          <p className=" text-default-400 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">97.1K</p>
          <p className="text-default-400 text-small">Followers</p>
        </div>
      </CardFooter> */}
    </Card>
  );
}
