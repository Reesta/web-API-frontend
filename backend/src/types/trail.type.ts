import { z } from "zod";

export const WaypointSchema = z.object({
  day: z.string().trim().min(1, "Day is required"),
  title: z.string().trim().min(1, "Waypoint title is required"),
  altitude: z.string().trim().min(1, "Waypoint altitude is required"),
  text: z.string().trim().min(1, "Waypoint description is required"),
});

export const TrailSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase words separated by hyphens"),
  title: z.string().trim().min(1, "Title is required"),
  altitude: z.string().trim().min(1, "Altitude is required"),
  distance: z.string().trim().min(1, "Distance is required"),
  duration: z.string().trim().min(1, "Duration is required"),
  detailDuration: z.string().trim().min(1, "Detail duration is required"),
  image: z.string().trim().min(1, "Image path is required"),
  difficulty: z.enum(["Easy", "Mod", "Hard"]),
  text: z.string().trim().min(1, "Description is required"),
  waypoints: z.array(WaypointSchema).default([]),
});

export type WaypointType = z.infer<typeof WaypointSchema>;
export type TrailType = z.infer<typeof TrailSchema>;
