import { CalendarDateTime } from "@internationalized/date";
import * as zod from "zod";

enum Severity {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export const createIncidentSchema = zod.object({
  id: zod.number().optional(),
  created_at: zod.string(),
  description: zod.string().min(1),
  incident_time: zod.string(),
  entity_id: zod.number().optional(),
  category_id: zod.number(),
  reporter_name: zod.string().min(1),
  reporter_dept: zod.number(),
  compiler_id: zod.string().optional(),
  editor_id: zod.string().optional().nullable(),
  incident_close_time: zod.string(),
  severity: zod.nativeEnum(Severity),
  action: zod.string().min(1),
  incident_location: zod.string().min(1),
});
