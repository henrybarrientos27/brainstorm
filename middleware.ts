// File: middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
    function middleware(req: NextRequest) {
        const response = NextResponse.next();

        // Set session timeout to 30 minutes of inactivity
        response.headers.set("Cache-Control", "private, max-age=0, no-store");
        response.headers.set("Expires", "0");
        return response;
    },
    {
        pages: {
            signIn: "/api/auth/signin", // ✅ Fallback to working route
        },
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/client/:path*",
        "/dashboard/:path*",
    ],
};
