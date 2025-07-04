import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Music, Video, Users, Headphones, Mic, Play, Hash } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  type: string;
  creator_id: string;
  current_participants: number;
  max_participants: number;
  room_code: string;
  created_at: string;
  profiles?: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  participants: Array<{
    user_id: string;
    profiles: {
      username: string;
      display_name: string;
      avatar_url?: string;
    };
  }>;
}

const ActiveRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomCode, setRoomCode] = useState('');
  const [joiningRoom, setJoiningRoom] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchRooms();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchRooms = async () => {
    try {
      // Fetch rooms with manual creator profile join
      const { data: roomsData, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_private', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch creator profiles and participants manually
      const roomsWithDetails = await Promise.all(
        (roomsData || []).map(async (room) => {
          // Get creator profile
          const { data: creatorProfile } = await supabase
            .from('profiles')
            .select('username, display_name, avatar_url')
            .eq('user_id', room.creator_id)
            .single();

          // Get participants
          const { data: participantsData } = await supabase
            .from('room_participants')
            .select('user_id')
            .eq('room_id', room.id);

          const participants = await Promise.all(
            (participantsData || []).map(async (participant) => {
              const { data: profile } = await supabase
                .from('profiles')
                .select('username, display_name, avatar_url')
                .eq('user_id', participant.user_id)
                .single();
              
              return {
                user_id: participant.user_id,
                profiles: profile || { username: 'Unknown', display_name: 'Unknown', avatar_url: null }
              };
            })
          );

          return {
            ...room,
            profiles: creatorProfile || { username: 'Unknown', display_name: 'Unknown', avatar_url: null },
            participants,
            current_participants: participants.length
          };
        })
      );

      setRooms(roomsWithDetails as Room[]);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load rooms",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('rooms-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rooms' },
        () => fetchRooms()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'room_participants' },
        () => fetchRooms()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const joinRoom = async (roomId: string) => {
    if (!user) return;

    setJoiningRoom(roomId);
    try {
      // Check if already in room
      const { data: existingParticipant } = await supabase
        .from('room_participants')
        .select('id')
        .eq('room_id', roomId)
        .eq('user_id', user.id)
        .single();

      if (existingParticipant) {
        toast({
          title: "Already in room",
          description: "You're already a participant in this room",
        });
        return;
      }

      // Join the room
      const { error } = await supabase
        .from('room_participants')
        .insert({
          room_id: roomId,
          user_id: user.id
        });

      if (error) throw error;

      // Refresh rooms to update participant count
      fetchRooms();

      toast({
        title: "Joined room!",
        description: "You've successfully joined the room",
      });

      // Could navigate to room here in future
      // router.push(`/room/${roomId}`);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setJoiningRoom(null);
    }
  };

  const joinRoomByCode = async () => {
    if (!user || !roomCode.trim()) return;

    try {
      const { data: room, error } = await supabase
        .from('rooms')
        .select('id')
        .eq('room_code', roomCode.trim().toUpperCase())
        .single();

      if (error || !room) {
        toast({
          title: "Room not found",
          description: "Invalid room code. Please check and try again.",
          variant: "destructive",
        });
        return;
      }

      await joinRoom(room.id);
      setRoomCode('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join room by code",
        variant: "destructive",
      });
    }
  };

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'music': return Music;
      case 'watch': return Video;
      default: return Users;
    }
  };

  const getRoomGradient = (type: string) => {
    switch (type) {
      case 'music': return 'from-neon-green to-neon-cyan';
      case 'watch': return 'from-neon-pink to-neon-orange';
      default: return 'from-primary to-neon-cyan';
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <div className="text-center text-muted-foreground">Loading rooms...</div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <div className="w-3 h-3 bg-neon-cyan rounded-full pulse-online mr-2"></div>
        Active Rooms ({rooms.length})
      </h3>

      <div className="space-y-4">
        {rooms.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No active rooms</p>
            <p className="text-sm">Create a room to get started!</p>
          </div>
        ) : (
          rooms.map((room) => {
            const RoomIcon = getRoomIcon(room.type);
            return (
              <div key={room.id} className="glass p-4 rounded-xl hover:bg-secondary/50 transition-smooth group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getRoomGradient(room.type)} flex items-center justify-center`}>
                      <RoomIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">{room.name}</h4>
                      <p className="text-sm text-muted-foreground">Hosted by {room.profiles?.display_name || room.profiles?.username || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {room.current_participants}/{room.max_participants}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {room.room_code}
                    </Badge>
                  </div>
                </div>

                {/* Current activity */}
                <div className="flex items-center space-x-2 mb-3 p-2 bg-secondary/30 rounded-lg">
                  <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground truncate">
                    {room.type === 'music' ? 'Music session' : 
                     room.type === 'watch' ? 'Watch party' : 
                     'Hangout session'}
                  </span>
                </div>

                {/* Members preview */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {room.participants.slice(0, 3).map((participant, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-background">
                          <AvatarImage 
                            src={participant.profiles.avatar_url || undefined} 
                            alt={participant.profiles.display_name || participant.profiles.username} 
                          />
                          <AvatarFallback className="text-xs">
                            {(participant.profiles.display_name || participant.profiles.username)[0]}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {room.current_participants > 3 && (
                        <div className="h-6 w-6 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                          <span className="text-xs">+{room.current_participants - 3}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Headphones className="h-3 w-3" />
                      <span>{room.current_participants}</span>
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    onClick={() => joinRoom(room.id)}
                    disabled={joiningRoom === room.id}
                    className={`opacity-0 group-hover:opacity-100 transition-smooth glow-primary bg-gradient-to-r ${getRoomGradient(room.type)}`}
                  >
                    {joiningRoom === room.id ? 'Joining...' : 'Join Room'}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick join section */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-sm">Quick Join</h4>
            <p className="text-xs text-muted-foreground">Enter a room code</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="hover:glow-neon">
                <Hash className="h-4 w-4 mr-1" />
                Enter Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Room by Code</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter room code (e.g., ABC123)"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="text-center text-lg tracking-widest"
                />
                <Button 
                  onClick={joinRoomByCode}
                  disabled={!roomCode.trim()}
                  className="w-full"
                >
                  Join Room
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ActiveRooms;