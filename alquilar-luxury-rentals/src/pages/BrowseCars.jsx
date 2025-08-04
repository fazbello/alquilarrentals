
import React, { useState, useEffect } from "react";
import { Car } from "@/api/entities";
import { User } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Search, 
  Filter, 
  Car as CarIcon, 
  MapPin, 
  Star, 
  Calendar,
  Users,
  Fuel,
  Settings,
  Heart,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BrowseCars() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceRange: 'all',
    location: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cars, filters]);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      const carsData = await Car.filter({}, '-created_date');
      setCars(carsData);
    } catch (error) {
      console.error("Error loading data:", error);
      setUser(null); // Allow guest view even if user fetch fails
      const carsData = await Car.filter({}, '-created_date'); // Fetch all cars even if user data fails
      setCars(carsData);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cars];

    if (filters.search) {
      filtered = filtered.filter(car => 
        car.make.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.model.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(car => car.category === filters.category);
    }

    if (filters.priceRange !== 'all') {
      const ranges = {
        'under-500': [0, 500],
        '500-1000': [500, 1000],
        '1000-1500': [1000, 1500],
        'over-1500': [1500, Infinity]
      };
      const [min, max] = ranges[filters.priceRange];
      filtered = filtered.filter(car => car.daily_rate >= min && car.daily_rate <= max);
    }

    if (filters.location !== 'all') {
      filtered = filtered.filter(car => 
        car.location?.city.toLowerCase() === filters.location.toLowerCase()
      );
    }

    setFilteredCars(filtered);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'luxury': return '👑';
      case 'sports': return '🏎️';
      case 'suv': return '🚙';
      case 'executive': return '🚗';
      case 'electric': return '⚡';
      case 'classic': return '🏛️';
      default: return '🚗';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-80 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Browse Our Fleet</h1>
        <p className="text-slate-400">Discover luxury vehicles for your next journey</p>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search cars..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priceRange} onValueChange={(value) => setFilters({...filters, priceRange: value})}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-500">Under $500</SelectItem>
                <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                <SelectItem value="1000-1500">$1,000 - $1,500</SelectItem>
                <SelectItem value="over-1500">Over $1,500</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="beverly hills">Beverly Hills</SelectItem>
                <SelectItem value="miami beach">Miami Beach</SelectItem>
                <SelectItem value="new york">New York</SelectItem>
                <SelectItem value="las vegas">Las Vegas</SelectItem>
                <SelectItem value="san francisco">San Francisco</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex justify-between items-center">
        <p className="text-slate-400">{filteredCars.length} vehicles available</p>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">Sort by popularity</span>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <Card key={car.id} className="bg-white/5 border-white/10 backdrop-blur-lg hover:border-amber-500/30 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-0">
              {/* Image */}
              <div className="relative h-48 overflow-hidden rounded-t-xl">
                <img 
                  src={car.images?.[0] || "https://images.unsplash.com/photo-1544829099-b9a0c5303bea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  alt={`${car.make} ${car.model}`}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${car.status !== 'available' ? 'filter grayscale' : ''}`}
                />
                {car.status !== 'available' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge className="bg-red-600 text-white border-red-600 text-base py-1 px-3">
                      {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                    </Badge>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-amber-500/90 text-black">
                    {getCategoryIcon(car.category)} {car.category}
                  </Badge>
                </div>
                <Button
                  variant="ghost" 
                  size="icon"
                  className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{car.make} {car.model}</h3>
                    <p className="text-slate-400">{car.year} • {car.color}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-400">${car.daily_rate}</p>
                    <p className="text-xs text-slate-400">per day</p>
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {car.specifications?.seating_capacity} seats
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings className="w-3 h-3" />
                    {car.specifications?.transmission?.split(' ')[0]}
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="w-3 h-3" />
                    {car.specifications?.fuel_type?.split(' ')[0]}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-400">{car.location?.city}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    onClick={() => setSelectedCar(car)}
                  >
                    View Details
                  </Button>
                  <Link to={createPageUrl(`BookCar?car=${car.id}`)} className="flex-1">
                    <Button 
                      className="w-full bg-amber-500 hover:bg-amber-600 text-black disabled:bg-slate-500 disabled:text-slate-300"
                      disabled={car.status !== 'available'}
                    >
                      {car.status === 'available' ? 'Book Now' : (car.status.charAt(0).toUpperCase() + car.status.slice(1))}
                      {car.status === 'available' && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Car Details Modal */}
      {selectedCar && (
        <Dialog open={!!selectedCar} onOpenChange={() => setSelectedCar(null)}>
          <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedCar.make} {selectedCar.model} {selectedCar.year}
              </DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={selectedCar.images?.[0] || "https://images.unsplash.com/photo-1544829099-b9a0c5303bea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  alt={`${selectedCar.make} ${selectedCar.model}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Specifications</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                    <div>Engine: {selectedCar.specifications?.engine}</div>
                    <div>Power: {selectedCar.specifications?.horsepower} HP</div>
                    <div>Transmission: {selectedCar.specifications?.transmission}</div>
                    <div>Fuel: {selectedCar.specifications?.fuel_type}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCar.specifications?.features?.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Pricing</h4>
                  <div className="space-y-1 text-sm">
                    <div>Daily: ${selectedCar.daily_rate}</div>
                    <div>Weekly: ${selectedCar.weekly_rate}</div>
                    <div>Monthly: ${selectedCar.monthly_rate}</div>
                    <div className="text-amber-400">Deposit: ${selectedCar.deposit_amount}</div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link to={createPageUrl(`BookCar?car=${selectedCar.id}`)}>
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black">
                      Book This Car
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
