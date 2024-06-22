import * as zod from "zod";

export const entitySchema = zod.object({
  id: zod.number().optional(),
  name: zod.string().min(1),
  code: zod.string().min(1).nullable(),
  makani: zod.string().min(1).nullable(),
  created_at: zod.string().optional(),
});
