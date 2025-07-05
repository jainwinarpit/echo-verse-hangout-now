import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, Pause, SkipForward, SkipBack, Volume2, Users, MessageCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MusicRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('No track selected');
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
          <h1 className="text-2xl font-display font-bold text-holographic">Music Room</h1>
          <Badge variant="secondary" className="ml-auto">
            <Users className="h-4 w-4 mr-1" />
            {participants.length} listening
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Music Player */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-holographic">Now Playing</CardTitle>
                <CardDescription>{currentTrack}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Album Art Placeholder */}
                <div className="aspect-square bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 rounded-xl flex items-center justify-center">
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`wave ${isPlaying ? '' : 'opacity-30'}`} />
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div className="bg-gradient-to-r from-neon-cyan to-neon-pink h-2 rounded-full w-1/3"></div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button variant="ghost" size="icon">
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="neon" 
                    size="icon" 
                    className="w-12 h-12"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Playlist */}
            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle>Playlist</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  No tracks in playlist. Music sync feature coming soon!
                </p>
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
                  Listening ({participants.length})
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
                  Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-64 overflow-y-auto space-y-2">
                  {messages.map((message) => (
                    <div key={message.id} className="text-sm">
                      <span className="font-medium text-neon-cyan">
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

export default MusicRoom;