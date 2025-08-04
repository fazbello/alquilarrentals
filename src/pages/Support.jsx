
import React, { useState, useEffect } from "react";
import { Chat } from "@/api/entities";
import { Message } from "@/api/entities";
import { User } from "@/api/entities";
import { createPageUrl } from '@/utils';
import { 
  MessageCircle,
  Send,
  Plus,
  Phone,
  Mail,
  MapPin,
  LifeBuoy,
  Ticket,
  Circle,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Support() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatForm, setNewChatForm] = useState({
    subject: '',
    priority: 'normal',
    message: ''
  });
  const [activeTab, setActiveTab] = useState('live_chat');
  const [supportAgents, setSupportAgents] = useState([]);

  useEffect(() => {
    loadData();
    // Simulate fetching online agents
    setSupportAgents([
      { name: 'Alex', role: 'Booking Specialist', online: true, image: 'https://i.pravatar.cc/150?u=alex' },
      { name: 'Sarah', role: 'Technical Support', online: true, image: 'https://i.pravatar.cc/150?u=sarah' },
      { name: 'Michael', role: 'General Inquiries', online: false, image: 'https://i.pravatar.cc/150?u=michael' },
    ]);
  }, []);

  useEffect(() => {
    if (activeChat) {
      loadMessages();
      if (activeTab === 'live_chat') {
        const interval = setInterval(loadMessages, 5000); // Poll for new messages every 5 seconds
        return () => clearInterval(interval);
      }
    }
  }, [activeChat, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      const chatsData = await Chat.filter({ user_id: userData.id }, '-last_message_at');
      setChats(chatsData);
      if (chatsData.length > 0 && !activeChat) {
        // Find first open or in_progress chat for live chat tab
        const firstOpen = chatsData.find(c => c.status === 'open' || c.status === 'in_progress');
        setActiveChat(firstOpen || chatsData[0]);
      }
    } catch (error) {
      console.error("User not authenticated, showing guest view:", error);
      setUser(null); // Keep user null to indicate unauthenticated state
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!activeChat) return;
    try {
      const messagesData = await Message.filter({ chat_id: activeChat.id }, 'created_date');
      setMessages(messagesData);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;
    try {
      await Message.create({ chat_id: activeChat.id, sender_id: user.id, sender_type: 'user', content: newMessage, message_type: 'text' });
      await Chat.update(activeChat.id, { last_message_at: new Date().toISOString(), status: 'in_progress' });
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCreateChat = async () => {
    if (!newChatForm.subject.trim() || !newChatForm.message.trim()) return;
    try {
      const chat = await Chat.create({ user_id: user.id, subject: newChatForm.subject, priority: newChatForm.priority, status: 'open', last_message_at: new Date().toISOString() });
      await Message.create({ chat_id: chat.id, sender_id: user.id, sender_type: 'user', content: newChatForm.message, message_type: 'text' });
      setNewChatForm({ subject: '', priority: 'normal', message: '' });
      setShowNewChat(false);
      await loadData(); // reload all data
      setActiveChat(chat);
      setActiveTab('live_chat');
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const getStatusColor = (status) => ({ open: 'border-blue-400 text-blue-400', assigned: 'border-yellow-400 text-yellow-400', in_progress: 'border-purple-400 text-purple-400', resolved: 'border-green-400 text-green-400', closed: 'border-gray-400 text-gray-400' }[status] || 'border-gray-400 text-gray-400');
  const getPriorityColor = (priority) => ({ urgent: 'border-red-400 text-red-400', high: 'border-orange-400 text-orange-400', normal: 'border-blue-400 text-blue-400', low: 'border-gray-400 text-gray-400' }[priority] || 'border-gray-400 text-gray-400');
  
  const SupportAgentList = () => (
    <div className="space-y-3">
      <h4 className="text-white font-semibold">Available Agents</h4>
      {supportAgents.map(agent => (
         <div key={agent.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
           <Avatar className="w-10 h-10 relative">
             <AvatarImage src={agent.image} />
             <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
             <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 ${agent.online ? 'bg-green-500' : 'bg-slate-500'}`} />
           </Avatar>
           <div>
             <p className="font-medium text-white">{agent.name}</p>
             <p className="text-sm text-slate-400">{agent.role}</p>
           </div>
         </div>
      ))}
    </div>
  );

  const ChatInterface = () => (
    <div className="lg:col-span-3">
        {!activeChat ? (
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg flex flex-col items-center justify-center p-8 text-center space-y-6">
                <MessageCircle className="w-16 h-16 text-slate-500" />
                <h3 className="text-xl font-semibold text-white">Start a Conversation</h3>
                <p className="text-slate-400 max-w-sm">Our support team is here to help you with any questions about bookings, payments, or your account.</p>
                <DialogTrigger asChild><Button className="bg-amber-500 hover:bg-amber-600 text-black"><Plus className="w-4 h-4 mr-2" /> Start a New Chat</Button></DialogTrigger>
                <div className="pt-6 w-full max-w-sm">
                   <SupportAgentList />
                </div>
            </Card>
        ) : (
            <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
              <div className="space-y-2 overflow-y-auto pr-2">
                {chats.map((chat) => (
                  <div key={chat.id} onClick={() => setActiveChat(chat)} className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${activeChat?.id === chat.id ? 'bg-amber-500/20 border-amber-500/30' : 'bg-white/5 border-white/10 hover:border-amber-500/30'}`}>
                    <h4 className="text-white font-medium text-sm truncate mb-1">{chat.subject}</h4>
                    <span className="text-xs text-slate-400">ID: #{chat.id.slice(0,6)}...</span>
                  </div>
                ))}
                 <DialogTrigger asChild><Button variant="outline" className="w-full mt-4"><Plus className="w-4 h-4 mr-2" /> New Chat</Button></DialogTrigger>
              </div>
              
              <div className="lg:col-span-2">
                <Card className="bg-white/5 border-white/10 backdrop-blur-lg h-full flex flex-col">
                  <CardHeader className="border-b border-white/10 flex flex-row items-center justify-between">
                    <CardTitle className="text-white">{activeChat.subject}</CardTitle>
                    <Badge variant="outline" className={getStatusColor(activeChat.status)}>{activeChat.status}</Badge>
                  </CardHeader>
                  <CardContent className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex items-end gap-2 ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                           {message.sender_type !== 'user' && <Avatar className="w-8 h-8"><AvatarImage src={supportAgents[0].image} /><AvatarFallback>S</AvatarFallback></Avatar>}
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender_type === 'user' ? 'bg-amber-500 text-black' : 'bg-white/10 text-white'}`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 text-right ${message.sender_type === 'user' ? 'text-black/60' : 'text-slate-400'}`}>{formatTime(message.created_date)}</p>
                          </div>
                           {message.sender_type === 'user' && <Avatar className="w-8 h-8"><AvatarImage src={user?.profile_image} /><AvatarFallback>{user?.full_name?.charAt(0)}</AvatarFallback></Avatar>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <div className="border-t border-white/10 p-4">
                    <div className="flex gap-2">
                      <Input placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="bg-white/5 border-white/10 text-white flex-1" />
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="bg-amber-500 hover:bg-amber-600 text-black"><Send className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
        )}
    </div>
  );

  const TicketingSystem = () => (
    <div className="space-y-4 lg:col-span-3">
       {chats.length === 0 ? (
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <Ticket className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Support Tickets</h3>
                  <p className="text-slate-400 mb-4">You can create a new ticket to get help.</p>
                </div>
            </Card>
        ) : (
          <div className="space-y-4">
            {chats.map(chat => (
              <Card key={chat.id} className="bg-white/5 border-white/10">
                  <CardHeader>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div>
                              <CardTitle className="text-white">{chat.subject}</CardTitle>
                              <p className="text-sm text-slate-400">Last update: {new Date(chat.last_message_at).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-3 mt-2 sm:mt-0">
                              <Badge variant="outline" className={getStatusColor(chat.status)}>{chat.status}</Badge>
                              <Badge variant="outline" className={getPriorityColor(chat.priority)}>{chat.priority}</Badge>
                          </div>
                      </div>
                  </CardHeader>
                  <CardContent>
                      <Button onClick={() => { setActiveChat(chat); setActiveTab('live_chat'); }}>Open Chat</Button>
                  </CardContent>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
  
  if (isLoading) return <div className="p-8"><div className="animate-pulse h-96 bg-white/5 rounded-xl"></div></div>;

  if (!user) {
    return (
       <div className="p-4 md:p-8 grid lg:grid-cols-4 gap-8">
         <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                <CardHeader><CardTitle className="text-white text-lg">Quick Contact</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-amber-400" /><div><p className="text-white font-medium">+1 (555) 123-4567</p><p className="text-xs text-slate-400">24/7 Support</p></div></div>
                  <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-amber-400" /><div><p className="text-white font-medium">support@alquilar.co.uk</p><p className="text-xs text-slate-400">Email Support</p></div></div>
                  <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-amber-400" /><div><p className="text-white font-medium">123 Elite Drive</p><p className="text-xs text-slate-400">London, UK</p></div></div>
                </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
             <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                <CardContent className="p-12 text-center flex flex-col items-center gap-4">
                    <Lock className="w-16 h-16 text-amber-400" />
                    <h2 className="text-2xl font-bold text-white">Login Required</h2>
                    <p className="text-slate-400">
                    You must be logged in to use live chat and manage support tickets.
                    </p>
                    <Button onClick={() => window.location.href = createPageUrl('index')} className="bg-amber-500 hover:bg-amber-600 text-black">Go to Login</Button>
                </CardContent>
            </Card>
          </div>
       </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Customer Support</h1>
          <p className="text-slate-400">Get help from our dedicated support team</p>
        </div>
        <Dialog open={showNewChat} onOpenChange={setShowNewChat}>
          <DialogTrigger asChild><Button className="bg-amber-500 hover:bg-amber-600 text-black"><Plus className="w-4 h-4 mr-2" /> New Ticket</Button></DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 text-white">
            <DialogHeader><DialogTitle>Create Support Ticket</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div><Label className="text-slate-400">Subject</Label><Input placeholder="Brief description of your issue..." value={newChatForm.subject} onChange={(e) => setNewChatForm({...newChatForm, subject: e.target.value})} className="bg-white/5 border-white/10 text-white"/></div>
              <div><Label className="text-slate-400">Priority</Label><Select value={newChatForm.priority} onValueChange={(value) => setNewChatForm({...newChatForm, priority: value})}><SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-900 border-slate-700 text-white"><SelectItem value="low">Low</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select></div>
              <div><Label className="text-slate-400">Message</Label><textarea placeholder="Please describe your issue in detail..." value={newChatForm.message} onChange={(e) => setNewChatForm({...newChatForm, message: e.target.value})} className="w-full h-32 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 resize-none"/></div>
              <div className="flex justify-end gap-3 pt-4"><Button variant="outline" onClick={() => setShowNewChat(false)}>Cancel</Button><Button onClick={handleCreateChat} className="bg-amber-500 hover:bg-amber-600 text-black">Create Ticket</Button></div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                <CardHeader><CardTitle className="text-white text-lg">Quick Contact</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-amber-400" /><div><p className="text-white font-medium">+1 (555) 123-4567</p><p className="text-xs text-slate-400">24/7 Support</p></div></div>
                  <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-amber-400" /><div><p className="text-white font-medium">support@alquilar.co.uk</p><p className="text-xs text-slate-400">Email Support</p></div></div>
                  <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-amber-400" /><div><p className="text-white font-medium">123 Elite Drive</p><p className="text-xs text-slate-400">London, UK</p></div></div>
                </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg hidden lg:block">
                <CardHeader><CardTitle className="text-white text-lg">Agent Status</CardTitle></CardHeader>
                <CardContent>
                   <SupportAgentList />
                </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="live_chat" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="live_chat"><LifeBuoy className="w-4 h-4 mr-2"/>Live Chat</TabsTrigger>
                <TabsTrigger value="tickets"><Ticket className="w-4 h-4 mr-2"/>My Tickets</TabsTrigger>
              </TabsList>
              <TabsContent value="live_chat" className="mt-4">
                <ChatInterface />
              </TabsContent>
              <TabsContent value="tickets" className="mt-4">
                <TicketingSystem />
              </TabsContent>
            </Tabs>
          </div>
      </div>
    </div>
  );
}
