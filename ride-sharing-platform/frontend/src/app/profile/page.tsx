'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import {
    Mail,
    Phone,
    Leaf,
    TrendingUp,
    Calendar,
    Edit,
    X,
    Check
} from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isLoading, isAuthenticated, logout, updateProfile } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (user) {
            setEditName(user.fullName);
            setEditPhone(user.phone || '');
        }
    }, [user]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setSaveError('');
        try {
            // Split name into first and last name for API
            const nameParts = editName.trim().split(/\s+/);
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || firstName;

            const updateData: { firstName: string; lastName: string; phone?: string } = {
                firstName,
                lastName,
            };
            if (editPhone) {
                updateData.phone = editPhone;
            }

            await updateProfile(updateData);

            setIsEditModalOpen(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to save profile:', error);
            setSaveError('Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-4">
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Success Message */}
                {saveSuccess && (
                    <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-2 text-green-600">
                        <Check className="h-5 w-5" />
                        Profile updated successfully!
                    </div>
                )}

                {/* Profile Header */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-6">
                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-3xl font-bold">
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold">{user.fullName}</h1>
                                <p className="text-muted-foreground capitalize">{user.role}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="inline-flex items-center text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4 mr-1" />
                                        {user.email}
                                    </span>
                                    {user.phone && (
                                        <span className="inline-flex items-center text-sm text-muted-foreground">
                                            <Phone className="h-4 w-4 mr-1" />
                                            {user.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditModalOpen(true)}>
                                <Edit className="h-4 w-4" />
                                Edit
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Eco Stats */}
                <h2 className="text-lg font-semibold mb-4">Your Eco Impact</h2>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>CO₂ Saved</CardDescription>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Leaf className="h-5 w-5 text-green-500" />
                                {user.totalCarbonSaved.toFixed(1)} kg
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Current Streak</CardDescription>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-orange-500" />
                                {user.currentStreak} days
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Eco Points</CardDescription>
                            <CardTitle className="text-2xl">{user.ecoScore}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Account Info */}
                <h2 className="text-lg font-semibold mb-4">Account Information</h2>
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Member Since</span>
                            <span className="font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Account Type</span>
                            <span className="font-medium capitalize">{user.role}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-muted-foreground">Email Verified</span>
                            <span className="text-green-600 font-medium">✓ Verified</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="mt-6 flex gap-4">
                    <Link href="/dashboard" className="flex-1">
                        <Button variant="outline" className="w-full">
                            Back to Dashboard
                        </Button>
                    </Link>
                    <Link href="/my-rides" className="flex-1">
                        <Button className="w-full">
                            View My Rides
                        </Button>
                    </Link>
                </div>
            </main>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Edit Profile</span>
                                <button onClick={() => setIsEditModalOpen(false)}>
                                    <X className="h-5 w-5" />
                                </button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="editName">Full Name</Label>
                                <Input
                                    id="editName"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="editPhone">Phone Number</Label>
                                <Input
                                    id="editPhone"
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                            <div>
                                <Label htmlFor="editEmail">Email (cannot be changed)</Label>
                                <Input
                                    id="editEmail"
                                    value={user.email}
                                    disabled
                                    className="bg-gray-100 dark:bg-gray-800"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button variant="outline" className="flex-1" onClick={() => setIsEditModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button className="flex-1" onClick={handleSaveProfile} disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
