
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LoginModal from "@/components/LoginModal";
import { 
  Car,
  Calendar,
  CreditCard,
  User as UserIcon,
  MessageCircle,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  Shield,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const fakeUserData = sessionStorage.getItem('fakeUser');
      if (fakeUserData) {
        setUser(JSON.parse(fakeUserData));
        setIsLoading(false);
        return;
      }
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        // User not logged in
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleFakeLogin = (email, password) => {
    // Create a mock user object for the demo
    const fakeUser = {
      id: 'demo-user-123',
      full_name: 'Demo User',
      email: email,
      role: 'user',
      created_date: new Date().toISOString(),
      account_balance: 15750.50,
      phone_number: '555-010-1234',
      date_of_birth: '1992-08-15',
      address: { street: '123 Luxury Lane', city: 'Beverly Hills', state: 'CA', postal_code: '90210', country: 'USA' },
      identification: { verification_status: 'approved' },
      profile_image: `https://i.pravatar.cc/150?u=${email}`
    };
    sessionStorage.setItem('fakeUser', JSON.stringify(fakeUser));
    setUser(fakeUser);
    setIsLoginModalOpen(false);
    window.location.href = createPageUrl('Dashboard');
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('fakeUser');
    try {
      // If it's a real user from base44, log them out
      if (user && user.id !== 'demo-user-123') {
        await User.logout();
      }
    } catch (error) {
      console.error("Error during real logout:", error);
    } finally {
      // For both real and fake users, clear state and redirect
      setUser(null);
      window.location.href = createPageUrl('index');
    }
  };
  
  const loggedInNavigation = [
    { name: 'Dashboard', href: createPageUrl('Dashboard'), icon: Settings, current: currentPageName === 'Dashboard' },
    { name: 'All Inventory', href: createPageUrl('BrowseCars'), icon: Car, current: currentPageName === 'BrowseCars' },
    { name: 'My Bookings', href: createPageUrl('MyBookings'), icon: Calendar, current: currentPageName === 'MyBookings' },
    { name: 'Payments', href: createPageUrl('Payments'), icon: CreditCard, current: currentPageName === 'Payments' },
    { name: 'Support', href: createPageUrl('Support'), icon: MessageCircle, current: currentPageName === 'Support' },
  ];
  
  const adminNavigation = [
    { name: 'Admin Panel', href: createPageUrl('AdminPanel'), icon: Shield, current: currentPageName === 'AdminPanel' }
  ];

  const LoggedOutNav = () => (
    <div className="hidden md:flex items-center space-x-1">
      <Link to={createPageUrl('BrowseCars')} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10">
        All Inventory
      </Link>
      <Link to={createPageUrl('Support')} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10">
        Support
      </Link>
      <div className="pl-2">
        <Button onClick={() => setIsLoginModalOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-black">
          Login
        </Button>
      </div>
    </div>
  );

  const LoggedInNav = () => (
    <div className="hidden md:flex items-center space-x-1">
      {loggedInNavigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            item.current
              ? 'bg-amber-500/20 text-amber-400'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          {item.name}
        </Link>
      ))}
      {user?.role === 'admin' && adminNavigation.map((item) => (
         <Link
            key={item.name}
            to={item.href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              item.current
                ? 'bg-red-500/20 text-red-400'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {item.name}
          </Link>
      ))}
    </div>
  );

  // Pass a function to open the modal to children
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { openLoginModal: () => setIsLoginModalOpen(true) });
    }
    return child;
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  return (
    <>
      <LoginModal isOpen={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} onLogin={handleFakeLogin} />

      {/* If on Home page, don't show the layout frame, only children */}
      {currentPageName === 'index' ? (
          <>
            <nav className="bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50 border-b border-white/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link to={createPageUrl(user ? 'Dashboard' : 'index')} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xl font-bold text-white">Alquilar.co.uk</span>
                    </Link>
                  </div>
                  {user ? <LoggedInNav /> : <LoggedOutNav />}
                   {/* User Menu / Mobile menu button for index page */}
                   <div className="flex items-center space-x-4">
                    {user ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="flex items-center space-x-2 text-slate-300 hover:text-white p-1 rounded-full">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user?.profile_image} />
                              <AvatarFallback className="bg-amber-500 text-white">
                                {user?.full_name?.charAt(0) || user?.email?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700">
                          <div className="px-3 py-2">
                            <p className="text-sm font-medium text-white">{user?.full_name}</p>
                            <p className="text-xs text-slate-400">{user?.email}</p>
                          </div>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl('Profile')} className="flex items-center text-slate-300 hover:text-white cursor-pointer">
                              <UserIcon className="w-4 h-4 mr-2" />
                              Profile Settings
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 cursor-pointer">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <div className="md:hidden">
                        <Button onClick={() => setIsLoginModalOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-black text-xs px-3 py-1 h-8">
                          Login
                        </Button>
                      </div>
                    )}
                    {/* Mobile menu button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden text-slate-300 hover:text-white"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
                {/* Mobile Navigation for Home Page */}
                {isMenuOpen && (
                  <div className="md:hidden border-t border-white/10 py-4 space-y-2">
                    {(user ? loggedInNavigation : [
                        { name: 'All Inventory', href: createPageUrl('BrowseCars'), icon: Car },
                        { name: 'Support', href: createPageUrl('Support'), icon: MessageCircle },
                    ]).map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                          item.current && user // Only highlight if current AND user is logged in (for loggedInNavigation)
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </Link>
                    ))}
                    {user?.role === 'admin' && adminNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                          item.current
                            ? 'bg-red-500/20 text-red-400'
                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
            {childrenWithProps}
            <footer className="bg-slate-900 border-t border-white/10">
              <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-slate-400 text-sm">
                  © 2024 Alquilar.co.uk. All rights reserved. A new standard in luxury car rentals.
                </p>
              </div>
            </footer>
          </>
      ) : ( // Standard logged-in layout
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <style jsx>{`
            :root {
              --primary: #D4AF37;
              --primary-dark: #B8941F;
              --background: #0F172A;
              --surface: rgba(255, 255, 255, 0.05);
              --text-primary: #F8FAFC;
              --text-secondary: #94A3B8;
            }
            
            body {
              background: var(--background);
              color: var(--text-primary);
            }
            
            .glass-effect {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
          `}</style>

          {/* Navigation */}
          <nav className="glass-effect sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                {/* Logo */}
                <div className="flex items-center">
                  <Link to={createPageUrl(user ? 'Dashboard' : 'index')} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">Alquilar.co.uk</span>
                  </Link>
                </div>

                {/* Desktop Navigation */}
                {user ? <LoggedInNav /> : <LoggedOutNav />}

                {/* User Menu / Mobile menu button */}
                <div className="flex items-center">
                  {user ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center space-x-2 text-slate-300 hover:text-white p-1 rounded-full">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user?.profile_image} />
                                <AvatarFallback className="bg-amber-500 text-white">
                                  {user?.full_name?.charAt(0) || user?.email?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700">
                          <div className="px-3 py-2">
                            <p className="text-sm font-medium text-white">{user?.full_name}</p>
                            <p className="text-xs text-slate-400">{user?.email}</p>
                          </div>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl('Profile')} className="flex items-center text-slate-300 hover:text-white cursor-pointer">
                              <UserIcon className="w-4 h-4 mr-2" />
                              Profile Settings
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 cursor-pointer">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  ) : (
                    <div className="md:hidden">
                       <Button onClick={() => setIsLoginModalOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-black text-xs px-3 py-1 h-8">
                        Login
                      </Button>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-slate-300 hover:text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {/* Mobile Navigation */}
              {isMenuOpen && (
                <div className="md:hidden border-t border-white/10 py-4 space-y-2">
                  {(user ? loggedInNavigation : [
                      { name: 'All Inventory', href: createPageUrl('BrowseCars'), icon: Car },
                      { name: 'Support', href: createPageUrl('Support'), icon: MessageCircle },
                  ]).map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                        item.current && user // Only highlight if current AND user is logged in (for loggedInNavigation)
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  ))}
                  
                  {user?.role === 'admin' && adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                        item.current
                          ? 'bg-red-500/20 text-red-400'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Main Content */}
          <main className="relative">
            {childrenWithProps}
          </main>

          {/* Footer */}
          <footer className="glass-effect mt-20">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">Alquilar.co.uk</span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Experience luxury driving with our premium fleet of exotic and luxury vehicles.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-4">Services</h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>Luxury Car Rentals</li>
                    <li>Exotic Vehicle Fleet</li>
                    <li>Chauffeur Services</li>
                    <li>Event Transportation</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-4">Support</h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>24/7 Customer Service</li>
                    <li>Roadside Assistance</li>
                    <li>Insurance Coverage</li>
                    <li>Booking Support</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-4">Contact</h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>+44 20 7946 0958</li>
                    <li>support@alquilar.co.uk</li>
                    <li>123 Elite Drive</li>
                    <li>London, UK</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-white/10 mt-8 pt-8 text-center">
                <p className="text-slate-400 text-sm">
                  © 2024 Alquilar.co.uk. All rights reserved. Built with precision and luxury in mind.
                </p>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
