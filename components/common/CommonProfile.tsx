'use client'
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Edit2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { changeProfile, updateProfile } from '@/lib/profileApis';

// Reusable Profile Content Component
export const ProfileContent = ({ title = "My Profile", description = "Manage your profile information and account settings" }: { title?: string; description?: string }) => {
    const { user } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const { theme } = useTheme();

    // Sync name and phone number state with user object whenever it changes
    useEffect(() => {
        if (user) {
            setName(user?.name || '');
            setPhoneNumber(user?.phone_number || '');
        }
    }, [user]);

    const handleProfilePictureEdit = () => {
        fileInputRef.current?.click();
    };

    const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log("Selected file:", file);
        if (!file) return;

        setIsUpdating(true);
        try {
            await dispatch(changeProfile(file) as any);
        } finally {
            setIsUpdating(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handlePhoneNumberKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            try {
                await dispatch(updateProfile({ phoneNumber }) as any);
            } catch (error) {
                console.error("Failed to update phone number:", error);
            }
        }
    };

    const handleNameKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            try {
                await dispatch(updateProfile({ name }) as any);
            } catch (error) {
                console.error("Failed to update name:", error);
            }
        }
    };

    return (
            <Card className='w-full h-full bg-transparent border-none shadow-none p-0'>
                <CardContent className='p-0 flex flex-col gap-4'>
                    {/* Profile Card with Avatar and Basic Info */}
                    <Card className='border-richblack-700 bg-richblack-800'>
                        <CardContent className='p-6'>
                            <div className='w-full h-fit flex gap-6 items-center'>
                                <div className='relative'>
                                    <Image
                                        src={user?.profile_image}
                                        alt='Profile'
                                        width={78}
                                        height={78}
                                        className='rounded-full border-2 border-border object-cover'
                                        unoptimized
                                    />
                                    <input
                                        ref={fileInputRef}
                                        type='file'
                                        accept='image/*'
                                        onChange={handleProfileImageChange}
                                        className='hidden'
                                    />
                                    <Button
                                        onClick={handleProfilePictureEdit}
                                        size='icon'
                                        disabled={isUpdating}
                                        className='absolute top-0 right-0 rounded-full h-8 w-8 cursor-pointer'
                                        title='Edit profile picture'
                                        variant={theme === 'light' ? 'outline' : 'secondary'}
                                    >
                                        <Edit2 size={16} />
                                    </Button>
                                </div>
                                <div className='w-[80%] h-fit flex flex-col gap-0.5'>
                                    <header className='text-richblack-5 text-lg font-semibold'>
                                        {user?.name}
                                    </header>
                                    {user?.email && (
                                        <p className='text-richblack-300 text-sm font-normal'>
                                            {user.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Details Card */}
                    <Card className='border-richblack-700 bg-richblack-800'>
                        <CardHeader>
                            <CardTitle className='text-lg text-richblack-5'>
                                Personal Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='pt-0'>
                            <div className='w-full h-fit flex flex-col gap-4'>
                                {/* Name Field */}
                                <div className='flex flex-col gap-2'>
                                    <Label className='text-sm text-richblack-300'>Full Name</Label>
                                    <Input
                                        type='text'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyDown={handleNameKeyDown}
                                        placeholder='Enter your full name'
                                        className='bg-richblack-700 border-richblack-600 text-richblack-5 placeholder-richblack-400'
                                    />
                                </div>

                                {/* Email Field */}
                                <div className='flex flex-col gap-2'>
                                    <Label className='text-sm text-richblack-300'>Email</Label>
                                    <Input
                                        type='email'
                                        value={user?.email || ''}
                                        disabled
                                        className='bg-richblack-700 border-richblack-600 text-richblack-5 placeholder-richblack-400'
                                    />
                                </div>

                                {/* Phone Number Field */}
                                <div className='flex flex-col gap-2'>
                                    <Label className='text-sm text-richblack-300'>Phone Number</Label>
                                    <Input
                                        type='tel'
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        onKeyDown={handlePhoneNumberKeyDown}
                                        placeholder='Enter your phone number'
                                        className='bg-richblack-700 border-richblack-600 text-richblack-5 placeholder-richblack-400'
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Change Password Card */}
                    <Card className='border-richblack-700 bg-richblack-800'>
                        <CardHeader>
                            <CardTitle className='text-lg text-richblack-5'>
                                Change Password
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='pt-0'>
                            <div className='w-full h-fit flex flex-col gap-4'>
                                {/* Current Password Field */}
                                <div className='flex flex-col gap-2'>
                                    <Label className='text-sm text-richblack-300'>Current Password</Label>
                                    <div className='relative'>
                                        <Input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            placeholder='Enter current password'
                                            className='bg-richblack-700 border-richblack-600 text-richblack-5 placeholder-richblack-400 pr-10'
                                        />
                                        <button
                                            type='button'
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className='absolute right-3 top-1/2 -translate-y-1/2 text-richblack-300 hover:text-richblack-100 transition-colors'
                                        >
                                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password Field */}
                                <div className='flex flex-col gap-2'>
                                    <Label className='text-sm text-richblack-300'>New Password</Label>
                                    <div className='relative'>
                                        <Input
                                            type={showNewPassword ? 'text' : 'password'}
                                            placeholder='Enter new password'
                                            className='bg-richblack-700 border-richblack-600 text-richblack-5 placeholder-richblack-400 pr-10'
                                        />
                                        <button
                                            type='button'
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className='absolute right-3 top-1/2 -translate-y-1/2 text-richblack-300 hover:text-richblack-100 transition-colors'
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Update Password Button */}
                                <Button className='w-fit mt-4 hover:text-white'
                                variant={"outline"}>
                                    Update Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
    );
};
