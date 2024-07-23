import { Image } from "@nextui-org/react";
import React from "react";

const ComingSoon = () => {
  return (
    <div className="flex flex-col h-full items-center my-32 space-y-8">
      <div className="text-xl font-medium text-gray-600">
        Option is coming soon...
      </div>
      <Image width={100} alt="Loading Image" src={"/images/coming_soon.svg"} />
    </div>
  );
};

export default ComingSoon;
