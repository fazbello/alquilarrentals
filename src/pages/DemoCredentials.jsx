import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  Key, 
  Copy,
  CheckCircle,
  User as UserIcon,
  Lock,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DemoCredentials() {
  const [copiedItems, setCopiedItems] = React.useState(new Set());

  const copyToClipboard = async (text, identifier) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set([...prev, identifier]));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(identifier);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto">
          <Key className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Admin Access Instructions</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Follow these steps to access the admin panel and test all administrative features.
        </p>
      </div>

      {/* Authentication Process */}
      <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">How to Become an Admin</h3>
              <p className="text-slate-300 mb-4">
                This platform uses secure role-based authentication. To test admin features, follow these steps:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>Sign up for a new account using the normal sign-up process</li>
                <li>After registration, go to <strong>Workspace → Data → User</strong> in your browser</li>
                <li>Find your user record and change the <code>role</code> field from "user" to "admin"</li>
                <li>Refresh the app - you'll now see the "Admin Panel" option in navigation</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Features Overview */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              Admin Panel Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-white font-medium mb-2">User Management</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• View all registered users</li>
                  <li>• Monitor verification status</li>
                  <li>• Track user activity and roles</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-white font-medium mb-2">ID Verification Queue</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Review pending ID documents</li>
                  <li>• Approve or reject verifications</li>
                  <li>• View document uploads</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-white font-medium mb-2">Platform Analytics</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• User registration statistics</li>
                  <li>• Fleet size and availability</li>
                  <li>• Booking volume metrics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Test User Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-white font-medium mb-2">Regular User Testing</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Sign up and complete profile</li>
                  <li>• Upload identification documents</li>
                  <li>• Browse and book luxury cars</li>
                  <li>• Test payment methods</li>
                  <li>• Use support chat system</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-white font-medium mb-2">Admin Testing</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Process ID verifications</li>
                  <li>• Monitor user activity</li>
                  <li>• Manage booking requests</li>
                  <li>• View platform analytics</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-white font-medium mb-2">Multi-Device Testing</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Test on mobile devices</li>
                  <li>• Verify responsive design</li>
                  <li>• Cross-browser compatibility</li>
                  <li>• Touch interface optimization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Guide */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white">Quick Start Testing Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <h4 className="text-white font-medium mb-2">Sign Up</h4>
              <p className="text-sm text-slate-400">Create a new account using the sign-up button</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-amber-400 font-bold">2</span>
              </div>
              <h4 className="text-white font-medium mb-2">Set Admin Role</h4>
              <p className="text-sm text-slate-400">Change role to "admin" in Workspace → Data → User</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-400 font-bold">3</span>
              </div>
              <h4 className="text-white font-medium mb-2">Test Features</h4>
              <p className="text-sm text-slate-400">Access Admin Panel and test all functionalities</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact for Support */}
      <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Need Help Testing?</h3>
          <p className="text-slate-300 mb-4">
            If you encounter any issues during testing or need assistance with admin features, 
            feel free to reach out for support.
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              Platform Status: Active
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              All Features: Operational
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}