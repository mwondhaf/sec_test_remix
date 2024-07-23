import { Button, Image } from "@nextui-org/react";
import { Link, useParams, useSearchParams } from "@remix-run/react";
import React from "react";

const SuccessPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const request_id = searchParams.get("track");

  return (
    <div>
      <div className="mb-6 space-y-3">
        <div className="flex justify-center items-center mb-12">
          <Image width={120} src="/images/check.png" />
        </div>
        <h2 className="text-xl text-center font-semibold text-gray-600">
          Request {request_id} is successful
        </h2>
        <p className="text-xs text-center text-gray-500">
          We shall work on it now and share with you the results in your email.
        </p>
      </div>
      <div className="flex mt-20 justify-center flex-col items-center gap-5">
        <Button color="success" as={Link} variant="flat" to="/requests">
          Done
        </Button>
        <Link
          to="/requests"
          className="text-tiny text-primary-600 hover:underline"
        >
          Make another Request
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
