import CommonDashboard from "@/components/Dashboard/common/CommonDashboard";

export default function AdminDashboardPage() {
    return (
        <CommonDashboard props={{ role: "admin" }} />
    )
}