import { NextResponse, NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/viewPage\/(\d+)/);

  if (match) {
    const viewedUserId = match[1];
    const response = NextResponse.next();

    response.cookies.set("viewedUserId", viewedUserId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  }

  return NextResponse.next();
}

//If not match just skip
export const config = {
  matcher: "/viewPage/:viewedUserId*",
};
