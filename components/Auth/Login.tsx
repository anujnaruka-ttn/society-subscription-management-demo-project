'use client'
import AuthCommon from "../common/AuthCommon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/authApis";
import { RoleType } from "@/types/RoleType";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";

type LoginFormData = {
    email: string;
    password: string;
}

export default function Login({
    role = "user"
}: {
    role?: RoleType
}) {

    const { token, user } = useSelector((state: any) => state.auth);
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: session, status } = useSession();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>();

    const onSubmit: SubmitHandler<LoginFormData> = (data) => dispatch(login(data, router.push) as any)

    useEffect(() => {
        if (token && user) {
            router.push(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
        } else if (status === "authenticated" && session?.user) {
            router.push((session.user as any).role === "admin" ? "/admin/dashboard" : "/dashboard");
        }
    }, [token, user, session, status, router]);

    if (status === "loading" || (status === "authenticated") || (token && user)) {
        return null;
    }


    return (
        <AuthCommon
            title="Login to your account"
            description="Enter your email and password below to login to your account"
            feature="Login"
            onSubmit={handleSubmit(onSubmit)}
            role={role}
        >
            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {
                        ...register("email", {
                            required: "Email is required.",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Invalid email"
                            }
                        })}
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        {...register("password", {
                            required: "Password is required.",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters long"
                            }
                        })}
                    />
                    {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                </div>
            </div>
        </AuthCommon>
    )
}
