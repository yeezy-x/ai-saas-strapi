import { cookies } from "next/headers";
import { COOKIE_NAME } from "./strapi";

export async function setAuthCookie(jwt:string){
    const cookieStore=await cookies()
    cookieStore.set(COOKIE_NAME, jwt, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60, 
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const
    })
}

export async function clearAuthCookie(){
    const cookieStore=await cookies()
    cookieStore.delete(COOKIE_NAME)
}

export async function getAuthCookie(){
    const cookieStore=await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
}