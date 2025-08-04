import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Car, Calendar, Star, ArrowRight, Quote, Building, Users2, ShieldCheck, Gem, Zap } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import LiveBookingTicker from '@/components/LiveBookingTicker';

export default function HomePage() {
  const featuredCars = [
    {
      name: 'Lamborghini Huracan',
      image: 'https://images.unsplash.com/photo-1617083283288-63a5658a5847?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Raw power, iconic design.'
    },
    {
      name: 'Rolls-Royce Cullinan',
      image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'The pinnacle of luxury.'
    },
    {
      name: 'Ferrari SF90 Stradale',
      image: 'https://images.unsplash.com/photo-1614026480421-a9162c4155c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Hybrid performance unleashed.'
    },
    {
      name: 'Mercedes-Benz S-Class',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Unmatched elegance & tech.'
    }
  ];

  const testimonials = [
    {
      quote: "Impeccable service. The car was pristine, and the delivery was seamless. Made our anniversary weekend truly unforgettable.",
      name: "James T.",
      role: "Lamborghini Aventador Rental"
    },
    {
      quote: "Renting the Rolls-Royce was a game-changer for my business trip. It projected the right image, and the comfort was unparalleled.",
      name: "Dr. Eleanor Vance",
      role: "Rolls-Royce Ghost Rental"
    },
    {
      quote: "An absolutely thrilling experience! The team was professional and accommodating. I will definitely be a returning customer.",
      name: "Marcus Holloway",
      role: "McLaren 720S Rental"
    }
  ];

  const faqs = [
    {
      question: "What are the requirements to rent a car?",
      answer: "You'll need a valid driver's license, a major credit card in your name, and proof of insurance. International renters may require an International Driving Permit. All renters must be over the age of 25."
    },
    {
      question: "Do you offer vehicle delivery?",
      answer: "Yes, we offer a bespoke delivery and collection service to your home, hotel, or airport. Simply provide the details during the booking process, and we will coordinate the logistics with you."
    },
    {
      question: "What is your cancellation policy?",
      answer: "You can cancel free of charge up to 72 hours before your rental period begins. Cancellations within 72 hours are subject to a fee. Please refer to our full terms and conditions for details."
    },
    {
      question: "Is insurance included in the rental price?",
      answer: "Comprehensive insurance is included with every rental. We also offer premium insurance packages for additional coverage and complete peace of mind, which you can select during checkout."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen min-h-[600px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Luxury car on scenic road"
          className="absolute inset-0 w-full h-full object-cover animate-kenburns"
        />
        <div className="relative z-20 p-4 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
            Experience the Drive of Your Life
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            Access an exclusive fleet of the world's most desired vehicles. Seamless booking, unparalleled service, unforgettable memories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('BrowseCars')}>
              <Button size="lg" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-6 text-lg shadow-lg shadow-amber-500/20">
                Browse Our Fleet
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Dashboard')}>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-2 border-white bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-6 text-lg font-semibold" 
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
        <LiveBookingTicker />
      </div>

      {/* Features Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">The Ultimate Luxury Car Rental Experience</h2>
            <p className="text-slate-400 mt-4 text-lg">Why discerning drivers choose Alquilar.co.uk.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-white/10 transition-all duration-300 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10 transform hover:-translate-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/20 mx-auto mb-6 ring-8 ring-amber-500/10">
                <Gem className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Exclusive Fleet</h3>
              <p className="text-slate-400 leading-relaxed">
                A hand-picked collection of supercars, luxury SUVs, and executive sedans from the world's most prestigious brands.
              </p>
            </div>
            <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-white/10 transition-all duration-300 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10 transform hover:-translate-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/20 mx-auto mb-6 ring-8 ring-amber-500/10">
                <Zap className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Seamless Booking</h3>
              <p className="text-slate-400 leading-relaxed">
                Effortless online booking and transparent pricing. Your next drive is just a few clicks away.
              </p>
            </div>
            <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-white/10 transition-all duration-300 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10 transform hover:-translate-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/20 mx-auto mb-6 ring-8 ring-amber-500/10">
                <ShieldCheck className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">VIP Service</h3>
              <p className="text-slate-400 leading-relaxed">
                24/7 concierge support, bespoke delivery, and collection services for a truly elite experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fleet Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Featured Fleet</h2>
            <p className="text-slate-400 mt-4 text-lg">A glimpse of what awaits.</p>
          </div>
          <Carousel
            opts={{ align: "start", loop: true, }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {featuredCars.map((car, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="group relative overflow-hidden rounded-xl">
                    <img src={car.image} alt={car.name} className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-2xl font-bold text-white">{car.name}</h3>
                      <p className="text-slate-300">{car.description}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-20 hidden sm:flex" />
            <CarouselNext className="mr-20 hidden sm:flex" />
          </Carousel>
          <div className="text-center mt-12">
            <Link to={createPageUrl('BrowseCars')}>
              <Button size="lg" variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 px-8">
                Explore The Full Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Your Journey Starts Here</h2>
            <p className="text-slate-400 mt-4 text-lg">Simple, fast, and secure in three easy steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center relative">
            {/* Dashed lines for desktop */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-px -mt-6">
              <svg width="100%" height="100%"><line x1="0" y1="50%" x2="100%" y2="50%" strokeWidth="1" stroke="rgba(255,255,255,0.1)" strokeDasharray="8, 8"/></svg>
            </div>
            <div className="relative p-4">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-slate-800 border-2 border-amber-500/30 mx-auto mb-6 text-3xl font-bold text-amber-500 shadow-lg shadow-amber-500/10">1</div>
              <h3 className="text-xl font-semibold text-white mb-2">Browse & Select</h3>
              <p className="text-slate-400">Explore our curated fleet and find the perfect vehicle for your occasion.</p>
            </div>
            <div className="relative p-4">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-slate-800 border-2 border-amber-500/30 mx-auto mb-6 text-3xl font-bold text-amber-500 shadow-lg shadow-amber-500/10">2</div>
              <h3 className="text-xl font-semibold text-white mb-2">Book & Verify</h3>
              <p className="text-slate-400">Choose your dates, finalize your booking, and complete our secure verification process.</p>
            </div>
            <div className="relative p-4">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-slate-800 border-2 border-amber-500/30 mx-auto mb-6 text-3xl font-bold text-amber-500 shadow-lg shadow-amber-500/10">3</div>
              <h3 className="text-xl font-semibold text-white mb-2">Drive & Enjoy</h3>
              <p className="text-slate-400">Receive your pristine vehicle and enjoy the ultimate driving experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Users2 className="w-12 h-12 mx-auto text-amber-400 mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">What Our Clients Say</h2>
            <p className="text-slate-400 mt-4 text-lg">Trusted by driving enthusiasts worldwide.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800/50 p-8 rounded-xl border border-white/10">
                <Quote className="w-10 h-10 text-amber-500 mb-6" />
                <p className="text-slate-300 italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-white text-lg">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-400 mt-4 text-lg">Your questions, answered.</p>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 rounded-lg bg-slate-800/50">
                <AccordionTrigger className="text-lg text-left text-white hover:no-underline px-6 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 pt-0 px-6 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-t from-slate-900 to-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">Ready to Take the Wheel?</h2>
          <p className="text-slate-400 mt-6 mb-10 text-lg max-w-2xl mx-auto">
            Join our exclusive community of driving enthusiasts and unlock access to the world's finest automobiles. Your journey begins now.
          </p>
          <Link to={createPageUrl('Dashboard')}>
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-10 py-7 text-xl shadow-2xl shadow-amber-500/20">
              Explore The Collection
            </Button>
          </Link>
        </div>
      </section>
      
      <style jsx global>{`
        @keyframes kenburns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          100% {
            transform: scale(1.1) translate(-2%, 2%);
          }
        }
        .animate-kenburns {
          animation: kenburns 30s ease-out alternate-reverse infinite;
        }
      `}</style>
    </>
  );
}