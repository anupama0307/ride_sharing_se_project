'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import {
    Car,
    Leaf,
    MapPin,
    TrendingUp,
    Clock,
    User,
    History,
    ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user.fullName}! 👋
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Ready for your next eco-friendly ride?
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Link href="/ride">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-full bg-primary/10 p-3">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Request a Ride</h3>
                                        <p className="text-sm text-muted-foreground">Find your next trip</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/drive">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-full bg-blue-500/10 p-3">
                                        <Car className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Become a Driver</h3>
                                        <p className="text-sm text-muted-foreground">Start earning today</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/history">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-full bg-orange-500/10 p-3">
                                        <History className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Ride History</h3>
                                        <p className="text-sm text-muted-foreground">View past trips</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/profile">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-full bg-purple-500/10 p-3">
                                        <User className="h-6 w-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">My Profile</h3>
                                        <p className="text-sm text-muted-foreground">Manage your account</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Eco Stats */}
                <h2 className="text-xl font-semibold mb-4">Your Eco Impact 🌱</h2>
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-green-100">Total CO₂ Saved</CardDescription>
                            <CardTitle className="text-3xl">{user.totalCarbonSaved.toFixed(1)} kg</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-green-100">
                                <Leaf className="h-4 w-4" />
                                <span className="text-sm">By choosing pooled rides</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Current Streak</CardDescription>
                            <CardTitle className="text-3xl flex items-center gap-2">
                                {user.currentStreak} days
                                <span className="text-2xl">🔥</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm">Keep up the eco-momentum!</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Eco Points</CardDescription>
                            <CardTitle className="text-3xl">{user.ecoScore}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">Climb the leaderboard!</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                        <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No recent rides yet</p>
                        <p className="text-sm mt-2">Book your first ride to start your eco-journey!</p>
                        <Link href="/ride">
                            <Button className="mt-4 gap-2">
                                Request a Ride
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
