import { redirect } from "next/navigation";
import { getCurrentUserAction } from "@/lib/actions/auth-action";

export default async function PublicSubmitStoryPage() {
  const currentUser = await getCurrentUserAction();

  if (!currentUser.success || !currentUser.data) {
    redirect("/login");
  }

  redirect("/dashboard/blogs/submit");
}
