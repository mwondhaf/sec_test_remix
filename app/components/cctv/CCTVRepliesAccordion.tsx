import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { CCTVReply } from "types";

export default function CCTVRepliesAccordion({
  replies,
}: {
  replies: CCTVReply[];
}) {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <Accordion
      className="m-0 p-0"
      isCompact
      defaultExpandedKeys={[replies[0]?.id.toString()]}
      itemClasses={{
        title: "text-sm font-semibold text-gray-600",
        subtitle: "text-xs",
      }}
    >
      {replies.map((reply, index) => (
        <AccordionItem
          key={index.toString()}
          aria-label={reply.id.toString()}
          title={`Review Result ${index + 1}`}
          subtitle={"Click to see result"}
        >
          <p className="text-gray-500 text-sm text-justify">{reply.content}</p>
        </AccordionItem>
      ))}
      {/* <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
        <p className="text-gray-500 text-sm text-justify">{defaultContent}</p>
      </AccordionItem> */}
    </Accordion>
  );
}
