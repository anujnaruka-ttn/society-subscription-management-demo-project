'use client'
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import GoogleIcon from "@/public/assets/google.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn } from "next-auth/react";
import { RoleType } from "@/types/RoleType";

interface AuthCommonProps {
    children: React.ReactNode;
    title: string;
    description: string;
    feature: string;
    onSubmit?: React.SubmitEventHandler<HTMLFormElement>;
    role?: RoleType;
}

const AuthCommon = ({ children, title, description, feature, onSubmit, role }: AuthCommonProps) => {
    const path = usePathname();

    return (
        <Card className="w-full max-w-sm">
            <form onSubmit={onSubmit}>
                <CardHeader>
                    <CardTitle className={path.includes("/admin") ? "text-center" : ""}>
                        {title}
                    </CardTitle>
                    <CardDescription>
                        {description}
                    </CardDescription>
                    {
                        !path.includes("/admin") &&
                        <CardAction>
                            <Button variant="link" asChild>
                                <Link href={`${path === "/login" ? "/register" : "/login"}`}>
                                    {path === "/login" ? "Register" : "Login"}
                                </Link>
                            </Button>
                        </CardAction>
                    }
                </CardHeader>
                <CardContent className="pt-6">
                    {children}
                </CardContent>
                <CardFooter className="flex-col gap-2 pt-6">
                    <Button type="submit" className="w-full">
                        {feature}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => signIn('google', {
                            callbackUrl: role === "admin" ? "/admin/dashboard" : "/dashboard"
                        })}
                    >
                        <span>
                            <Image src={GoogleIcon} alt="Google" width={20} height={20} />
                        </span>
                        Login with Google
                    </Button>
                    <Button type="button" variant={"link"} asChild>
                        <Link href={path.includes("/admin") ? "/login" : "/admin/login"}>
                            {path.includes("/admin") ? "Login as user" : "Login as admin"}
                        </Link>
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default AuthCommon;

