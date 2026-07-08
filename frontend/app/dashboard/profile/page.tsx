import {
  BadgeCheck,
  Camera,
  KeyRound,
  Mail,
  Phone,
  Shield,
  UserRound,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getBlogsAction } from "@/lib/actions/blog-action";
import { getMyBookingsAction } from "@/lib/actions/booking-action";
import { getCurrentUserAction } from "@/lib/actions/auth-action";
import { Blog } from "@/lib/api/blogs";
import { Booking } from "@/lib/api/bookings";
import AccountSettingsForm from "../_components/AccountSettingsForm";
import PasswordUpdateForm from "../_components/PasswordUpdateForm";
import ProfileImage from "../_components/ProfileImage";
import BookmarkedBlogs from "./_components/BookmarkedBlogs";
import ProfileBookingHistory from "./_components/ProfileBookingHistory";

export default async function ProfilePage() {
  const [response, blogsResult, bookingsResult] = await Promise.all([
    getCurrentUserAction(),
    getBlogsAction(),
    getMyBookingsAction(),
  ]);

  if (!response?.success || !response.data) {
    redirect("/login");
  }

  const user = response.data;
  const blogs: Blog[] = blogsResult.success && blogsResult.data ? blogsResult.data : [];
  const bookings: Booking[] =
    bookingsResult.success && bookingsResult.data
      ? bookingsResult.data.filter((booking: Booking) => booking.userId === user.id)
      : [];
  const userKey = user.id || user.email;

  return (
    <section className="grid gap-5">
      <div>
        <p className="text-[13px] font-black uppercase tracking-[0.12em] text-[#e0a12b]">Profile</p>
        <h1 className="text-[32px] font-black leading-tight text-[#f3f5f6]">Trekker Profile</h1>
      </div>

      <div className="relative overflow-hidden rounded-[14px] border border-white/10 bg-[linear-gradient(135deg,rgba(8,14,24,0.96),rgba(37,40,39,0.86)),url('/home.png')] bg-cover bg-center p-7 before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#020910]/65 before:to-[#020910]/15 max-[1000px]:p-5">
        <div className="relative z-10 flex items-center justify-start gap-6 max-[1000px]:flex-col max-[1000px]:items-start">
          <div className="relative shrink-0">
            <ProfileImage user={user} />
            <span className="absolute bottom-2 right-1 flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 border-[#080d16] bg-[#e0a12b] text-[#111]">
              <Camera size={16} />
            </span>
          </div>

          <div className="max-w-[620px]">
            <span className="flex w-fit items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-black uppercase tracking-[0.06em] text-[#a7efc4]">
              <BadgeCheck size={16} />
              Verified Trekker
            </span>
            <h2 className="mt-3 text-[42px] font-black leading-tight text-white max-[1000px]:text-[32px]">{user.fullName}</h2>
            <p className="mt-3 max-w-[560px] text-base leading-relaxed text-[#d6dde6]">
              Manage your identity, contact details, and account security for Yeti Trek.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-7 grid grid-cols-3 gap-3.5 max-[1000px]:grid-cols-1">
          <InfoItem icon={<Mail size={18} />} label="Email" value={user.email} />
          <InfoItem icon={<Phone size={18} />} label="Phone" value={user.phoneNumber} />
          <InfoItem icon={<Shield size={18} />} label="Role" value={user.role || "Member"} />
        </div>
      </div>

      <BookmarkedBlogs blogs={blogs} userKey={userKey} />
      <ProfileBookingHistory bookings={bookings} />

      <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)] gap-[18px] max-[1000px]:grid-cols-1">
        <div id="edit-profile" className="min-w-0 overflow-hidden rounded-[13px] border border-white/10 bg-[#282c2d] p-6">
          <div className="mb-5 flex items-start gap-3">
            <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg bg-[#e0a12b]/15 text-[#e0a12b]">
              <UserRound size={18} />
            </span>
            <div>
              <p className="text-xl font-black text-white">Edit Profile</p>
              <span className="mt-1.5 block text-sm text-[#aeb8c3]">Update the account details shared by the web and Flutter apps.</span>
            </div>
          </div>
          <AccountSettingsForm />
        </div>

        <div className="grid gap-[18px]">
          <div id="change-password" className="min-w-0 overflow-hidden rounded-[13px] border border-white/10 bg-[#282c2d] p-6">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg bg-[#e0a12b]/15 text-[#e0a12b]">
                <KeyRound size={18} />
              </span>
              <div>
                <p className="text-xl font-black text-white">Change Password</p>
                <span className="mt-1.5 block text-sm text-[#aeb8c3]">Keep the same protected account flow for both clients.</span>
              </div>
            </div>
            <PasswordUpdateForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-[#101820]/70 p-[18px] backdrop-blur">
      <div className="flex items-center gap-2 text-[#8ed1ff]">
        {icon}
        <span className="text-xs font-black uppercase tracking-[0.08em]">{label}</span>
      </div>
      <p className="mt-3 break-words font-black text-[#f2f2f2]">{value}</p>
    </div>
  );
}
