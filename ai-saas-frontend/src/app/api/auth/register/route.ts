import { setAuthCookie } from "@/lib/auth";
import { registerWithStrapi } from "@/lib/strapi";
import { NextResponse } from "next/server";

export async function POST(request:Request){
    try{
        // Extract user data from the request body
        const body=await request.json();
        // Register the user with Strapi
        const registerStrapiResponse=await registerWithStrapi(
            String(body.username?? ""),
            String(body.email?? ""),
            String(body.password?? "")
        )
        // Set the authentication cookie
        await setAuthCookie(registerStrapiResponse.jwt);
        // Return the user data in the response
        return NextResponse.json({
            user: registerStrapiResponse.user
        })

    }catch(error){
        console.log("Error in registration:", error);
        return new Response(JSON.stringify({message:"Error occurred while registering user"}),{status:500});
    }
}