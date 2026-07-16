export type MomentType = {
  title: string;
  caption: string;
  location: string;
  trailSlug?: string;
  image: string;
  status: "pending" | "approved" | "rejected";
};
