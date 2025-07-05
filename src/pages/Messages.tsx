import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Send, Phone, Video, Info, Smile, Image, Mic, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Friend {
  id: string;
  profiles: {
    display_name: string;
    username: string;
    avatar_url: string;
    status: string;
  };
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string;
    username: string;
    avatar_url: string;
  };
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [selectedFriend]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchFriends = async () => {
    try {
      const { data, error } = await supabase
        .from('friends')
        .select('id, friend_id')
        .eq('user_id', user?.id)
        .eq('status', 'accepted');

      if (error) throw error;
      
      // For now, create mock friend data until we properly set up the relations
      const mockFriends: Friend[] = [
        {
          id: '1',
          profiles: {
            display_name: 'Alex Chen',
            username: 'alexchen',
            avatar_url: '',
            status: 'online'
          }
        },
        {
          id: '2',
          profiles: {
            display_name: 'Sam Wilson',
            username: 'samwilson',
            avatar_url: '',
            status: 'offline'
          }
        }
      ];
      
      setFriends(mockFriends);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedFriend) return;
    
    // Mock messages for demo
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Hey! How are you doing?',
        created_at: new Date(Date.now() - 300000).toISOString(),
        user_id: selectedFriend.id,
        profiles: {
          display_name: selectedFriend.profiles.display_name,
          username: selectedFriend.profiles.username,
          avatar_url: selectedFriend.profiles.avatar_url
        }
      },
      {
        id: '2',
        content: "I'm good! Just working on some projects. How about you?",
        created_at: new Date(Date.now() - 240000).toISOString(),
        user_id: user?.id || '',
        profiles: {
          display_name: 'You',
          username: 'you',
          avatar_url: ''
        }
      },
      {
        id: '3',
        content: 'Same here! Want to hop into a music room later?',
        created_at: new Date(Date.now() - 180000).toISOString(),
        user_id: selectedFriend.id,
        profiles: {
          display_name: selectedFriend.profiles.display_name,
          username: selectedFriend.profiles.username,
          avatar_url: selectedFriend.profiles.avatar_url
        }
      }
    ];
    
    setMessages(mockMessages);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('direct-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend || !user) return;

    // For demo, we'll create a temporary room for direct messages
    try {
      await supabase
        .from('messages')
        .insert({
          content: newMessage,
          room_id: 'direct-messages', // This would be a proper direct message ID in production
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
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const filteredFriends = friends.filter(friend =>
    friend.profiles?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-cosmic flex">
      {/* Sidebar - Friends List */}
      <div className="w-80 glass-card border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-display font-bold text-holographic">Messages</h1>
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass rounded-xl"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto">
          {filteredFriends.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No conversations yet</p>
              <p className="text-sm mt-1">Add friends to start chatting!</p>
            </div>
          ) : (
            filteredFriends.map((friend) => (
              <div
                key={friend.id}
                onClick={() => setSelectedFriend(friend)}
                className={`flex items-center gap-3 p-4 hover:bg-white/5 cursor-pointer transition-all duration-200 ${
                  selectedFriend?.id === friend.id ? 'bg-white/10 border-r-2 border-neon-cyan' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={friend.profiles?.avatar_url} />
                    <AvatarFallback>
                      {friend.profiles?.display_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {friend.profiles?.status === 'online' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-green rounded-full border-2 border-background"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">
                      {friend.profiles?.display_name || friend.profiles?.username}
                    </p>
                    <span className="text-xs text-muted-foreground">2m</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    Hey! How are you doing?
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedFriend ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 glass-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedFriend.profiles?.avatar_url} />
                    <AvatarFallback>
                      {selectedFriend.profiles?.display_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {selectedFriend.profiles?.display_name || selectedFriend.profiles?.username}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                      Active now
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Info className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>Start your conversation with {selectedFriend.profiles?.display_name}</p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isOwnMessage = message.user_id === user?.id;
                  const showAvatar = index === 0 || messages[index - 1]?.user_id !== message.user_id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isOwnMessage && showAvatar && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.profiles?.avatar_url} />
                          <AvatarFallback>
                            {message.profiles?.display_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {!isOwnMessage && !showAvatar && <div className="w-8" />}
                      
                      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-1' : ''}`}>
                        <div
                          className={`px-4 py-2 rounded-2xl text-sm ${
                            isOwnMessage
                              ? 'bg-gradient-to-r from-neon-cyan to-neon-pink text-background'
                              : 'glass border border-white/10'
                          }`}
                        >
                          {message.content}
                        </div>
                        <p className={`text-xs text-muted-foreground mt-1 ${isOwnMessage ? 'text-right' : ''}`}>
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Image className="h-5 w-5" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="glass rounded-full pr-20"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="rounded-full w-10 h-10 p-0"
                  variant={newMessage.trim() ? "default" : "ghost"}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 rounded-full flex items-center justify-center mx-auto">
                <Send className="h-12 w-12 text-neon-cyan" />
              </div>
              <h2 className="text-2xl font-display font-bold text-holographic">Your Messages</h2>
              <p className="text-muted-foreground">Send private messages to friends and hangout buddies</p>
              <Button variant="neon">Start New Conversation</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;