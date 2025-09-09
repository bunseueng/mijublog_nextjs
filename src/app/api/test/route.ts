import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    
const  newUser = await auth.api.createUser({
    body: {
        email: "bunseueng@example.com", // required
        password: "015651320miju", // required
        name: "Ju JingYi", // required
        role: "admin",
    }
    });
return NextResponse.json({newUser})
}
