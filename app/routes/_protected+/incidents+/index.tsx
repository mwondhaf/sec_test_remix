import { Image } from "@nextui-org/react";
import React from "react";

const Hello = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center space-y-8">
      <div>
        <Image
          width={50}
          alt="Select Image"
          src={"/images/select_incident.svg"}
        />
      </div>
    </div>
  );
};

export default Hello;
