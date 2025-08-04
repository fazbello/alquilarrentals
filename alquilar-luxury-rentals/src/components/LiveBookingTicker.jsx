import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

const cars = [
  "Lamborghini Huracan", "Rolls-Royce Cullinan", "Ferrari SF90", "Mercedes S-Class", "BMW M8",
  "Audi RS e-tron GT", "Jaguar F-Type", "Alpine A110S", "Porsche 911 GT3", "McLaren 720S"
];

const locations = [
  "London", "Manchester", "Edinburgh", "Birmingham", "Miami", "Los Angeles", "New York", "Dubai"
];

const LiveBookingTicker = () => {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const generateRandomBooking = () => {
      const car = cars[Math.floor(Math.random() * cars.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const timeAgo = Math.floor(Math.random() * 55) + 5; // 5 to 59 seconds

      setBooking({ id: Date.now(), car, location, timeAgo });
    };

    generateRandomBooking(); 
    const interval = setInterval(generateRandomBooking, 4000); // New booking every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30">
        <AnimatePresence>
            {booking && (
                <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg shadow-amber-500/10"
                >
                    <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
                    <p className="text-sm text-white">
                        Someone just booked a <span className="font-bold text-amber-400">{booking.car}</span> in {booking.location}
                    </p>
                    <p className="text-xs text-slate-400">{booking.timeAgo}s ago</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default LiveBookingTicker;