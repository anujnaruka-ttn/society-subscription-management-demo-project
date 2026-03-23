'use client'

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DialogProps } from "@/types/dialogProps"
import { FlatData, ResidentData } from "@/types/flatData"
import { getResidents, getFlats, addFlat, updateFlat } from "@/lib/flatApis"
import { RootState } from "@/stores/store"
import ResidentDropdown from "@/components/common/ResidentDropdown"
import CommonBadge from "@/components/common/CommonBadge";

const FLAT_TYPE_OPTIONS = [
    { value: "1bhk", label: "1 BHK" },
    { value: "2bhk", label: "2 BHK" },
    { value: "3bhk", label: "3 BHK" },
    { value: "4bhk", label: "4 BHK" },
];

export default function FlatDetailDialog(
    { children, dialogProps, flatDetails }: { 
        children: React.ReactNode, 
        dialogProps: DialogProps & { mode?: 'add' | 'edit' | 'view' }, 
        flatDetails: FlatData 
    }
) {
    const dispatch = useDispatch();
    const residents = useSelector((state: RootState) => state.flat.residents);
    const [selectedOwnerId, setSelectedOwnerId] = useState<string>(flatDetails.owner_id || "");
    const [selectedResidentIds, setSelectedResidentIds] = useState<string[]>(flatDetails.resident_ids || []);
    const [selectedOwnerData, setSelectedOwnerData] = useState<ResidentData | null>(null);
    const [open, setOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [viewDetails, setViewDetails] = useState(false);
    
    // Determine if this is a new flat (no id) or existing flat (has id)
    const isNewFlat = !flatDetails.id;

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<FlatData>({
        defaultValues: flatDetails,
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });

    useEffect(() => {
        if (open && residents.length === 0) {
            dispatch(getResidents() as any);
        }
    }, [open, dispatch, residents.length]);

    // Update owner details when owner is selected
    useEffect(() => {
        if (selectedOwnerId) {
            const owner = residents.find((r: ResidentData) => r.id === selectedOwnerId);
            if (owner) {
                setSelectedOwnerData(owner);
                setValue("owner_id", owner.id);
            }
        } else {
            setSelectedOwnerData(null);
            setValue("owner_id", undefined);
        }
    }, [selectedOwnerId, residents, setValue]);

    // Handle owner removal
    const handleOwnerRemove = () => {
        setSelectedOwnerId("");
        setSelectedOwnerData(null);
        setValue("owner_id", undefined);
    };

    // Handle view mode when dialog opens
    useEffect(() => {
        if (open && dialogProps.mode === 'view' && !isViewMode) {
            handleViewMode();
        }
    }, [open, dialogProps.mode, isViewMode]);

    // Reset view mode when dialog closes
    useEffect(() => {
        if (!open && isViewMode) {
            setIsViewMode(false);
            setViewDetails(false);
        }
    }, [open]);

    // Handle view mode
    const handleViewMode = () => {
        setIsViewMode(true);
        setViewDetails(true);
        // Set form values from flatDetails
        setValue("flat_type", flatDetails.flat_type);
        setValue("flat_number", flatDetails.flat_number);
        setValue("floor_number", flatDetails.floor_number);
        setValue("owner_id", flatDetails.owner_id);
        setValue("resident_ids", flatDetails.resident_ids);
    };

    // Handle form submission
    const onSubmit: SubmitHandler<FlatData> = async (data: FlatData) => {
        console.log("Form submitted with data:", {
            ...data,
            owner_id: selectedOwnerId,
            resident_ids: selectedResidentIds,
        });
        
        try {
            if (flatDetails.id) {
                // Update existing flat - only update owner_id and resident_ids
                await dispatch(updateFlat(flatDetails.id, {
                    owner_id: selectedOwnerId || undefined,
                    resident_ids: selectedResidentIds.length > 0 ? selectedResidentIds : undefined,
                }) as any);
            } else {
                // Create new flat
                await dispatch(addFlat({
                    flat_type: data.flat_type,
                    flat_number: data.flat_number,
                    floor_number: data.floor_number,
                    owner_id: selectedOwnerId || undefined,
                    resident_ids: selectedResidentIds.length > 0 ? selectedResidentIds : undefined,
                }) as any);
            }
            
            // Close dialog immediately after successful save
            setOpen(false);
            
            // Refresh flats list after dialog closes
            dispatch(getFlats() as any);
            
        } catch (error) {
            console.error('Error adding/updating flat:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>
                            {dialogProps.title}
                        </DialogTitle>
                        <DialogDescription>
                            {dialogProps.description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Flat Type */}
                        <div className="space-y-2">
                            <Label htmlFor="flat_type">Flat Type</Label>
                            {isViewMode ? (
                                <Input
                                    id="flat_type"
                                    value={flatDetails.flat_type || ""}
                                    disabled
                                    placeholder="Flat type"
                                />
                            ) : (
                                <Controller
                                    name="flat_type"
                                    control={control}
                                    rules={isNewFlat ? {
                                        required: "Flat type is required",
                                    } : {}}
                                    render={({ field }) => (
                                        <Select value={field.value || ""} onValueChange={field.onChange}>
                                            <SelectTrigger id="flat_type" className={errors.flat_type ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Select flat type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {FLAT_TYPE_OPTIONS.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            )}
                            {errors.flat_type && (
                                <p className="text-sm text-red-500">{errors.flat_type.message}</p>
                            )}
                        </div>

                        {/* Flat Number */}
                        <div className="space-y-2">
                            <Label htmlFor="flat_number">Flat Number</Label>
                            <Input
                                id="flat_number"
                                placeholder="Enter flat number (e.g., 101)"
                                {...register("flat_number", isNewFlat ? {
                                    required: "Flat number is required",
                                } : {})}
                                disabled={isViewMode}
                                className={errors.flat_number ? "border-red-500" : ""}
                            />
                            {errors.flat_number && (
                                <p className="text-sm text-red-500">{errors.flat_number.message}</p>
                            )}
                        </div>

                        {/* Floor Number */}
                        <div className="space-y-2">
                            <Label htmlFor="floor_number">Floor Number</Label>
                            <Input
                                id="floor_number"
                                type="number"
                                placeholder="Enter floor number"
                                {...register("floor_number", isNewFlat ? {
                                    required: "Floor number is required",
                                    valueAsNumber: true,
                                } : {})}
                                disabled={isViewMode}
                                className={errors.floor_number ? "border-red-500" : ""}
                            />
                            {errors.floor_number && (
                                <p className="text-sm text-red-500">{errors.floor_number.message}</p>
                            )}
                        </div>

                        {/* Owner Selection Dropdown */}
                        <div className="space-y-2">
                            <Label>Select Owner</Label>
                            <ResidentDropdown
                                items={residents}
                                selectedIds={selectedOwnerId ? [selectedOwnerId] : []}
                                onSelect={(id) => setSelectedOwnerId(id)}
                                isMultiple={false}
                                label="Select Owner"
                                triggerText="Add Owner"
                            />

                            {/* Owner Badge */}
                            <CommonBadge
                                items={selectedOwnerData}
                                onRemove={handleOwnerRemove}
                                variant="default"
                                isSingle={true}
                            />
                        </div>

                        {/* Residents Selection Dropdown with Checkboxes */}
                        <div className="space-y-2">
                            <Label>Select Residents</Label>
                            <ResidentDropdown
                                items={residents}
                                selectedIds={selectedResidentIds}
                                onSelect={(id) => {
                                    setSelectedResidentIds(prev =>
                                        prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
                                    );
                                }}
                                isMultiple={true}
                                label="Select Residents"
                                triggerText="Add Residents"
                                filterOutIds={[selectedOwnerId]}
                            />

                            {/* Residents Badges */}
                            <CommonBadge
                                items={selectedResidentIds.map(id => residents.find((r: ResidentData) => r.id === id)).filter(Boolean) as ResidentData[]}
                                onRemove={(id) => setSelectedResidentIds(prev => prev.filter(rid => rid !== id))}
                                variant="secondary"
                                isSingle={false}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                           variant="outline" 
                            className="hover:text-white"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSubmit(onSubmit)();
                            }}
                        >
                            {isSubmitting ? "Saving..." : (isNewFlat ? "Add Flat" : "Save Changes")}
                        </Button>
                    </DialogFooter>

                </DialogContent>
            </form>
        </Dialog>
    );
}