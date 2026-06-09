import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";
import { loginWithStrapi } from "@/lib/strapi";

export async function POST(request:Request){
    try{
        const body=await request.json();
        const loginStrapiResponse=await loginWithStrapi(
            String(body.identifier?? ""),
            String(body.password?? "")
        )
        await setAuthCookie(loginStrapiResponse.jwt);
        return NextResponse.json({
            user: loginStrapiResponse.user
        })
    }catch(error){
        console.log("Login Error:",error);
        return NextResponse.json({message:"Error occurred while logging in."});
        {
            //another way of writing
            /*
            return new Response(JSON.stringify({message:"Error occurred while logging in."}),{status:500});
            */
        }
    }
}