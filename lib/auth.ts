import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { apiConnector } from "./apiConnector"
import { authApis, apiMethods } from "./apis"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    const response = await apiConnector({
                        method: apiMethods.POST,
                        url: authApis.loginGoogle,
                        data: {
                            name: user.name,
                            email: user.email,
                            auth0_id: account.providerAccountId,
                        }
                    });

                    if (response.data.success) {
                        // Attach backend data to the user object 
                        // so it can be picked up by the jwt callback
                        user.role = response.data.data.role;
                        user.backendToken = response.data.data.token;
                        user.profile_image = response.data.data.profile_image;
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error("Google login backend error:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.accessToken = user.backendToken;
                token.picture = user.profile_image;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.accessToken = token.accessToken as string;
                session.user.image = token.picture as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
        signOut: '/log-out',
    },
    secret: process.env.NEXTAUTH_SECRET
}
