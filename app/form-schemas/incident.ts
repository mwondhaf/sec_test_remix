import { CalendarDateTime } from "@internationalized/date";
import * as zod from "zod";
import { incidentCategorySchema } from "./incident-category";
import { departmentSchema } from "./department";
import { createProfileSchema } from "./profile";
import { entitySchema } from "./entity";
import { personInvolvedSchema } from "./person-involved";

enum Severity {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export const createIncidentSchema = zod.object({
  id: zod.number().optional(),
  created_at: zod.string().optional(),
  description: zod.string().min(1),
  incident_time: zod.string().optional(),
  entity_id: zod.number().optional(),
  category_id: zod.coerce.number(),
  reporter_name: zod.string().min(1),
  reporter_dept: zod.coerce.number(),
  compiler_id: zod.string().optional(),
  editor_id: zod.string().optional().nullable(),
  incident_close_time: zod.string().optional(),
  severity: zod.nativeEnum(Severity),
  action: zod.string().min(1),
  incident_location: zod.string().min(1),
  reporter_department: departmentSchema.optional(),
  entity: entitySchema.optional(),
  compiler: createProfileSchema.optional(),
  editor: createProfileSchema.optional().nullable(),
  category: incidentCategorySchema.optional(),
  updated_at: zod.string().optional(),
  // people_involved: personInvolvedSchema.optional(),
});
