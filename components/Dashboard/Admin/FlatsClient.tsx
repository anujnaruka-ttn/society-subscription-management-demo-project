'use client'

import FlatsTable from "@/components/Tables/Admin/Flats";
import CommonHeader from "../common/CommonHeader";

const FlatsClient = () => {
    return (
        <CommonHeader title="Flats & Residents" description="Manage society flats, resident assignments, and occupancy status">
            <FlatsTable />
        </CommonHeader>

    )
}

export default FlatsClient;