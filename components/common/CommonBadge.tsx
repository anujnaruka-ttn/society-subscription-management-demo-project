import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import Image from "next/image"
import { ResidentData } from "@/types/flatData"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CommonBadgeProps {
    items: ResidentData | ResidentData[] | null;
    onRemove?: (id: string) => void;
    variant?: "default" | "secondary";
    isSingle?: boolean;
}

export default function CommonBadge({ items, onRemove, variant = "default", isSingle = false }: CommonBadgeProps) {
    return (
        <TooltipProvider>
            {(() => {
                // Handle single badge or empty state
                if (isSingle) {
                    const item = items as ResidentData | null;
                    if (!item) return null;
                    
                    return (
                        <div className="flex flex-wrap gap-2">
                            <Badge variant={variant} className="gap-1">
                                <div className="flex items-center gap-1">
                                    {item.profile_image ? (
                                        <Image
                                            src={item.profile_image}
                                            alt={item.name}
                                            className="w-4 h-4 rounded-full object-cover"
                                            width={16}
                                            height={16}
                                            unoptimized={true}
                                        />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-semibold">
                                            {item.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                    )}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="truncate">{item.name}</span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{item.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                {onRemove && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onRemove?.(item.id);
                                        }}
                                        className="hover:bg-white/20 rounded p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </Badge>
                        </div>
                    );
                }

                // Handle multiple badges
                const itemsArray = items as ResidentData[];
                if (!itemsArray || itemsArray.length === 0) return null;

                return (
                    <div className="flex flex-wrap gap-2">
                        {itemsArray.map((item) => (
                            <Badge key={item.id} variant={variant} className="gap-1">
                                <div className="flex items-center gap-1">
                                    {item.profile_image ? (
                                        <Image
                                            src={item.profile_image}
                                            alt={item.name}
                                            className="w-4 h-4 rounded-full object-cover"
                                            width={16}
                                            height={16}
                                            unoptimized={true}
                                        />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-semibold">
                                            {item.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                    )}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="truncate">{item.name}</span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{item.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                {onRemove && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onRemove?.(item.id);
                                        }}
                                        className="hover:bg-white/20 rounded p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </Badge>
                        ))}
                    </div>
                );
            })()}
        </TooltipProvider>
    );
}
