// hooks/use-toast.ts
import { toast } from "sonner";

// Define a type for the custom hook's return value for better type safety (optional)
type ToastType = {
    info: (message: string, description?: string) => void;
    success: (message: string, description?: string) => void;
    error: (message: string, description?: string) => void;
    // You can add more types like warning, promise, etc.
};

export const useToast = (): ToastType => {

    const position = "top-right";
    return {
        info: (message, description) => {
            toast(message, {
                description: description,
                // Add any common configurations here, e.g., duration
                duration: 3000,
                position
            });
        },
        success: (message, description) => {
            toast.success(message, {
                description: description,
                duration: 3000,
                position
            });
        },
        error: (message, description) => {
            toast.error(message, {
                description: description,
                duration: 4000, // Maybe errors last longer
                position
            });
        },
    };
};
