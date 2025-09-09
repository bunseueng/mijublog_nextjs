"use server";
import { createAuthClient } from "better-auth/client"
const authClient =  createAuthClient()
 
const signIn = async () => {
     await authClient.signIn.social({
        provider: "google"
    })
}

export {signIn}