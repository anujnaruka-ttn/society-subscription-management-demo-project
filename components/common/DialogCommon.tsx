import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogProps } from "@/types/dialogProps"
import { FlatData } from "@/types/flatData"

export default function DialogCommon(
    { children, dialogProps, flatDetails }: { children: React.ReactNode, dialogProps: DialogProps, flatDetails: FlatData }
) {
    return (
        <Dialog>

            <form>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{dialogProps.title}</DialogTitle>
                        <DialogDescription>
                            {dialogProps.description}
                        </DialogDescription>
                    </DialogHeader>

                    <Label htmlFor="owner-1">Owner</Label>
                    <Input id="owner-1" name="owner" defaultValue={flatDetails.owner} />
                    <Label htmlFor="email-1">Email</Label>
                    <Input id="email-1" name="email" defaultValue={flatDetails.email} />
                    <Label htmlFor="phone-1">Phone</Label>
                    <Input id="phone-1" name="phone" defaultValue={flatDetails.phone} />
                    <Label htmlFor="flatAddress-1">Flat Address</Label>
                    <Input id="flatAddress-1" name="flatAddress" defaultValue={flatDetails.flatAddress} />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>

                </DialogContent>

            </form>
        </Dialog>
    )
}
