import Image from "next/image";
import { User } from "lucide-react";
import { YetiTrekUser } from "@/lib/api/auth";
import { resolveImageUrl } from "@/lib/api/image-url";

export default function ProfileImage({
  user,
  size = "large",
}: {
  user: YetiTrekUser;
  size?: "small" | "large";
}) {
  const imageUrl = resolveImageUrl(user.profileImage);
  const dimensions = size === "small" ? "h-11 w-11" : "h-28 w-28";
  const iconSize = size === "small" ? 20 : 44;

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={user.fullName}
        width={size === "small" ? 44 : 112}
        height={size === "small" ? 44 : 112}
        unoptimized
        className={`${dimensions} rounded-full border border-[#D89A2B]/50 object-cover`}
      />
    );
  }

  return (
    <div className={`${dimensions} flex items-center justify-center rounded-full border border-[#D89A2B]/50 bg-[#111d2a] text-[#D89A2B]`}>
      <User size={iconSize} />
    </div>
  );
}
