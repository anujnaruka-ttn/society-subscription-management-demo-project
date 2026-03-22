export interface IRazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image?: string;
    handler: (response: any) => void;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    notes: {
        flatId: string;
        address: string;
    };
    theme: {
        color: string;
    };
    config: {
        display: {
            blocks: {
                banks: {
                    name: string;
                    instruments: {
                        method: string;
                    }[];
                };
            };
            sequence: string[];
            preferences: {
                show_default_blocks: boolean;
                hide: string[];
            };
        };
    };
}
