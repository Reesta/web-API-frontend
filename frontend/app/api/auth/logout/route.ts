import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestedNext = request.nextUrl.searchParams.get("next");
  const destination = requestedNext === "/admin/login" ? requestedNext : "/login";
  const response = NextResponse.redirect(new URL(destination, request.url));

  for (const name of ["auth_token", "user_data"]) {
    response.cookies.set({
      name,
      value: "",
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(0),
    });
  }

  return response;
}
