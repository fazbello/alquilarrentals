import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Car } from '@/api/entities';
import { Booking } from '@/api/entities';
import { verifyIdentity } from '@/api/functions';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from 'react-router-dom';
import AdminManageTemplates from './AdminManageTemplates';
import {
  Users,
  ShieldCheck,
  Car as CarIcon,
  Calendar,
  CheckCircle,
  XCircle,
  Mail
} from 'lucide-react';

export default function AdminPanel() {
  const [stats, setStats] = useState({ users: 0, verified: 0, cars: 0, bookings: 0 });
  const [verifications, setVerifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const adminUser = await User.me();
      if(adminUser.role !== 'admin'){
         window.location.href = createPageUrl('Dashboard');
         return;
      }

      const allUsers = await User.list();
      const allCars = await Car.list();
      const allBookings = await Booking.list();

      const pendingVerifications = allUsers.filter(u => u.identification?.verification_status === 'pending');

      setUsers(allUsers);
      setVerifications(pendingVerifications);
      setStats({
        users: allUsers.length,
        verified: allUsers.filter(u => u.identification?.verification_status === 'approved').length,
        cars: allCars.length,
        bookings: allBookings.length,
      });

    } catch (error) {
      console.error("Redirecting, user not authenticated as admin:", error);
      window.location.href = createPageUrl('index');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (userId, status) => {
    try {
      await verifyIdentity({ user_id: userId, verification_status: status, notes: `${status} by admin` });
      fetchData();
    } catch (error) {
      console.error(`Failed to ${status} verification:`, error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
        {React.cloneElement(icon, { className: `h-4 w-4 ${color}` })}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="p-8 text-white">Loading Admin Panel...</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Platform overview and management tools.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats.users} icon={<Users />} color="text-blue-400" />
        <StatCard title="Verified Users" value={stats.verified} icon={<ShieldCheck />} color="text-green-400" />
        <StatCard title="Fleet Size" value={stats.cars} icon={<CarIcon />} color="text-amber-400" />
        <StatCard title="Total Bookings" value={stats.bookings} icon={<Calendar />} color="text-purple-400" />
      </div>

      <Tabs defaultValue="verifications">
        <TabsList className="bg-white/10">
          <TabsTrigger value="verifications">
            Verification Queue <Badge className="ml-2 bg-red-500">{verifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="verifications" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Pending ID Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-b-white/10">
                    <TableHead className="text-white">User</TableHead>
                    <TableHead className="text-white">Document Type</TableHead>
                    <TableHead className="text-white">Document</TableHead>
                    <TableHead className="text-right text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verifications.length > 0 ? verifications.map(user => (
                    <TableRow key={user.id} className="border-b-white/10">
                      <TableCell>
                        <div className="font-medium text-white">{user.full_name}</div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                      </TableCell>
                      <TableCell className="text-slate-300 capitalize">{user.identification?.document_type?.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <a href={user.identification?.document_url} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
                          View Document
                        </a>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline" className="text-green-400 border-green-400 hover:bg-green-400/10 hover:text-green-300" onClick={() => handleVerification(user.id, 'approved')}>
                          <CheckCircle className="w-4 h-4 mr-2" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-400 border-red-400 hover:bg-red-400/10 hover:text-red-300" onClick={() => handleVerification(user.id, 'rejected')}>
                          <XCircle className="w-4 h-4 mr-2" /> Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan="4" className="text-center text-slate-400 py-8">
                        No pending verifications. Great job!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">All Users</CardTitle>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow className="border-b-white/10">
                    <TableHead className="text-white">User</TableHead>
                    <TableHead className="text-white">Role</TableHead>
                    <TableHead className="text-white">Verification</TableHead>
                    <TableHead className="text-right text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id} className="border-b-white/10">
                      <TableCell>
                        <div className="font-medium text-white">{user.full_name}</div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'outline'} className={user.role === 'admin' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'text-slate-300'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                         <Badge variant="outline" className={
                            user.identification?.verification_status === 'approved' ? 'text-green-400 border-green-400' :
                            user.identification?.verification_status === 'pending' ? 'text-yellow-400 border-yellow-400' :
                            'text-red-400 border-red-400'
                         }>
                          {user.identification?.verification_status || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={createPageUrl(`AdminUserDetails?id=${user.id}`)}>
                          <Button size="sm" variant="outline">Manage</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <AdminManageTemplates />
        </TabsContent>
      </Tabs>
    </div>
  );
}