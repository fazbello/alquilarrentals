import React, { useState, useEffect } from "react";
import { Car } from "@/api/entities";
import { User } from "@/api/entities";
import { Booking } from "@/api/entities";
import { Payment } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { sendNotification } from "@/api/functions";
import { processPayment } from "@/api/functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Users,
  Luggage,
  GitBranch,
  Check,
  DollarSign,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

export default function BookCar() {
  const [car, setCar] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState({
    pickupDate: '',
    dropoffDate: '',
    pickupTime: '10:00',
    dropoffTime: '10:00',
    additionalInsurance: false,
    gps: false,
    childSeat: false,
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [days, setDays] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('account_balance');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('carId');
    loadInitialData(carId);
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [bookingDetails, car]);

  const loadInitialData = async (carId) => {
    try {
      const userData = await User.me();
      setUser(userData);
      const cars = await Car.filter({ id: carId });
      if (cars.length > 0) {
        setCar(cars[0]);
      }
    } catch (error) {
      console.error("Redirecting, user not authenticated:", error);
      window.location.href = createPageUrl('index');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setBookingDetails(prev => ({ ...prev, [field]: value }));
  };

  const calculatePrice = () => {
    if (!car || !bookingDetails.pickupDate || !bookingDetails.dropoffDate) {
      setTotalPrice(0);
      setDays(0);
      return;
    }
    const pickup = new Date(bookingDetails.pickupDate);
    const dropoff = new Date(bookingDetails.dropoffDate);
    if (pickup >= dropoff) {
      setTotalPrice(0);
      setDays(0);
      return;
    }

    const duration = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));
    setDays(duration);

    let price = duration * car.price_per_day;
    if (bookingDetails.additionalInsurance) price += 150;
    if (bookingDetails.gps) price += 50;
    if (bookingDetails.childSeat) price += 75;

    setTotalPrice(price);
  };

  const handleBooking = async () => {
    setIsBooking(true);
    try {
      // 1. Create payment record
      const payment = await Payment.create({
        user_id: user.id,
        amount: totalPrice,
        payment_method: paymentMethod,
        payment_type: 'booking',
        status: 'pending'
      });
      
      // 2. Process payment
      await processPayment({
          payment_id: payment.id,
          user_id: user.id,
          amount: totalPrice,
          payment_method: paymentMethod,
          description: `Booking for ${car.make} ${car.model}`
      });
      
      // 3. Create booking record
      const booking = await Booking.create({
        user_id: user.id,
        car_id: car.id,
        start_date: new Date(`${bookingDetails.pickupDate}T${bookingDetails.pickupTime}`).toISOString(),
        end_date: new Date(`${bookingDetails.dropoffDate}T${bookingDetails.dropoffTime}`).toISOString(),
        total_price: totalPrice,
        status: 'confirmed',
        payment_id: payment.id,
        addons: {
          additionalInsurance: bookingDetails.additionalInsurance,
          gps: bookingDetails.gps,
          childSeat: bookingDetails.childSeat,
        }
      });

      // 4. Send confirmation email
      await sendNotification({
        user_id: user.id,
        template_name: 'booking-confirmation',
        data: {
          car_name: `${car.make} ${car.model}`,
          pickup_date: new Date(booking.start_date).toLocaleString(),
          dropoff_date: new Date(booking.end_date).toLocaleString(),
          total_price: totalPrice.toFixed(2),
          booking_id: booking.id
        }
      });
      
      // 5. Redirect to My Bookings page
      window.location.href = createPageUrl('MyBookings');

    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please check your payment details and try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) return <div className="p-8 text-white">Loading booking details...</div>;
  if (!car) return <div className="p-8 text-white">Car not found.</div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <Link to={createPageUrl("BrowseCars")} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Fleet
      </Link>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Your Selection</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-6">
              <img src={car.image_url} alt={`${car.make} ${car.model}`} className="w-full md:w-1/3 h-auto object-cover rounded-lg" />
              <div>
                <h2 className="text-2xl font-bold text-white">{car.make} {car.model}</h2>
                <p className="text-amber-400">{car.year}</p>
                <div className="flex items-center gap-6 mt-4 text-slate-300">
                  <div className="flex items-center gap-2"><Users className="w-4 h-4" /> {car.seats} Seats</div>
                  <div className="flex items-center gap-2"><Luggage className="w-4 h-4" /> {car.storage} Bags</div>
                  <div className="flex items-center gap-2"><GitBranch className="w-4 h-4" /> {car.transmission}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader><CardTitle className="text-white">Booking Details</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6">
              <div><Label htmlFor="pickupDate">Pickup Date</Label><Input id="pickupDate" type="date" value={bookingDetails.pickupDate} onChange={e => handleInputChange('pickupDate', e.target.value)} className="bg-white/10 border-white/20"/></div>
              <div><Label htmlFor="dropoffDate">Drop-off Date</Label><Input id="dropoffDate" type="date" value={bookingDetails.dropoffDate} onChange={e => handleInputChange('dropoffDate', e.target.value)} className="bg-white/10 border-white/20"/></div>
              <div><Label htmlFor="pickupTime">Pickup Time</Label><Input id="pickupTime" type="time" value={bookingDetails.pickupTime} onChange={e => handleInputChange('pickupTime', e.target.value)} className="bg-white/10 border-white/20"/></div>
              <div><Label htmlFor="dropoffTime">Drop-off Time</Label><Input id="dropoffTime" type="time" value={bookingDetails.dropoffTime} onChange={e => handleInputChange('dropoffTime', e.target.value)} className="bg-white/10 border-white/20"/></div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader><CardTitle className="text-white">Add-ons</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Checkbox id="insurance" checked={bookingDetails.additionalInsurance} onCheckedChange={c => handleInputChange('additionalInsurance', c)} /><Label htmlFor="insurance">Premium Insurance Coverage</Label></div><span className="font-medium">$150.00</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Checkbox id="gps" checked={bookingDetails.gps} onCheckedChange={c => handleInputChange('gps', c)}/><Label htmlFor="gps">GPS Navigation Unit</Label></div><span className="font-medium">$50.00</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Checkbox id="childSeat" checked={bookingDetails.childSeat} onCheckedChange={c => handleInputChange('childSeat', c)}/><Label htmlFor="childSeat">Child Seat</Label></div><span className="font-medium">$75.00</span></div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <Card className="bg-white/5 border-white/10 sticky top-8">
            <CardHeader><CardTitle className="text-white">Price Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between"><span>{car.price_per_day}$ x {days} Days</span><span>${(car.price_per_day * days).toFixed(2)}</span></div>
              {bookingDetails.additionalInsurance && <div className="flex justify-between"><span>Premium Insurance</span><span>$150.00</span></div>}
              {bookingDetails.gps && <div className="flex justify-between"><span>GPS</span><span>$50.00</span></div>}
              {bookingDetails.childSeat && <div className="flex justify-between"><span>Child Seat</span><span>$75.00</span></div>}
              <div className="border-t border-white/20 my-2"></div>
              <div className="flex justify-between text-xl font-bold text-white"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
            
              <div className="space-y-4 pt-4">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-white/10 border-white/20"><SelectValue/></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="account_balance">Account Balance (${(user?.account_balance || 0).toFixed(2)})</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
                 <Button size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold" onClick={handleBooking} disabled={isBooking || totalPrice <= 0 || (paymentMethod === 'account_balance' && user.account_balance < totalPrice)}>
                  {isBooking ? 'Processing...' : 'Confirm & Book Now'}
                </Button>
                {paymentMethod === 'account_balance' && user.account_balance < totalPrice && <p className="text-xs text-red-400 text-center">Insufficient account balance.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}