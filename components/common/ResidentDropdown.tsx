'use client'

import { ResidentData } from "@/types/flatData";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface ResidentDropdownProps {
    items: ResidentData[];
    selectedIds: string[];
    onSelect: (residentId: string) => void;
    isMultiple?: boolean;
    label?: string;
    triggerText?: string;
    filterOutIds?: string[];
}

export default function ResidentDropdown({
    items,
    selectedIds,
    onSelect,
    isMultiple = false,
    label = "Select Items",
    triggerText = "Add Items",
    filterOutIds = [],
}: ResidentDropdownProps) {
    const filteredItems = items.filter((item) => !filterOutIds.includes(item.id));

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start hover:text-white">
                    {triggerText}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>{label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isMultiple ? (
                    // Multi-select with checkboxes
                    filteredItems.map((resident) => (
                        <DropdownMenuCheckboxItem
                            key={resident.id}
                            checked={selectedIds.includes(resident.id)}
                            onCheckedChange={() => onSelect(resident.id)}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center gap-2 w-full">
                                {resident.profile_image ? (
                                    <Image
                                        src={resident.profile_image}
                                        alt={resident.name}
                                        className="w-8 h-8 rounded-full object-cover shrink-0"
                                        width={32}
                                        height={32}
                                        unoptimized={true}
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
                                        {resident.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{resident.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{resident.email}</p>
                                </div>
                            </div>
                        </DropdownMenuCheckboxItem>
                    ))
                ) : (
                    // Single select with radio indicator
                    filteredItems.map((resident) => (
                        <DropdownMenuItem
                            key={resident.id}
                            onClick={() => onSelect(resident.id)}
                            className={selectedIds.includes(resident.id) ? "bg-primary text-primary-foreground" : ""}
                        >
                            <div className="flex items-center gap-2 w-full">
                                <div className="w-4 h-4 rounded border flex items-center justify-center shrink-0">
                                    {selectedIds.includes(resident.id) && (
                                        <span className="text-xs">✓</span>
                                    )}
                                </div>
                                {resident.profile_image ? (
                                    <Image
                                        src={resident.profile_image}
                                        alt={resident.name}
                                        className="w-8 h-8 rounded-full object-cover shrink-0"
                                        width={32}
                                        height={32}
                                        unoptimized={true}
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
                                        {resident.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{resident.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{resident.email}</p>
                                </div>
                            </div>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
