'use client'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import GoogleIcon from "@/public/google.svg"
import { formType } from "@/types/formType"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AuthCommonProps {
    children: React.ReactElement,
    title: string,
    description: string,
    feature: string,
    role?: formType
}
const AuthCommon = ({ children, title, description, feature, role }: AuthCommonProps) => {

    const path = usePathname();

    const handleSubmit = () => console.log(role);

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle
                    className={path.includes("/admin") ? "text-center" : ""}
                >
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
            <CardContent>
                {children}
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full" onSubmit={handleSubmit}>
                    {feature}
                </Button>
                <Button variant="outline" className="w-full">
                    <span>
                        <Image src={GoogleIcon} alt="Google" width={20} height={20} />
                    </span>
                    Login with Google
                </Button>
                <Button variant={"link"} asChild>

                    <Link href={path.includes("/admin") ? "/login" : "/admin/login"}>
                        {path.includes("/admin") ? "Login as user" : "Login as admin"}
                    </Link>

                </Button>
            </CardFooter>
        </Card>
    )

}

export default AuthCommon;
