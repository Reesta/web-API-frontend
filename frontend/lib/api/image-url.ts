const apiRoot =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1$/, "") ||
  "http://localhost:4000";

export function resolveImageUrl(image?: string) {
  if (!image) return "";
  return image.startsWith("/uploads") ? `${apiRoot}${image}` : image;
}
