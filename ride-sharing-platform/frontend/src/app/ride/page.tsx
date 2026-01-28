'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Car, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RideRequestForm } from '@/components/RideRequestForm';
import { MapView } from '@/components/MapView';
import { CarbonComparison } from '@/components/CarbonComparison';
import { RideMatchResults } from '@/components/RideMatchResults';
import api from '@/lib/api';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export default function RideRequestPage() {
  const router = useRouter();
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [matchingRides, setMatchingRides] = useState<any[] | null>(null);
  const [carbonEstimate, setCarbonEstimate] = useState<any | null>(null);

  // Calculate distance between pickup and dropoff
  const calculateDistance = () => {
    if (!pickupLocation || !dropoffLocation) return 0;
    const R = 6371; // Earth's radius in km
    const dLat = ((dropoffLocation.latitude - pickupLocation.latitude) * Math.PI) / 180;
    const dLon = ((dropoffLocation.longitude - pickupLocation.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pickupLocation.latitude * Math.PI) / 180) *
      Math.cos((dropoffLocation.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSubmit = async (data: {
    pickupLocation: Location;
    dropoffLocation: Location;
    pickupWindowStart: string;
    pickupWindowEnd: string;
    poolingEnabled: boolean;
    genderPreference: 'any' | 'female_only' | 'male_only';
    accessibilityNeeds: string[];
  }) => {
    // Store search params in sessionStorage for the results page
    sessionStorage.setItem('rideSearchParams', JSON.stringify(data));

    // Build URL with search params
    const params = new URLSearchParams({
      pickup: data.pickupLocation.address || 'Pickup Location',
      dropoff: data.dropoffLocation.address || 'Dropoff Location',
      pickupLat: String(data.pickupLocation.latitude),
      pickupLng: String(data.pickupLocation.longitude),
      dropoffLat: String(data.dropoffLocation.latitude),
      dropoffLng: String(data.dropoffLocation.longitude),
    });

    // Redirect to searching page with params
    router.push(`/rides/searching?${params.toString()}`);
  };

  const handleBookRide = async (rideId: string) => {
    if (!pickupLocation || !dropoffLocation) return;

    try {
      await api.createBooking(rideId, {
        pickupPoint: pickupLocation,
        dropoffPoint: dropoffLocation,
      });
      router.push(`/rides/${rideId}`);
    } catch (error) {
      console.error('Failed to book ride:', error);
    }
  };

  const distanceKm = calculateDistance();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <RideRequestForm
              onSubmit={handleSubmit}
              onPickupChange={setPickupLocation}
              onDropoffChange={setDropoffLocation}
              pickupLocation={pickupLocation}
              dropoffLocation={dropoffLocation}
              isLoading={isLoading}
            />

            {/* Carbon Comparison - Show when both locations selected */}
            {pickupLocation && dropoffLocation && distanceKm > 0 && (
              <CarbonComparison
                distanceKm={distanceKm}
                passengers={2}
                isElectric={false}
              />
            )}
          </div>

          {/* Right Column - Map and Results */}
          <div className="space-y-6">
            {/* Map */}
            <div className="h-[400px] rounded-lg overflow-hidden border">
              <MapView
                pickupLocation={pickupLocation}
                dropoffLocation={dropoffLocation}
                showRoute={true}
                onPickupSelect={(loc) =>
                  setPickupLocation({ ...loc, address: loc.address || 'Selected on map' })
                }
                onDropoffSelect={(loc) =>
                  setDropoffLocation({ ...loc, address: loc.address || 'Selected on map' })
                }
              />
            </div>

            {/* Matching Rides Results */}
            {matchingRides && (
              <RideMatchResults
                rides={matchingRides}
                onBookRide={handleBookRide}
                carbonEstimate={carbonEstimate}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
