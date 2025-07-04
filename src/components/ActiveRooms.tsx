import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Music, Video, Users, Headphones, Mic, Play } from 'lucide-react';

const ActiveRooms = () => {
  const activeRooms = [
    {
      id: 1,
      name: 'Lo-fi Study Vibes',
      type: 'music',
      host: 'Alex Chen',
      members: 8,
      maxMembers: 20,
      currentTrack: 'Midnight Jazz - Chill Beats',
      thumbnail: '/placeholder.svg',
      isPlaying: true,
      listeners: [
        { name: 'Maya', avatar: '/placeholder.svg' },
        { name: 'Jordan', avatar: '/placeholder.svg' },
        { name: 'Sam', avatar: '/placeholder.svg' },
      ]
    },
    {
      id: 2,
      name: 'Marvel Movie Marathon',
      type: 'watch',
      host: 'Maya Rodriguez',
      members: 12,
      maxMembers: 15,
      currentTrack: 'Avengers: Endgame',
      thumbnail: '/placeholder.svg',
      isPlaying: true,
      listeners: [
        { name: 'Alex', avatar: '/placeholder.svg' },
        { name: 'Casey', avatar: '/placeholder.svg' },
        { name: 'Riley', avatar: '/placeholder.svg' },
      ]
    },
    {
      id: 3,
      name: 'Late Night Hangout',
      type: 'hangout',
      host: 'Jordan Kim',
      members: 5,
      maxMembers: 10,
      currentTrack: 'Just vibing and chatting',
      thumbnail: '/placeholder.svg',
      isPlaying: false,
      listeners: [
        { name: 'Sam', avatar: '/placeholder.svg' },
        { name: 'Taylor', avatar: '/placeholder.svg' },
      ]
    }
  ];

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

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <div className="w-3 h-3 bg-neon-cyan rounded-full pulse-online mr-2"></div>
        Active Rooms ({activeRooms.length})
      </h3>

      <div className="space-y-4">
        {activeRooms.map((room) => {
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
                    <p className="text-sm text-muted-foreground">Hosted by {room.host}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {room.members}/{room.maxMembers}
                </Badge>
              </div>

              {/* Current activity */}
              <div className="flex items-center space-x-2 mb-3 p-2 bg-secondary/30 rounded-lg">
                {room.isPlaying ? (
                  <Play className="h-3 w-3 text-neon-green" />
                ) : (
                  <div className="w-3 h-3 bg-muted rounded-full" />
                )}
                <span className="text-sm text-muted-foreground truncate">{room.currentTrack}</span>
              </div>

              {/* Members preview */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {room.listeners.slice(0, 3).map((listener, i) => (
                      <Avatar key={i} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={listener.avatar} alt={listener.name} />
                        <AvatarFallback className="text-xs">{listener.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                    {room.members > 3 && (
                      <div className="h-6 w-6 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                        <span className="text-xs">+{room.members - 3}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Headphones className="h-3 w-3" />
                    <span>{room.members}</span>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className={`opacity-0 group-hover:opacity-100 transition-smooth glow-primary bg-gradient-to-r ${getRoomGradient(room.type)}`}
                >
                  Join Room
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick join section */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-sm">Quick Join</h4>
            <p className="text-xs text-muted-foreground">Enter a room code</p>
          </div>
          <Button size="sm" variant="ghost" className="hover:glow-neon">
            Enter Code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActiveRooms;