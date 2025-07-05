import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Users, ArrowLeft, Smile, Image, Mic, MicOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [participants, setParticipants] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (roomId) {
      fetchRoomData();
      subscribeToUpdates();
    }
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchRoomData = async () => {
    try {
      const { data: room } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (!room) {
        toast({
          title: "Room not found",
          description: "This room doesn't exist or has been deleted.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      // Fetch participants
      const { data: participantData } = await supabase
        .from('room_participants')
        .select(`
          *,
          profiles(display_name, avatar_url, username)
        `)
        .eq('room_id', roomId);

      setParticipants(participantData || []);

      // Fetch messages
      const { data: messageData } = await supabase
        .from('messages')
        .select(`
          *,
          profiles(display_name, avatar_url, username)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      setMessages(messageData || []);
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel(`room-${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, () => {
        fetchRoomData();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'room_participants',
        filter: `room_id=eq.${roomId}`
      }, () => {
        fetchRoomData();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      await supabase
        .from('messages')
        .insert({
          content: newMessage,
          room_id: roomId,
          user_id: user.id,
          type: 'text'
        });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-cosmic">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-display font-bold text-holographic">Chat Room</h1>
          <Badge variant="secondary" className="ml-auto">
            <Users className="h-4 w-4 mr-1" />
            {participants.length} online
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Main Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="glass-card flex-1 flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={message.profiles?.avatar_url} />
                          <AvatarFallback>
                            {message.profiles?.display_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-neon-cyan text-sm">
                              {message.profiles?.display_name || message.profiles?.username || 'Unknown User'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(message.created_at)}
                            </span>
                          </div>
                          <p className="text-sm break-words">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <Separator />

                {/* Message Input */}
                <div className="p-4 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Image className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${isRecording ? 'text-red-500' : ''}`}
                        onClick={() => setIsRecording(!isRecording)}
                      >
                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                    </div>
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Online Users */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Online ({participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.profiles?.avatar_url} />
                      <AvatarFallback>
                        {participant.profiles?.display_name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {participant.profiles?.display_name || participant.profiles?.username || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                    <div className="w-2 h-2 bg-neon-green rounded-full pulse-online"></div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Room Info */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Room Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Invite Friends
                </Button>
                <Button variant="outline" className="w-full">
                  Room Settings
                </Button>
                <Button variant="destructive" className="w-full">
                  Leave Room
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;