
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User as UserIcon,
  Camera,
  Upload,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Briefcase,
  Phone,
  Calendar,
  FileText,
  Lock // Added Lock icon
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData({
        full_name: userData.full_name || '',
        phone_number: userData.phone_number || '',
        date_of_birth: userData.date_of_birth || '',
        address: userData.address || {
          street: '',
          city: '',
          state: '',
          postal_code: '',
          country: ''
        },
        professional_details: userData.professional_details || {
          company: '',
          job_title: '',
          annual_income: ''
        },
        identification: userData.identification || {
          document_type: '',
          document_number: ''
        }
      });
    } catch (error) {
      // If fetching user data fails (e.g., user is not authenticated), show guest view.
      console.error("User not authenticated, showing guest view:", error);
      setUser(null); // Set user to null to indicate unauthenticated state
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value, nested = null) => {
    setFormData(prev => {
      if (nested) {
        return {
          ...prev,
          [nested]: {
            ...prev[nested],
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const { file_url } = await UploadFile({ file });
      await User.updateMyUserData({ profile_image: file_url });
      setUser(prev => ({ ...prev, profile_image: file_url }));
      setMessage({ type: 'success', text: 'Profile image updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDocumentUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploadingDocument(true);
    try {
      const { file_url } = await UploadFile({ file });
      const updatedData = {
        identification: {
          ...formData.identification,
          document_url: file_url,
          verification_status: 'pending'
        }
      };

      await User.updateMyUserData(updatedData);
      setFormData(prev => ({
        ...prev,
        identification: updatedData.identification
      }));
      setMessage({ type: 'success', text: 'Document uploaded successfully! Verification pending.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload document. Please try again.' });
    } finally {
      setIsUploadingDocument(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData(formData);
      setUser(prev => ({ ...prev, ...formData }));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const getVerificationProgress = () => {
    if (!user) return 0; // If no user, no progress
    let progress = 20; // Base for account creation

    if (user.phone_number) progress += 15;
    if (user.date_of_birth) progress += 15;
    if (user.address?.street) progress += 20;
    if (user.identification?.verification_status === 'approved') progress += 30;

    return progress;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded w-64"></div>
          <div className="h-64 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Render access denied message if user is not authenticated
  if (!user) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardContent className="p-12 text-center flex flex-col items-center gap-4">
            <Lock className="w-16 h-16 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Access Denied</h2>
            <p className="text-slate-400">
              You must be logged in to view your profile and manage your account settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-slate-400">Manage your account information and verification status</p>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert className={`${message.type === 'success' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
          <AlertDescription className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Verification Progress */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-amber-400" />
            Account Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Profile Completion</span>
              <span className="text-white font-semibold">{getVerificationProgress()}%</span>
            </div>
            <Progress value={getVerificationProgress()} className="h-2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-slate-400">Email Verified</span>
              </div>
              <div className="flex items-center gap-2">
                {user?.phone_number ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                )}
                <span className="text-sm text-slate-400">Phone Added</span>
              </div>
              <div className="flex items-center gap-2">
                {user?.address?.street ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                )}
                <span className="text-sm text-slate-400">Address Added</span>
              </div>
              <div className="flex items-center gap-2">
                {user?.identification?.verification_status === 'approved' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : user?.identification?.verification_status === 'pending' ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-sm text-slate-400">ID Verified</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Image */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            Profile Picture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.profile_image} />
              <AvatarFallback className="bg-amber-500 text-white text-xl">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                type="file"
                id="profile-image"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Label htmlFor="profile-image">
                <Button
                  asChild
                  disabled={isUploadingImage}
                  className="bg-amber-500 hover:bg-amber-600 text-black"
                >
                  <span>
                    {isUploadingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </>
                    )}
                  </span>
                </Button>
              </Label>
              <p className="text-xs text-slate-400 mt-2">
                Recommended: Square image, at least 400x400px
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-amber-400" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name" className="text-slate-400">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-slate-400">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="dob" className="text-slate-400">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-slate-400">Email Address</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-white/5 border-white/10 text-slate-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="street" className="text-slate-400">Street Address</Label>
            <Input
              id="street"
              value={formData.address?.street || ''}
              onChange={(e) => handleInputChange('street', e.target.value, 'address')}
              className="bg-white/5 border-white/10 text-white"
              placeholder="123 Main Street"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="city" className="text-slate-400">City</Label>
              <Input
                id="city"
                value={formData.address?.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value, 'address')}
                className="bg-white/5 border-white/10 text-white"
                placeholder="New York"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-slate-400">State</Label>
              <Input
                id="state"
                value={formData.address?.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value, 'address')}
                className="bg-white/5 border-white/10 text-white"
                placeholder="NY"
              />
            </div>
            <div>
              <Label htmlFor="postal" className="text-slate-400">Postal Code</Label>
              <Input
                id="postal"
                value={formData.address?.postal_code || ''}
                onChange={(e) => handleInputChange('postal_code', e.target.value, 'address')}
                className="bg-white/5 border-white/10 text-white"
                placeholder="10001"
              />
            </div>
            <div>
              <Label htmlFor="country" className="text-slate-400">Country</Label>
              <Input
                id="country"
                value={formData.address?.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value, 'address')}
                className="bg-white/5 border-white/10 text-white"
                placeholder="United States"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Details */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            Professional Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company" className="text-slate-400">Company</Label>
              <Input
                id="company"
                value={formData.professional_details?.company || ''}
                onChange={(e) => handleInputChange('company', e.target.value, 'professional_details')}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Company Name"
              />
            </div>
            <div>
              <Label htmlFor="job_title" className="text-slate-400">Job Title</Label>
              <Input
                id="job_title"
                value={formData.professional_details?.job_title || ''}
                onChange={(e) => handleInputChange('job_title', e.target.value, 'professional_details')}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Your Job Title"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="income" className="text-slate-400">Annual Income (Optional)</Label>
            <Input
              id="income"
              type="number"
              value={formData.professional_details?.annual_income || ''}
              onChange={(e) => handleInputChange('annual_income', e.target.value, 'professional_details')}
              className="bg-white/5 border-white/10 text-white"
              placeholder="75000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Identification */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            Identification Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doc_type" className="text-slate-400">Document Type</Label>
              <Select
                value={formData.identification?.document_type || ''}
                onValueChange={(value) => handleInputChange('document_type', value, 'identification')}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="drivers_license">Driver's License</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="national_id">National ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="doc_number" className="text-slate-400">Document Number</Label>
              <Input
                id="doc_number"
                value={formData.identification?.document_number || ''}
                onChange={(e) => handleInputChange('document_number', e.target.value, 'identification')}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Enter document number"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-400">Upload Document</Label>
                <p className="text-xs text-slate-500 mt-1">
                  Upload a clear photo of your identification document
                </p>
              </div>
              {user?.identification?.verification_status && (
                <Badge
                  variant="outline"
                  className={
                    user.identification.verification_status === 'approved' ? 'border-green-500 text-green-400' :
                    user.identification.verification_status === 'pending' ? 'border-yellow-500 text-yellow-400' :
                    'border-red-500 text-red-400'
                  }
                >
                  {user.identification.verification_status}
                </Badge>
              )}
            </div>

            <div>
              <input
                type="file"
                id="document-upload"
                accept="image/*,.pdf"
                onChange={handleDocumentUpload}
                className="hidden"
              />
              <Label htmlFor="document-upload">
                <Button
                  asChild
                  disabled={isUploadingDocument}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <span>
                    {isUploadingDocument ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </>
                    )}
                  </span>
                </Button>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="bg-amber-500 hover:bg-amber-600 text-black font-medium px-8"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
              Saving...
            </>
          ) : (
            'Save Profile'
          )}
        </Button>
      </div>
    </div>
  );
}
