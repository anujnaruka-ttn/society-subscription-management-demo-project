"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CommonAdminClient = ({ children, title, description }: { children: React.ReactNode, title: string, description: string }) => {

    return (
        <Card className='w-full h-full bg-transparent border-none shadow-none p-6'>
            <CardHeader className='w-full px-0 pt-0 pb-8 flex flex-row justify-between items-center'>
                <div className='flex flex-col gap-1.5'>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        {title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {description}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className='p-0 overflow-hidden'>
                {children}
            </CardContent>
        </Card>
    )
}

export default CommonAdminClient;