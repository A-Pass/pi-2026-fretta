import { auth } from '@/lib/auth';
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { DEFAULT_ROUTE_AFTER_AUTHENTICATED, ROUTE_API_AUTH, ROUTE_AUTH_SIGN_IN, ROUTE_AUTH_SIGN_UP } from "./constants/routes";

// export const config = {
//   matcher: [
//     "/dashboard/:path*", // todas as páginas dentro de /dashboard
//     "/profile/:path*",   // se quiser proteger /profile
//   ],
// };

export async function proxy(req) {
    const url = req.nextUrl.clone();

    // Rotas públicas
    if (url.pathname.trim() == '/'
        || url.pathname.startsWith('/favicon.ico')
        || url.pathname.startsWith('/_next')
        || url.pathname.startsWith(ROUTE_AUTH_SIGN_UP)
        || url.pathname.startsWith(ROUTE_API_AUTH)) {
        const result = NextResponse.next();

        return result;
    }

    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if(session && url.pathname.startsWith(ROUTE_AUTH_SIGN_IN)) {
            return NextResponse.redirect(new URL(DEFAULT_ROUTE_AFTER_AUTHENTICATED, url));
        }

        if (!session && !url.pathname.startsWith(ROUTE_AUTH_SIGN_IN)) {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }

        // usuário logado
        return NextResponse.next();
    } catch (err) {
        url.pathname = "/";
        return NextResponse.redirect(url);
    }
}

