import { createAuthClient } from "better-auth/react";
import { adminClient as client, inferAdditionalFields } from "better-auth/client/plugins";
import { type User } from "../../prisma/generated/prisma/client.js";

export const authClient = createAuthClient({
  plugins: [
    client(),
    inferAdditionalFields<User>(), // 👈 pulls in extra User fields
  ],
  user: {
    additionalFields: {
      description: {
        type: "string",
        required: false,
      },
    },
  },
  baseURL: process.env.BASE_URL || "http://localhost:3000",
});

export type Session = typeof authClient.$Infer.Session;
