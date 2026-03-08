'use client'

import FlatsTable from "@/components/Tables/Admin/Flats";
import CommonAdminClient from "../common/CommonAdminClient";

const FlatsClient = () => {
    return (
        <CommonAdminClient title="Flats & Residents" description="Manage society flats, resident assignments, and occupancy status">
            <FlatsTable />
        </CommonAdminClient>

    )
}

export default FlatsClient;