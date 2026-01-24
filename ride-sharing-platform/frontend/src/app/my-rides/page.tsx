'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import {
    Car,
    Clock,
    MapPin,
    Calendar,
    Leaf,
    ChevronRight,
    Star,
    X
} from 'lucide-react';

interface Ride {
    id: string;
    type: 'upcoming' | 'completed' | 'posted';
    status: string;
    pickupAddress: string;
    dropoffAddress: string;
    date: string;
    time: string;
    fare: number;
    co2Saved: number;
    driverName?: string;
    riderName?: string;
    isDriver: boolean;
}

export default function MyRidesPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [rides, setRides] = useState<Ride[]>([]);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [cancelModalRide, setCancelModalRide] = useState<Ride | null>(null);
    const [reviewModalRide, setReviewModalRide] = useState<Ride | null>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    // Mock data
    useEffect(() => {
        if (isAuthenticated) {
            setRides([
                {
                    id: '1',
                    type: 'upcoming',
                    status: 'Confirmed',
                    pickupAddress: 'MG Road, Bangalore',
                    dropoffAddress: 'Koramangala, Bangalore',
                    date: '2026-01-15',
                    time: '10:00 AM',
                    fare: 150,
                    co2Saved: 2.4,
                    driverName: 'Rajesh Kumar',
                    isDriver: false,
                },
                {
                    id: '2',
                    type: 'completed',
                    status: 'Completed',
                    pickupAddress: 'Indiranagar, Bangalore',
                    dropoffAddress: 'Whitefield, Bangalore',
                    date: '2026-01-13',
                    time: '3:30 PM',
                    fare: 250,
                    co2Saved: 1.8,
                    driverName: 'Priya Sharma',
                    isDriver: false,
                },
                {
                    id: '3',
                    type: 'completed',
                    status: 'Completed',
                    pickupAddress: 'Electronic City, Bangalore',
                    dropoffAddress: 'MG Road, Bangalore',
                    date: '2026-01-12',
                    time: '11:00 AM',
                    fare: 180,
                    co2Saved: 3.2,
                    driverName: 'Arun Patel',
                    isDriver: false,
                },
                {
                    id: '4',
                    type: 'posted',
                    status: 'Active',
                    pickupAddress: 'HSR Layout, Bangalore',
                    dropoffAddress: 'Manyata Tech Park, Bangalore',
                    date: '2026-01-16',
                    time: '9:00 AM',
                    fare: 200,
                    co2Saved: 0,
                    riderName: 'Pending',
                    isDriver: true,
                },
            ]);
        }
    }, [isAuthenticated]);

    const filteredRides = rides.filter(ride => ride.type === activeTab);

    const handleCancelRide = async () => {
        if (!cancelModalRide) return;
        setIsProcessing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Remove ride from list (in real app, update status to 'CANCELLED')
        setRides(prev => prev.filter(r => r.id !== cancelModalRide.id));
        setCancelModalRide(null);
        setIsProcessing(false);
    };

    const handleSubmitReview = async () => {
        if (!reviewModalRide) return;
        setIsProcessing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // In real app, save review to driver's profile
        console.log('Review submitted:', { rideId: reviewModalRide.id, rating: reviewRating, text: reviewText });
        setReviewModalRide(null);
        setReviewRating(5);
        setReviewText('');
        setIsProcessing(false);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="container mx-auto px-4 py-6">
                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="upcoming" className="gap-2">
                            <Clock className="h-4 w-4" />
                            Upcoming
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="gap-2">
                            <Car className="h-4 w-4" />
                            Completed
                        </TabsTrigger>
                        <TabsTrigger value="posted" className="gap-2">
                            <MapPin className="h-4 w-4" />
                            Posted
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming">
                        {filteredRides.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-lg font-semibold mb-2">No upcoming rides</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Book a ride to get started!
                                    </p>
                                    <Link href="/ride">
                                        <Button>Request a Ride</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {filteredRides.map((ride) => (
                                    <RideCard key={ride.id} ride={ride} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="completed">
                        {filteredRides.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-lg font-semibold mb-2">No completed rides</h3>
                                    <p className="text-muted-foreground">
                                        Your completed rides will appear here
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {filteredRides.map((ride) => (
                                    <RideCard key={ride.id} ride={ride} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="posted">
                        {filteredRides.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-lg font-semibold mb-2">No posted rides</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Offer rides to other commuters and earn!
                                    </p>
                                    <Link href="/drive/offer">
                                        <Button>Offer a Ride</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {filteredRides.map((ride) => (
                                    <RideCard key={ride.id} ride={ride} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <Link href="/ride">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="py-6 text-center">
                                <Car className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h3 className="font-semibold">Request a Ride</h3>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/drive/offer">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="py-6 text-center">
                                <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                                <h3 className="font-semibold">Offer a Ride</h3>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </main>

            {/* Cancel Ride Modal */}
            {cancelModalRide && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Cancel Ride</span>
                                <button onClick={() => setCancelModalRide(null)}>
                                    <X className="h-5 w-5" />
                                </button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                Are you sure you want to cancel this ride? This action cannot be undone.
                            </p>
                            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    ⚠️ Cancellation fee of ₹50 may apply if cancelled within 30 minutes of pickup.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setCancelModalRide(null)}>
                                    Keep Ride
                                </Button>
                                <Button variant="destructive" className="flex-1" onClick={handleCancelRide} disabled={isProcessing}>
                                    {isProcessing ? 'Cancelling...' : 'Cancel Ride'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Driver Review Modal */}
            {reviewModalRide && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Rate Your Driver</span>
                                <button onClick={() => setReviewModalRide(null)}>
                                    <X className="h-5 w-5" />
                                </button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <p className="text-muted-foreground mb-2">How was your ride with {reviewModalRide.driverName}?</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setReviewRating(star)}
                                            className="p-1 transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`h-8 w-8 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {reviewRating === 5 ? 'Excellent!' : reviewRating >= 4 ? 'Great!' : reviewRating >= 3 ? 'Good' : reviewRating >= 2 ? 'Fair' : 'Poor'}
                                </p>
                            </div>
                            <textarea
                                placeholder="Share your feedback (optional)"
                                className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            />
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setReviewModalRide(null)}>
                                    Skip
                                </Button>
                                <Button className="flex-1" onClick={handleSubmitReview} disabled={isProcessing}>
                                    {isProcessing ? 'Submitting...' : 'Submit Review'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

function RideCard({ ride }: { ride: Ride }) {
    const statusColors: Record<string, string> = {
        Confirmed: 'bg-green-100 text-green-700',
        Completed: 'bg-gray-100 text-gray-700',
        Active: 'bg-blue-100 text-blue-700',
        Pending: 'bg-yellow-100 text-yellow-700',
    };

    return (
        <Link href={ride.type === 'upcoming' ? `/rides/${ride.id}/track` : `/rides/${ride.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{ride.date}</span>
                            <span className="text-sm text-muted-foreground">at {ride.time}</span>
                        </div>
                        <Badge className={statusColors[ride.status] || 'bg-gray-100'}>
                            {ride.status}
                        </Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                            <span className="text-sm">{ride.pickupAddress}</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                            <span className="text-sm">{ride.dropoffAddress}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 font-semibold">
                                ₹{ride.fare}
                            </span>
                            {ride.co2Saved > 0 && (
                                <span className="flex items-center gap-1 text-sm text-green-600">
                                    <Leaf className="h-4 w-4" />
                                    {ride.co2Saved}kg saved
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {ride.isDriver ? `Rider: ${ride.riderName}` : `Driver: ${ride.driverName}`}
                            <ChevronRight className="h-4 w-4" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
