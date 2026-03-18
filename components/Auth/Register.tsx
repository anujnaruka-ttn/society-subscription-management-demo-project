'use client'
import AuthCommon from "../common/AuthCommon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/authApis";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from 'lucide-react';

type RegisterFormData = {
    name: string;
    email: string;
    password: string;
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormData>();

    const onSubmit: SubmitHandler<RegisterFormData> = (data) => dispatch(signup(data, router.push) as any);

    return (
        <AuthCommon
            title="Register to your account"
            description="Enter your details below to register to your account"
            feature="Register"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        {...register("name", { required: true })}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {
                        ...register("email", {
                            required: true,
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Invalid email"
                            }
                        })
                        }
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="pr-10"
                            {...register("password", {
                                required: "Password is required.",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters long"
                                }
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                </div>
            </div>
        </AuthCommon>
    )
}
