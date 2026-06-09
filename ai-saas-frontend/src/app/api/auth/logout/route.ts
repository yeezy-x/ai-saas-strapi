import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST(){
    try{
        // Clear the authentication cookie to log the user out
        // This will remove the JWT from the client's cookies, effectively logging them out
        await clearAuthCookie();
        return NextResponse.json({message:"Logged out successfully."})
    }catch(error){
        console.log("Error in logout:", error);
        return NextResponse.json({message:"Error occurred while logging out."}, {status: 500});
    }
}