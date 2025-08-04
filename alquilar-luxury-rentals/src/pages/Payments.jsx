
import React, { useState, useEffect } from "react";
import { Payment } from "@/api/entities";
import { User } from "@/api/entities";
import { processPayment } from "@/api/functions";
import { createPageUrl } from '@/utils';
import { 
  CreditCard,
  DollarSign,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  MoreVertical,
  Banknote,
  Send,
  User as UserIcon,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Payments() {
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [fundsAmount, setFundsAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      const paymentsData = await Payment.filter({ user_id: userData.id }, '-created_date');
      setPayments(paymentsData);
      if (userData.payment_methods) {
        setPaymentMethods(userData.payment_methods);
        const defaultMethod = userData.payment_methods.find(pm => pm.is_default);
        if(defaultMethod) setSelectedMethod(defaultMethod.id);
      }
    } catch (error) {
      console.error("User not authenticated, showing guest view:", error);
      setUser(null); // Set user to null to allow rendering of guest view
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFunds = async () => {
    if (!fundsAmount || !selectedMethod) return;
    try {
      await processPayment({
        user_id: user.id,
        amount: parseFloat(fundsAmount),
        payment_method_id: selectedMethod,
        payment_type: 'deposit',
        description: 'Adding funds to account balance'
      });
      loadData();
      setShowAddFunds(false);
      setFundsAmount('');
    } catch (error) {
      console.error("Error adding funds:", error);
    }
  };
  
  const paymentIcons = {
    credit_card: <CreditCard className="w-6 h-6" />,
    paypal: <img src="https://www.paypalobjects.com/images/logos/paypal-mini.svg" alt="PayPal" className="w-6 h-6" />,
    zelle: <Send className="w-6 h-6 text-purple-600" />,
    bank_transfer: <Banknote className="w-6 h-6 text-green-600" />,
    account_balance: <UserIcon className="w-6 h-6 text-blue-600" />,
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <Badge variant="outline" className="text-green-400 border-green-400"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'pending': return <Badge variant="outline" className="text-yellow-400 border-yellow-400"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed': return <Badge variant="outline" className="text-red-400 border-red-400"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) return <div className="p-8 text-white">Loading...</div>;

  if (!user) {
    return (
       <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardContent className="p-12 text-center flex flex-col items-center gap-4">
            <Lock className="w-16 h-16 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Access Denied</h2>
            <p className="text-slate-400">
              Please log in to manage your balance and view payment history.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Payments & Balance</h1>
          <p className="text-slate-400">Manage your account balance and view transaction history.</p>
        </div>
        <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Add Funds
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 text-white">
            <DialogHeader><DialogTitle>Add Funds to Your Account</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="amount" className="text-slate-400">Amount (USD)</Label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input id="amount" type="number" placeholder="e.g., 500" value={fundsAmount} onChange={(e) => setFundsAmount(e.target.value)} className="bg-white/5 border-white/10 text-white pl-10" />
                </div>
              </div>
              <div>
                <Label htmlFor="payment_method" className="text-slate-400">Payment Method</Label>
                <Select onValueChange={setSelectedMethod} value={selectedMethod}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select a payment method" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        {paymentMethods.map(pm => (
                            <SelectItem key={pm.id} value={pm.id}>
                                {pm.type.replace('_', ' ')} - **** {pm.last_four}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-slate-500">Note: Zelle and Bank Transfer options are available but may require manual verification and take 1-3 business days to reflect in your balance.</p>
            </div>
            <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowAddFunds(false)}>Cancel</Button><Button onClick={handleAddFunds} className="bg-amber-500 hover:bg-amber-600 text-black">Add Funds</Button></div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-white">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">${(user?.account_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-amber-300/80 text-sm mt-1">Available for bookings</p>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Payment Methods</CardTitle>
            <CardDescription>Manage your saved payment options.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="credit_card">
                <TabsList>
                  <TabsTrigger value="credit_card">Cards</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
                <TabsContent value="credit_card" className="mt-4">
                  <p className="text-slate-400">Manage your saved credit and debit cards.</p>
                </TabsContent>
                 <TabsContent value="paypal" className="mt-4">
                  <p className="text-slate-400">Connect and manage your PayPal account.</p>
                </TabsContent>
                 <TabsContent value="other" className="mt-4">
                   <div className="space-y-2">
                     <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                       {paymentIcons.zelle}
                       <p className="text-white">Zelle Transfer: <span className="text-slate-300">payments@alquilar.co.uk</span></p>
                     </div>
                     <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                       {paymentIcons.bank_transfer}
                       <p className="text-white">Bank Transfer: <span className="text-slate-300">Details available upon request.</span></p>
                     </div>
                   </div>
                </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow className="border-b-white/10"><TableHead className="text-white">Date</TableHead><TableHead className="text-white">Type</TableHead><TableHead className="text-white">Method</TableHead><TableHead className="text-right text-white">Amount</TableHead><TableHead className="text-center text-white">Status</TableHead><TableHead className="text-right text-white">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {payments.map(p => (
                <TableRow key={p.id} className="border-b-white/10">
                  <TableCell className="text-slate-300">{new Date(p.created_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-white capitalize">{p.payment_type}</TableCell>
                  <TableCell className="text-slate-300 capitalize">{p.payment_method.replace('_', ' ')}</TableCell>
                  <TableCell className="text-right text-white font-medium">${p.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(p.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger><DropdownMenuContent className="bg-slate-900 border-slate-700 text-white"><DropdownMenuItem>View Details</DropdownMenuItem><DropdownMenuItem><Download className="w-4 h-4 mr-2" />Download Receipt</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
