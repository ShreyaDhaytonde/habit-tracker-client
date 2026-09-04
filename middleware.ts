import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthed = request.cookies.get("habit_auth")?.value === "1";
  if (!isAuthed) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|_next|favicon.ico).*)"],
};
