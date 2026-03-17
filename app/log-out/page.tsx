"use client"

import { logout } from "@/lib/authApis";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


export default function LogOut() {

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(logout(router.push) as any);
    }, []);

    return <></>

}
