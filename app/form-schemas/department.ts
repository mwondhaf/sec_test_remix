import * as zod from "zod";

export const departmentSchema = zod.object({
  name: zod.string().min(1),
});
