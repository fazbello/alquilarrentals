
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Car } from "@/api/entities";
import { Booking } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Car as CarIcon, 
  Calendar, 
  CreditCard, 
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  ArrowRight,
  MapPin,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalSpent: 0,
    memberSince: null
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [featuredCars, setFeaturedCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Load bookings
      const bookings = await Booking.filter({ user_id: userData.id }, '-created_date', 10);
      setRecentBookings(bookings);

      // Calculate stats
      const totalBookings = bookings.length;
      const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
      const totalSpent = bookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

      setStats({
        totalBookings,
        activeBookings,
        totalSpent,
        memberSince: userData.created_date
      });

      // Load featured cars
      const cars = await Car.filter({ status: 'available' }, '-created_date', 4);
      setFeaturedCars(cars);

    } catch (error) {
      console.error("User not authenticated, showing guest view:", error);
      setUser(null);
      // Even if not authenticated, still load featured cars for public view
      const cars = await Car.filter({ status: 'available' }, '-created_date', 4);
      setFeaturedCars(cars);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'confirmed': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getVerificationProgress = () => {
    if (!user) return 0;
    let progress = 20; // Base for account creation
    
    if (user.phone_number) progress += 15;
    if (user.date_of_birth) progress += 15;
    if (user.address) progress += 20;
    if (user.identification?.verification_status === 'approved') progress += 30;
    
    return progress;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
       <div className="p-4 md:p-8 space-y-8">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome, Guest
            </h1>
            <p className="text-slate-400">
              Browse our fleet and explore our services.
            </p>
          </div>
          <Link to={createPageUrl("BrowseCars")}>
            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-medium px-6">
              <CarIcon className="w-4 h-4 mr-2" />
              Browse Fleet
            </Button>
          </Link>
        </div>
         <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Lock className="h-6 w-6 text-amber-400 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">View-Only Access</h3>
                <p className="text-slate-300">
                  This is a guest view of the dashboard. Certain features like bookings and user stats are disabled.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
                 <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-xl font-semibold text-white">Featured Cars</CardTitle>
                      <Link to={createPageUrl("BrowseCars")}>
                        <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300">
                          Browse All
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {featuredCars.map((car) => (
                        <div key={car.id} className="group cursor-pointer">
                          <Link to={createPageUrl(`BrowseCars?car=${car.id}`)}>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all duration-300">
                              <div className="flex items-center gap-3 mb-3">
                                <CarIcon className="w-5 h-5 text-amber-400" />
                                <div>
                                  <p className="font-medium text-white">{car.make} {car.model}</p>
                                  <p className="text-xs text-slate-400">{car.year} • {car.category}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <MapPin className="w-3 h-3" />
                                  {car.location?.city || 'Available'}
                                </div>
                                <p className="font-semibold text-amber-400">${car.daily_rate}/day</p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
            </div>
        </div>
       </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.full_name || 'Member'}
          </h1>
          <p className="text-slate-400">
            Ready for your next luxury driving experience?
          </p>
        </div>
        <Link to={createPageUrl("BrowseCars")}>
          <Button className="bg-amber-500 hover:bg-amber-600 text-black font-medium px-6">
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalBookings}</div>
            <p className="text-xs text-slate-500 mt-1">
              {stats.activeBookings} currently active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${stats.totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Lifetime value
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Member Status</CardTitle>
            <Star className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalSpent > 50000 ? 'Platinum' : stats.totalSpent > 20000 ? 'Gold' : stats.totalSpent > 5000 ? 'Silver' : 'Bronze'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Premium benefits active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Account Verification</CardTitle>
            <CheckCircle className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{getVerificationProgress()}%</div>
            <Progress value={getVerificationProgress()} className="mt-2 h-1" />
            <p className="text-xs text-slate-500 mt-1">Profile completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {getVerificationProgress() < 100 && (
        <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Complete Your Profile</h3>
                <p className="text-slate-300 mb-4">
                  Complete your profile verification to unlock premium features and faster booking approvals.
                </p>
                <div className="flex gap-3">
                  <Link to={createPageUrl("Profile")}>
                    <Button variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black">
                      Complete Profile
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-white">Recent Bookings</CardTitle>
              <Link to={createPageUrl("MyBookings")}>
                <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentBookings.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No bookings yet</p>
                  <p className="text-sm">Book your first luxury car to get started</p>
                </div>
              ) : (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(booking.status)}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-white">#{booking.booking_reference}</p>
                        <Badge variant="outline" className="text-xs">
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400">
                        {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">${booking.total_amount}</p>
                      <p className="text-xs text-slate-400">Total</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Featured Cars */}
        <div>
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-white">Featured Cars</CardTitle>
              <Link to={createPageUrl("BrowseCars")}>
                <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300">
                  Browse All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredCars.map((car) => (
                <div key={car.id} className="group cursor-pointer">
                  <Link to={createPageUrl(`BrowseCars?car=${car.id}`)}>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <CarIcon className="w-5 h-5 text-amber-400" />
                        <div>
                          <p className="font-medium text-white">{car.make} {car.model}</p>
                          <p className="text-xs text-slate-400">{car.year} • {car.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <MapPin className="w-3 h-3" />
                          {car.location?.city || 'Available'}
                        </div>
                        <p className="font-semibold text-amber-400">${car.daily_rate}/day</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
