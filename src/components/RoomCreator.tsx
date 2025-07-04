import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Music, Video, Users, Image } from 'lucide-react';

const RoomCreator = () => {
  const [roomType, setRoomType] = useState<'music' | 'watch' | 'hangout'>('music');
  const [roomName, setRoomName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createRoom = async () => {
    if (!user || !roomName.trim()) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          name: roomName.trim(),
          type: roomType,
          creator_id: user.id,
          is_private: false,
          current_participants: 1
        })
        .select()
        .single();

      if (error) throw error;

      // Join the room as creator
      await supabase
        .from('room_participants')
        .insert({
          room_id: data.id,
          user_id: user.id
        });

      toast({
        title: "Room created!",
        description: `Your ${selectedRoom.title.toLowerCase()} "${roomName}" is ready`,
      });

      setRoomName('');
      
      // Could navigate to room here in the future
      // router.push(`/room/${data.id}`);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const roomTypes = [
    {
      id: 'music' as const,
      title: 'Music Room',
      description: 'Listen to music together',
      icon: Music,
      gradient: 'from-neon-green to-neon-cyan',
      examples: ['Lo-fi Study Session', 'Party Playlist', 'New Music Discovery']
    },
    {
      id: 'watch' as const,
      title: 'Watch Party',
      description: 'Watch videos together',
      icon: Video,
      gradient: 'from-neon-pink to-neon-orange',
      examples: ['Movie Night', 'YouTube Marathon', 'Anime Watching']
    },
    {
      id: 'hangout' as const,
      title: 'Hangout Room',
      description: 'Just chill and chat',
      icon: Users,
      gradient: 'from-primary to-neon-cyan',
      examples: ['Study Group', 'Game Chat', 'Random Vibes']
    }
  ];

  const selectedRoom = roomTypes.find(room => room.id === roomType)!;

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-xl font-semibold mb-6 text-holographic">Create a New Room</h2>
      
      {/* Room Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {roomTypes.map((room) => (
          <Card 
            key={room.id} 
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              roomType === room.id 
                ? 'ring-2 ring-primary glow-primary bg-secondary' 
                : 'glass hover:bg-secondary/50'
            }`}
            onClick={() => setRoomType(room.id)}
          >
            <CardHeader className="text-center pb-2">
              <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${room.gradient} flex items-center justify-center mb-2`}>
                <room.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-sm">{room.title}</CardTitle>
              <CardDescription className="text-xs">{room.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Room Configuration */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="roomName" className="text-sm font-medium">Room Name</Label>
          <Input
            id="roomName"
            placeholder={`e.g., ${selectedRoom.examples[Math.floor(Math.random() * selectedRoom.examples.length)]}`}
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="mt-1 glass border-0 focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Room Features */}
        <div className="glass p-4 rounded-xl">
          <h4 className="font-medium mb-3 flex items-center">
            <selectedRoom.icon className="h-4 w-4 mr-2 text-neon-cyan" />
            {selectedRoom.title} Features
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-green rounded-full"></div>
              <span>Voice chat</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-cyan rounded-full"></div>
              <span>Text chat</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-pink rounded-full"></div>
              <span>Screen share</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-orange rounded-full"></div>
              <span>Reactions</span>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <Button 
          onClick={createRoom}
          className={`w-full glow-primary bg-gradient-to-r ${selectedRoom.gradient} text-white font-semibold py-3`}
          disabled={!roomName.trim() || isCreating}
        >
          <selectedRoom.icon className="h-4 w-4 mr-2" />
          {isCreating ? 'Creating...' : `Create ${selectedRoom.title}`}
        </Button>
      </div>
    </div>
  );
};

export default RoomCreator;