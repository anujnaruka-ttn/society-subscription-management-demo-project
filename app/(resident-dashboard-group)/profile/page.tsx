
'use client'

import { ProfileContent } from '@/components/common/CommonProfile';
import CommonHeader from '@/components/Dashboard/common/CommonHeader';

export default function ResidentProfilePage() {
    return (
        <main className='w-full h-full'>
            <CommonHeader title="Profile" description="Update your personal information and account settings">
                <ProfileContent title="Profile" />
            </CommonHeader>
        </main>
    );
}
