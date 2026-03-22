import getRazorpayOptions from './razorpayOptions';
import '@/types/razorpay';

declare global {
    interface Window {
        Razorpay: new (options: any) => any;
    }
}

export const openRazorpay = (amount: number, flatId?: string, monthYear?: string) => {
    const options = getRazorpayOptions(amount, flatId, monthYear);
    
    // Check if Razorpay is loaded
    if (!(window as any).Razorpay) {
        console.error('Razorpay SDK not loaded');
        return null;
    }
    
    const rzp = new (window as any).Razorpay(options);
    return rzp;
};

export default openRazorpay;