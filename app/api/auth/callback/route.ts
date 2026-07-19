import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const tokenRes = await fetch("https://anilist.co/api/v2/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok || !tokenData.access_token) {
    return NextResponse.json(
      { error: "Token exchange failed" },
      { status: 401 },
    );
  }

  const query = `{ Viewer { id } }`;

  const userIdResponse = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + tokenData.access_token,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await userIdResponse.json();

  if (!userIdResponse.ok || !data?.data?.Viewer) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 },
    );
  }

  const origin = new URL(process.env.NEXT_PUBLIC_REDIRECT_URL!).origin;
  const response = NextResponse.redirect(new URL("/", origin));

  const secure = process.env.NODE_ENV === "production";

  response.cookies.set("access_token", tokenData.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  response.cookies.set("userId", String(data.data.Viewer.id), {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
