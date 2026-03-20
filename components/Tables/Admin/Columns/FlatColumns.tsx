import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2Icon, FileTextIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FlatData } from "@/types/flatData";
import dynamic from "next/dynamic";

const FlatDetailDialog = dynamic(() => import("@/components/Dialogs/FlatDetailDialog"), {
    ssr: false,
    loading: () => <Button variant={"ghost"} className="w-3 h-3"></Button>
});

export const getFlatColumns = (onDelete: (id: string) => void): ColumnDef<FlatData>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: "owner",
        header: "Owner",
        cell: ({ row }) => (
            <span className="font-medium text-nowrap">{row.getValue("owner")}</span>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "flat_number",
        header: "Flat Number",
        cell: ({ row }) => (
            <span className="font-medium">{row.getValue("flat_number")}</span>
        ),
    },
    {
        accessorKey: "floor_number",
        header: "Floor",
        cell: ({ row }) => (
            <span className="font-medium">Floor {row.getValue("floor_number")}</span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            aria-label="Delete"
                            onClick={() => onDelete(row.original.id)}
                        >
                            <Trash2Icon className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger>
                        <FlatDetailDialog dialogProps={{ title: "View Details", description: "View details of the flat" }}
                            flatDetails={row.original}>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="View details"
                            >
                                <FileTextIcon className="size-4" />
                            </Button>
                        </FlatDetailDialog>
                    </TooltipTrigger>
                    <TooltipContent>View Details</TooltipContent>
                </Tooltip>
            </div>
        ),
    },
];
