import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Send } from 'lucide-react';

const FriendsList = () => {
  const onlineFriends = [
    { id: 1, name: 'Alex Chen', avatar: '/placeholder.svg', status: 'Listening to Lo-fi Hip Hop', activity: 'music' },
    { id: 2, name: 'Maya Rodriguez', avatar: '/placeholder.svg', status: 'Watching Netflix', activity: 'watch' },
    { id: 3, name: 'Jordan Kim', avatar: '/placeholder.svg', status: 'In a room', activity: 'room' },
    { id: 4, name: 'Sam Taylor', avatar: '/placeholder.svg', status: 'Online', activity: 'online' },
  ];

  const pendingRequests = [
    { id: 5, name: 'Riley Johnson', avatar: '/placeholder.svg', mutualFriends: 3 },
    { id: 6, name: 'Casey Wong', avatar: '/placeholder.svg', mutualFriends: 7 },
  ];

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'music': return 'bg-neon-green';
      case 'watch': return 'bg-neon-pink';
      case 'room': return 'bg-neon-cyan';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Friend Requests */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-neon-cyan" />
          Friend Requests
          {pendingRequests.length > 0 && (
            <Badge className="ml-2 bg-destructive text-destructive-foreground">
              {pendingRequests.length}
            </Badge>
          )}
        </h3>

        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-smooth">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={request.avatar} alt={request.name} />
                  <AvatarFallback>{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{request.name}</p>
                  <p className="text-sm text-muted-foreground">{request.mutualFriends} mutual friends</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" className="glow-primary">Accept</Button>
                <Button size="sm" variant="ghost">Decline</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Online Friends */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <div className="w-3 h-3 bg-neon-green rounded-full pulse-online mr-2"></div>
          Online Friends ({onlineFriends.length})
        </h3>

        <div className="space-y-3">
          {onlineFriends.map((friend) => (
            <div key={friend.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-smooth group">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getActivityColor(friend.activity)} rounded-full border-2 border-background`}></div>
                </div>
                <div>
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-sm text-muted-foreground">{friend.status}</p>
                </div>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-smooth">
                <Button size="sm" variant="ghost" className="hover:glow-neon">
                  <Send className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="hover:glow-primary">
                  Invite
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsList;