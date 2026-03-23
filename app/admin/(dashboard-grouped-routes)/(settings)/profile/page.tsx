'use client'

import { ProfileContent } from '@/components/common/CommonProfile';
import CommonHeader from '@/components/Dashboard/common/CommonHeader';

export default function AdminProfilePage() {
    return (
        <CommonHeader title="Profile" description="Update your admin account information and settings">
            <ProfileContent />
        </CommonHeader>
    );
}