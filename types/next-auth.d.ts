import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            role?: string;
            id?: string;
        } & DefaultSession["user"];
    }

    interface User {
        role?: string;
        backendToken?: string;
        profile_image?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string;
        accessToken?: string;
        picture?: string;
    }
}
