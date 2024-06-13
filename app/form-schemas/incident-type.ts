import * as zod from "zod";

export const incidentTypeSchema = zod.object({
  name: zod.string().min(1),
});
