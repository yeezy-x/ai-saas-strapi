import { cookies } from "next/headers";
import { COOKIE_NAME, fetchCurrentUser } from "./strapi";
import { redirect } from "next/navigation";

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

export async function getAuthToken(){
    const cookieStore=await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
}

export async function getCurrentUser(){
    const token=await getAuthToken();
    if(!token){
        return null;
    }
    try{
        const response=await fetchCurrentUser(token);
        return response;
    }catch(error){
        console.error("Error fetching current user:", error);
        return null;
    }
}

export async function requireAuth(redirectTo='/login'){
    const user=await getCurrentUser();
    if(!user){
        redirect(redirectTo)
    }
    return user;
}

export async function requireNoAuth(redirectTo='/dashboard'){
    const user=await getCurrentUser();
    if(user){
        redirect(redirectTo)
    }
    return null;
}

