"use client"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonDashboard from "@/components/Dashboard/common/CommonDashboard";
import { getDashboardStatsAction } from "@/lib/dashboardApis";
import { FadeLoader } from "react-spinners";

export default function AdminDashboardPage() {
    const dispatch = useDispatch();
    const { data: dashboardData, loading, error } = useSelector((state: any) => state.dashboard);

    useEffect(() => {
        // Fetch dashboard data when component mounts
        dispatch(getDashboardStatsAction() as any);
    }, [dispatch]);

    if (loading) {
        return <FadeLoader color="var(--primary)"/>;
    }

    if (error) {
        return <div>Error loading dashboard: {error}</div>;
    }

    return (
        <CommonDashboard props={{ role: "admin", dashboardData }} />
    )
}