import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Leaf,
  MapPin,
  Users,
  Zap,
  Shield,
  TrendingUp,
  ArrowRight,
  Car
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">RideShare</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
              <Leaf className="mr-2 h-4 w-4" />
              Save up to 60% on CO2 emissions
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
              Smarter Rides,{' '}
              <span className="text-primary">Greener</span> Planet
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Join the intelligent ride-sharing revolution. Pool rides with
              travelers heading your way, save money, and reduce your carbon
              footprint with real-time matching.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Request a Ride
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="gap-2">
                  <Car className="h-4 w-4" />
                  Become a Driver
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Why Choose RideShare?</h2>
            <p className="text-muted-foreground">
              Cutting-edge technology meets sustainable transportation
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Users className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Intelligent Pooling</CardTitle>
                <CardDescription>
                  Our AI clusters riders heading the same direction with
                  overlapping schedules for optimal matching.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Real-Time Routing</CardTitle>
                <CardDescription>
                  Live traffic updates and dynamic rerouting keeps you
                  informed and on the fastest path.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Leaf className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Carbon Tracking</CardTitle>
                <CardDescription>
                  See exactly how much CO2 you save with each pooled ride.
                  Build eco-streaks and climb the leaderboard.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Flexible Scheduling</CardTitle>
                <CardDescription>
                  Set your pickup window and we'll match you with rides
                  that fit your schedule perfectly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Safety First</CardTitle>
                <CardDescription>
                  Verified drivers, SOS alerts, ride sharing with
                  emergency contacts, and accessibility options.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Smart Pricing</CardTitle>
                <CardDescription>
                  Transparent surge pricing with heatmaps showing demand.
                  Pool to save up to 50% on fares.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to ride smarter?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Join thousands of riders and drivers making a difference.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Sign Up Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              <span className="font-semibold">RideShare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 RideShare. Sustainable mobility for everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
