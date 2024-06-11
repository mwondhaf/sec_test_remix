import * as zod from "zod";

export const signInSchema = zod.object({
  password: zod.string().min(1),
  email: zod.string().email().min(1),
});
