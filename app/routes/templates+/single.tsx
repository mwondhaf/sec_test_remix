import React from "react";
import { SingleIncidentPdf } from "~/components";

const incidentData = {
  title: "Incident Report",
  incidents: [
    { id: 1, description: "This is the first incident." },
    { id: 2, description: "This is the second incident." },
    { id: 3, description: "This is the third incident." },
  ],
};

const Single = () => {
  return (
    <div>
      {/* <SingleIncidentPdf {...{ incident: incidentData[0] }} /> */}
    </div>
  );
};

export default Single;
