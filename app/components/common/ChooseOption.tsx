import { Image } from "@nextui-org/react";
import React from "react";

const ChooseOption = () => {
  return (
    <div className="flex flex-col h-full items-center my-32 space-y-8">
      <div className="text-xl font-medium text-gray-600">
        Please select an option to continue
      </div>
      <Image width={100} alt="Folder Image" src={"/images/select_folder.svg"} />
    </div>
  );
};

export default ChooseOption;
