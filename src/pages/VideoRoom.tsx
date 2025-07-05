import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, Pause, Volume2, Users, MessageCircle, ArrowLeft, Maximize, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const VideoRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('No video selected');
  const [participants, setParticipants] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (roomId) {
      fetchRoomData();
      subscribeToUpdates();
    }
  }, [roomId]);

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
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Sync with other users
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
    }
  };

  return (
    <div className="min-h-screen bg-cosmic">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-display font-bold text-holographic">Watch Together</h1>
          <Badge variant="secondary" className="ml-auto">
            <Users className="h-4 w-4 mr-1" />
            {participants.length} watching
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <Card className="glass-card">
              <CardContent className="p-0">
                {/* Video Player Area */}
                <div className="aspect-video bg-gradient-to-br from-muted/30 to-background rounded-t-2xl flex items-center justify-center relative">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto">
                      <Play className="h-10 w-10 text-neon-cyan" />
                    </div>
                    <p className="text-muted-foreground">No video loaded</p>
                    <Button variant="neon">Load Video URL</Button>
                  </div>
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handlePlayPause}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                      <div className="flex-1 bg-white/20 rounded-full h-1 mx-4">
                        <div className="bg-neon-cyan h-1 rounded-full w-1/4"></div>
                      </div>
                      <span className="text-white text-sm">00:00 / 00:00</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Video Queue */}
            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle>Video Queue</CardTitle>
                <CardDescription>Add videos to watch together</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste YouTube, Vimeo, or direct video URL..."
                      className="flex-1 px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <Button>Add</Button>
                  </div>
                  <p className="text-muted-foreground text-center py-4">
                    No videos in queue. Add a video URL to start watching together!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Watching ({participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.profiles?.avatar_url} />
                      <AvatarFallback>
                        {participant.profiles?.display_name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {participant.profiles?.display_name || participant.profiles?.username || 'Unknown'}
                    </span>
                    <div className="w-2 h-2 bg-neon-green rounded-full ml-auto pulse-online"></div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-64 overflow-y-auto space-y-2">
                  {messages.map((message) => (
                    <div key={message.id} className="text-sm">
                      <span className="font-medium text-neon-pink">
                        {message.profiles?.display_name || 'User'}:
                      </span>
                      <span className="ml-2">{message.content}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button size="sm" onClick={sendMessage}>Send</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoRoom;