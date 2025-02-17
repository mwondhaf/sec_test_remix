import * as zod from "zod";

export const incidentTypeSchema = zod.object({
  id: zod.number().optional(),
  name: zod.string().min(1),
});
