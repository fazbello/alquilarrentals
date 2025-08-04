
import React, { useState, useEffect } from "react";
import { Booking } from "@/api/entities";
import { Car } from "@/api/entities";
import { User } from "@/api/entities";
import { createPageUrl } from '@/utils';
import {
  Calendar,
  Clock,
  MapPin,
  Car as CarIcon,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Download,
  MessageCircle,
  Lock // Added Lock import
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState({});
  const [user, setUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const bookingsData = await Booking.filter({ user_id: userData.id }, '-created_date');
      setBookings(bookingsData);

      // Load car details for each booking
      const carIds = [...new Set(bookingsData.map(booking => booking.car_id))];
      const carsData = {};
      for (const carId of carIds) {
        const carList = await Car.filter({ id: carId });
        if (carList.length > 0) {
          carsData[carId] = carList[0];
        }
      }
      setCars(carsData);

    } catch (error) {
      console.error("User not authenticated, showing guest view:", error);
      setUser(null); // Set user to null to indicate unauthenticated state
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'border-green-400 text-green-400';
      case 'confirmed': return 'border-blue-400 text-blue-400';
      case 'pending': return 'border-yellow-400 text-yellow-400';
      case 'completed': return 'border-gray-400 text-gray-400';
      case 'cancelled': return 'border-red-400 text-red-400';
      default: return 'border-gray-400 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const filterBookings = (status) => {
    if (status === 'all') return bookings;
    return bookings.filter(booking => booking.status === status);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-64"></div>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // New conditional rendering for unauthenticated users
  if (!user) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardContent className="p-12 text-center flex flex-col items-center gap-4">
            <Lock className="w-16 h-16 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Access Denied</h2>
            <p className="text-slate-400">
              Please log in to view and manage your bookings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
        <p className="text-slate-400">Track and manage your rental reservations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Bookings</p>
                <p className="text-2xl font-bold text-white">{bookings.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active</p>
                <p className="text-2xl font-bold text-white">
                  {bookings.filter(b => b.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Spent</p>
                <p className="text-2xl font-bold text-white">
                  ${bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0).toLocaleString()}
                </p>
              </div>
              <CarIcon className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white/10">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {['all', 'active', 'confirmed', 'pending', 'completed'].map(status => (
          <TabsContent key={status} value={status} className="space-y-4">
            {filterBookings(status).length === 0 ? (
              <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No {status === 'all' ? '' : status} bookings found
                  </h3>
                  <p className="text-slate-400">
                    {status === 'all'
                      ? "You haven't made any bookings yet."
                      : `No ${status} bookings at the moment.`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filterBookings(status).map((booking) => {
                const car = cars[booking.car_id];
                return (
                  <Card key={booking.id} className="bg-white/5 border-white/10 backdrop-blur-lg hover:border-amber-500/30 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={car?.images?.[0] || "https://images.unsplash.com/photo-1544829099-b9a0c5303bea?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"}
                          alt={car ? `${car.make} ${car.model}` : 'Car'}
                          className="w-20 h-14 object-cover rounded-lg"
                        />

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-white">
                                {car ? `${car.make} ${car.model}` : 'Loading...'}
                              </h3>
                              <p className="text-slate-400">#{booking.booking_reference}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className={getStatusColor(booking.status)}>
                                {getStatusIcon(booking.status)}
                                {booking.status}
                              </Badge>
                              <div className="text-right">
                                <p className="text-xl font-bold text-white">${booking.total_amount}</p>
                                <p className="text-xs text-slate-400">Total</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <div className="text-sm">
                                <p className="text-white">{formatDate(booking.start_date)}</p>
                                <p className="text-slate-400">Pickup</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <div className="text-sm">
                                <p className="text-white">{formatDate(booking.end_date)}</p>
                                <p className="text-slate-400">Return</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <div className="text-sm">
                                <p className="text-white">{booking.pickup_location?.city || 'Location'}</p>
                                <p className="text-slate-400">Pickup City</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-slate-400" />
                              <div className="text-sm">
                                <p className="text-white">{booking.payment_status}</p>
                                <p className="text-slate-400">Payment</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Receipt
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Support
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Booking #{selectedBooking.booking_reference}
              </DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Vehicle Details</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-slate-400">Car:</span> {cars[selectedBooking.car_id]?.make} {cars[selectedBooking.car_id]?.model}</p>
                    <p><span className="text-slate-400">Year:</span> {cars[selectedBooking.car_id]?.year}</p>
                    <p><span className="text-slate-400">License:</span> {cars[selectedBooking.car_id]?.license_plate}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Rental Period</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-slate-400">Start:</span> {formatDate(selectedBooking.start_date)}</p>
                    <p><span className="text-slate-400">End:</span> {formatDate(selectedBooking.end_date)}</p>
                    <p><span className="text-slate-400">Duration:</span> {
                      Math.ceil((new Date(selectedBooking.end_date) - new Date(selectedBooking.start_date)) / (1000 * 60 * 60 * 24))
                    } days</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Locations</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-slate-400">Pickup:</span> {selectedBooking.pickup_location?.address}</p>
                    <p><span className="text-slate-400">Dropoff:</span> {selectedBooking.dropoff_location?.address}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Payment Information</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-slate-400">Total Amount:</span> ${selectedBooking.total_amount}</p>
                    <p><span className="text-slate-400">Deposit:</span> ${selectedBooking.deposit_amount}</p>
                    <p><span className="text-slate-400">Insurance:</span> ${selectedBooking.insurance_cost}</p>
                    <p><span className="text-slate-400">Status:</span> {selectedBooking.payment_status}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Booking Status</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={getStatusColor(selectedBooking.status)}>
                      {getStatusIcon(selectedBooking.status)}
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>

                {selectedBooking.special_requests && (
                  <div>
                    <h4 className="font-semibold text-amber-400 mb-2">Special Requests</h4>
                    <p className="text-sm text-slate-300">{selectedBooking.special_requests}</p>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Download Receipt
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
