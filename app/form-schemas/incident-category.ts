import * as zod from "zod";

export const incidentCategorySchema = zod.object({
  id: zod.number().optional(),
  name: zod.string().min(1),
  name_ar: zod.string().optional(),
});
