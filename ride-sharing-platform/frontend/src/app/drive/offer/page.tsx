'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { MapView } from '@/components/MapView';
import { useAuth } from '@/hooks/useAuth';
import { useGeocoding } from '@/hooks/useMapbox';
import {
    Car,
    MapPin,
    DollarSign,
    Briefcase,
    Wind,
    Music,
    Cigarette,
    Search,
    CheckCircle
} from 'lucide-react';

const offerRideSchema = z.object({
    fromAddress: z.string().min(3, 'Please enter pickup location'),
    toAddress: z.string().min(3, 'Please enter destination'),
    date: z.string().min(1, 'Please select a date'),
    time: z.string().min(1, 'Please select departure time'),
    seatsAvailable: z.number().min(1).max(7),
    pricePerSeat: z.number().min(1),
    carModel: z.string().min(2, 'Please enter your car model'),
    licensePlate: z.string().min(2, 'Please enter license plate'),
    luggage: z.boolean(),
    ac: z.boolean(),
    music: z.boolean(),
    smokeFree: z.boolean(),
});

type OfferRideFormData = z.infer<typeof offerRideSchema>;

interface LocationSuggestion {
    id: string;
    placeName: string;
    coordinates: { latitude: number; longitude: number };
}

export default function OfferRidePage() {
    const router = useRouter();
    const { isLoading: authLoading } = useAuth();
    const { geocode } = useGeocoding();

    const [fromSuggestions, setFromSuggestions] = useState<LocationSuggestion[]>([]);
    const [toSuggestions, setToSuggestions] = useState<LocationSuggestion[]>([]);
    const [selectedFrom, setSelectedFrom] = useState<LocationSuggestion | null>(null);
    const [selectedTo, setSelectedTo] = useState<LocationSuggestion | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<OfferRideFormData>({
        resolver: zodResolver(offerRideSchema),
        defaultValues: {
            fromAddress: '',
            toAddress: '',
            date: new Date().toISOString().split('T')[0] ?? '',
            time: '09:00',
            seatsAvailable: 3,
            pricePerSeat: 150,
            carModel: '',
            licensePlate: '',
            luggage: true,
            ac: true,
            music: true,
            smokeFree: true,
        },
    });

    const seatsAvailable = watch('seatsAvailable');
    const pricePerSeat = watch('pricePerSeat');

    const searchFrom = async (query: string) => {
        if (query.length < 3) {
            setFromSuggestions([]);
            return;
        }
        const results = await geocode(query);
        setFromSuggestions(results);
    };

    const searchTo = async (query: string) => {
        if (query.length < 3) {
            setToSuggestions([]);
            return;
        }
        const results = await geocode(query);
        setToSuggestions(results);
    };

    const handleFromSelect = (suggestion: LocationSuggestion) => {
        setSelectedFrom(suggestion);
        setValue('fromAddress', suggestion.placeName);
        setFromSuggestions([]);
    };

    const handleToSelect = (suggestion: LocationSuggestion) => {
        setSelectedTo(suggestion);
        setValue('toAddress', suggestion.placeName);
        setToSuggestions([]);
    };

    const onSubmit: SubmitHandler<OfferRideFormData> = async () => {
        if (!selectedFrom || !selectedTo) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSuccess(true);

        // Redirect after success
        setTimeout(() => {
            router.push('/my-rides');
        }, 2000);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
                <Card className="max-w-md text-center">
                    <CardContent className="py-12">
                        <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Ride Posted!</h2>
                        <p className="text-muted-foreground mb-6">
                            Your ride has been posted. Riders will be notified.
                        </p>
                        <Link href="/my-rides">
                            <Button size="lg">View My Rides</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="container mx-auto px-4 py-6">
                <div className="grid gap-6 lg:grid-cols-5">
                    {/* Form */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Route Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Route Details
                                    </CardTitle>
                                    <CardDescription>
                                        Where are you driving from and to?
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* From */}
                                    <div className="relative">
                                        <Label htmlFor="from">From</Label>
                                        <p className="text-xs text-muted-foreground mb-1.5">Your starting point</p>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="from"
                                                placeholder="Enter pickup location"
                                                className="pl-10"
                                                {...register('fromAddress')}
                                                onChange={(e) => {
                                                    register('fromAddress').onChange(e);
                                                    searchFrom(e.target.value);
                                                }}
                                            />
                                        </div>
                                        {fromSuggestions.length > 0 && (
                                            <ul className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-auto">
                                                {fromSuggestions.map((s) => (
                                                    <li
                                                        key={s.id}
                                                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                                        onClick={() => handleFromSelect(s)}
                                                    >
                                                        {s.placeName}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {errors.fromAddress && (
                                            <p className="text-sm text-red-500 mt-1">{errors.fromAddress.message}</p>
                                        )}
                                    </div>

                                    {/* To */}
                                    <div className="relative">
                                        <Label htmlFor="to">To</Label>
                                        <p className="text-xs text-muted-foreground mb-1.5">Your destination</p>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="to"
                                                placeholder="Enter destination"
                                                className="pl-10"
                                                {...register('toAddress')}
                                                onChange={(e) => {
                                                    register('toAddress').onChange(e);
                                                    searchTo(e.target.value);
                                                }}
                                            />
                                        </div>
                                        {toSuggestions.length > 0 && (
                                            <ul className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-auto">
                                                {toSuggestions.map((s) => (
                                                    <li
                                                        key={s.id}
                                                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                                        onClick={() => handleToSelect(s)}
                                                    >
                                                        {s.placeName}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {errors.toAddress && (
                                            <p className="text-sm text-red-500 mt-1">{errors.toAddress.message}</p>
                                        )}
                                    </div>

                                    {/* Date & Time */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="date">Date</Label>
                                            <p className="text-xs text-muted-foreground mb-1.5">When are you leaving?</p>
                                            <Input
                                                id="date"
                                                type="date"
                                                min={new Date().toISOString().split('T')[0]}
                                                max={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                                {...register('date')}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="time">Departure Time</Label>
                                            <p className="text-xs text-muted-foreground mb-1.5">Your planned departure</p>
                                            <Input
                                                id="time"
                                                type="time"
                                                {...register('time')}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Vehicle Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Car className="h-5 w-5" />
                                        Vehicle Details
                                    </CardTitle>
                                    <CardDescription>
                                        Help riders identify your car
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="carModel">Car Model</Label>
                                            <p className="text-xs text-muted-foreground mb-1.5">Select your car</p>
                                            <select
                                                id="carModel"
                                                {...register('carModel')}
                                                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            >
                                                <option value="">Select a car model</option>
                                                <optgroup label="Hatchback">
                                                    <option value="Maruti Swift">Maruti Swift</option>
                                                    <option value="Maruti Alto">Maruti Alto</option>
                                                    <option value="Maruti Baleno">Maruti Baleno</option>
                                                    <option value="Hyundai i20">Hyundai i20</option>
                                                    <option value="Hyundai Grand i10">Hyundai Grand i10</option>
                                                    <option value="Tata Tiago">Tata Tiago</option>
                                                    <option value="Tata Altroz">Tata Altroz</option>
                                                </optgroup>
                                                <optgroup label="Sedan">
                                                    <option value="Maruti Dzire">Maruti Dzire</option>
                                                    <option value="Honda City">Honda City</option>
                                                    <option value="Hyundai Verna">Hyundai Verna</option>
                                                    <option value="Honda Amaze">Honda Amaze</option>
                                                    <option value="Tata Tigor">Tata Tigor</option>
                                                    <option value="Skoda Slavia">Skoda Slavia</option>
                                                </optgroup>
                                                <optgroup label="SUV">
                                                    <option value="Maruti Brezza">Maruti Brezza</option>
                                                    <option value="Hyundai Creta">Hyundai Creta</option>
                                                    <option value="Kia Seltos">Kia Seltos</option>
                                                    <option value="Tata Nexon">Tata Nexon</option>
                                                    <option value="Mahindra XUV700">Mahindra XUV700</option>
                                                    <option value="Toyota Innova">Toyota Innova</option>
                                                    <option value="Toyota Fortuner">Toyota Fortuner</option>
                                                </optgroup>
                                                <optgroup label="Luxury">
                                                    <option value="BMW 3 Series">BMW 3 Series</option>
                                                    <option value="Mercedes C-Class">Mercedes C-Class</option>
                                                    <option value="Audi A4">Audi A4</option>
                                                </optgroup>
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="licensePlate">License Plate</Label>
                                            <p className="text-xs text-muted-foreground mb-1.5">For rider identification</p>
                                            <Input
                                                id="licensePlate"
                                                placeholder="KA 01 AB 1234"
                                                {...register('licensePlate')}
                                            />
                                        </div>
                                    </div>

                                    {/* Seats */}
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <div>
                                                <Label>Available Seats</Label>
                                                <p className="text-xs text-muted-foreground">How many passengers can you take?</p>
                                            </div>
                                            <Badge className="text-lg px-3">{seatsAvailable}</Badge>
                                        </div>
                                        <Slider
                                            value={[seatsAvailable]}
                                            onValueChange={(v) => v[0] && setValue('seatsAvailable', v[0])}
                                            min={1}
                                            max={7}
                                            step={1}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pricing & Preferences */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        Pricing & Amenities
                                    </CardTitle>
                                    <CardDescription>
                                        Set your price and ride preferences
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Price */}
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <div>
                                                <Label>Price per Seat</Label>
                                                <p className="text-xs text-muted-foreground">Suggested based on distance</p>
                                            </div>
                                            <Badge variant="secondary" className="text-lg px-3">₹{pricePerSeat}</Badge>
                                        </div>
                                        <Slider
                                            value={[pricePerSeat]}
                                            onValueChange={(v) => v[0] && setValue('pricePerSeat', v[0])}
                                            min={50}
                                            max={500}
                                            step={10}
                                        />
                                    </div>

                                    {/* Amenities */}
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="h-4 w-4" />
                                                <span className="text-sm">Luggage OK</span>
                                            </div>
                                            <Switch
                                                checked={watch('luggage')}
                                                onCheckedChange={(v) => setValue('luggage', v)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Wind className="h-4 w-4" />
                                                <span className="text-sm">AC</span>
                                            </div>
                                            <Switch
                                                checked={watch('ac')}
                                                onCheckedChange={(v) => setValue('ac', v)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Music className="h-4 w-4" />
                                                <span className="text-sm">Music</span>
                                            </div>
                                            <Switch
                                                checked={watch('music')}
                                                onCheckedChange={(v) => setValue('music', v)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Cigarette className="h-4 w-4" />
                                                <span className="text-sm">Smoke-Free</span>
                                            </div>
                                            <Switch
                                                checked={watch('smokeFree')}
                                                onCheckedChange={(v) => setValue('smokeFree', v)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full h-14 text-lg"
                                disabled={isSubmitting || !selectedFrom || !selectedTo}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner size="sm" className="mr-2" />
                                        Posting...
                                    </>
                                ) : (
                                    'Post Ride'
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Map */}
                    <div className="lg:col-span-2">
                        <Card className="h-[500px] sticky top-24">
                            <CardContent className="p-0 h-full">
                                <MapView
                                    className="h-full rounded-lg"
                                    pickupLocation={selectedFrom?.coordinates}
                                    dropoffLocation={selectedTo?.coordinates}
                                    showRoute={!!(selectedFrom && selectedTo)}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
