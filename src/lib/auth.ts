import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { PrismaClient, User } from "../../prisma/generated/prisma/client.js";
import { inferAdditionalFields } from "better-auth/client/plugins";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  plugins: [
    nextCookies(),
    admin(),
    inferAdditionalFields<User>(), // 👈 server knows about fields in User
  ],
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      description: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {    
        enabled: true
    } 
});
