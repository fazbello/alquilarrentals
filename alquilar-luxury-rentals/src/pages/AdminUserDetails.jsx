import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User as UserIcon, ArrowLeft, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminUserDetails() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    if (userId) {
      loadUserData(userId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserData = async (userId) => {
    try {
      const users = await User.filter({ id: userId });
      if (users.length > 0) {
        const userData = users[0];
        setUser(userData);
        setFormData({
          full_name: userData.full_name || '',
          email: userData.email || '',
          role: userData.role || 'user',
          account_balance: userData.account_balance || 0,
        });
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await User.update(user.id, formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      loadUserData(user.id); // Refresh data
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-white">Loading User Details...</div>;
  }

  if (!user) {
    return <div className="p-8 text-white">User not found.</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8">
      <Link to={createPageUrl("AdminPanel")} className="flex items-center gap-2 text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        Back to Admin Panel
      </Link>
      
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Edit User Profile</h1>
        <p className="text-slate-400">Manage details for {user.full_name}</p>
      </div>

      {message && (
        <Alert className={`${message.type === 'success' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
          <AlertDescription className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-amber-400" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="full_name" className="text-slate-400">Full Name</Label>
            <Input id="full_name" value={formData.full_name} onChange={(e) => handleInputChange('full_name', e.target.value)} className="bg-white/5 border-white/10 text-white" />
          </div>
          <div>
            <Label htmlFor="email" className="text-slate-400">Email Address</Label>
            <Input id="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="bg-white/5 border-white/10 text-white" />
          </div>
           <div>
            <Label htmlFor="role" className="text-slate-400">Role</Label>
            <Input id="role" value={formData.role} onChange={(e) => handleInputChange('role', e.target.value)} className="bg-white/5 border-white/10 text-white" />
          </div>
          <div>
            <Label htmlFor="account_balance" className="text-slate-400">Account Balance</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input id="account_balance" type="number" value={formData.account_balance} onChange={(e) => handleInputChange('account_balance', parseFloat(e.target.value))} className="bg-white/5 border-white/10 text-white pl-10" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-amber-500 hover:bg-amber-600 text-black px-8">
          {isSaving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
}