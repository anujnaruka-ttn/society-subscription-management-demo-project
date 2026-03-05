'use client'
import AuthCommon from "../common/AuthCommon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formType } from "@/types/formType";

export default function Login({
    role = "user"
}: {
    role?: formType
}) {

    return (
        <AuthCommon
            title="Login to your account"
            description="Enter your email and password below to login to your account"
            feature="Login"
            role={role}
        >
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <Input id="password" type="password" required />
                    </div>
                </div>
            </form>
        </AuthCommon>
    )
}
