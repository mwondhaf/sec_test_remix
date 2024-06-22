import * as zod from "zod";

export const departmentSchema = zod.object({
  id: zod.number().optional(),
  name: zod.string().min(1),
});
