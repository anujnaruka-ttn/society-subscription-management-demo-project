"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { getFlats, deleteFlat } from "@/lib/flatApis";
import { getFlatColumns } from "./Columns/FlatColumns";
import { useDataTable } from "@/hooks/use-data-table";

import { GoPlusCircle } from "react-icons/go";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { CommonTable } from "../Common/CommonTable";

const FlatDetailDialog = dynamic(() => import("@/components/Dialogs/FlatDetailDialog"), {
    ssr: false,
    loading: () => <Button variant={"ghost"} className="w-3 h-3"></Button>
});

export default function FlatsTable() {
    const dispatch = useDispatch();
    const flats = useSelector((state: RootState) => state.flat.flats);
    // Fetch flats data on mount
    useEffect(() => {
        dispatch(getFlats() as any);
    }, [dispatch]);

    const handleDeleteFlat = (flatId: string) => {
        dispatch(deleteFlat(flatId) as any);
    };

    const columns = getFlatColumns(handleDeleteFlat);

    const { table, globalFilter, setGlobalFilter } = useDataTable({
        data: flats,
        columns,
        getRowId: (row) => row.id,
    });

    return (
        <CommonTable
            table={table}
            columnsCount={columns.length}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            className="h-[calc(100vh-64px)] pt-1.5 pb-6 px-6"
            actionButton={
                <FlatDetailDialog 
                    dialogProps={{ title: "Add Flat", description: "Add a new flat to the society" }} 
                    flatDetails={{ id: "", owner: "", email: "", phone: "", flat_number: "", floor_number: 0, flat_type: "" }}
                >
                    <Button
                        variant="outline"
                        size="icon-lg"
                        className="w-full md:w-fit px-3 ml-auto h-8 hover:text-white"
                    >
                        <GoPlusCircle />
                        Add Flat
                    </Button>
                </FlatDetailDialog>
            }
        />
    );
}
