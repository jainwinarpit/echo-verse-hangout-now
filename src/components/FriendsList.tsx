import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Send } from 'lucide-react';

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  profiles: {
    username: string;
    display_name: string;
    avatar_url: string;
    status: string;
  } | null;
}

const FriendsList = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchFriendRequests();
    }
  }, [user]);

  const fetchFriends = async () => {
    if (!user) return;

    // Use manual join since foreign key relationships don't exist yet
    const { data: friendsData, error } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'accepted');

    if (error) {
      console.error('Error fetching friends:', error);
      return;
    }

    if (friendsData) {
      const friendsWithProfiles = await Promise.all(
        friendsData.map(async (friend) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, display_name, avatar_url, status')
            .eq('user_id', friend.friend_id)
            .single();
          
          return { ...friend, profiles: profile };
        })
      );
      setFriends(friendsWithProfiles.filter(f => f.profiles));
    }
  };

  const fetchFriendRequests = async () => {
    if (!user) return;

    // Get friend requests with manual join
    const { data: requestsData, error } = await supabase
      .from('friends')
      .select('*')
      .eq('friend_id', user.id)
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching friend requests:', error);
      setLoading(false);
      return;
    }

    if (requestsData) {
      const requestsWithProfiles = await Promise.all(
        requestsData.map(async (request) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, display_name, avatar_url, status')
            .eq('user_id', request.user_id)
            .single();
          
          return { ...request, profiles: profile };
        })
      );
      setFriendRequests(requestsWithProfiles.filter(r => r.profiles));
    }
    setLoading(false);
  };

  const acceptFriendRequest = async (requestId: string, friendUserId: string) => {
    const { error } = await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to accept friend request",
        variant: "destructive",
      });
    } else {
      // Also create the reverse relationship
      await supabase
        .from('friends')
        .insert({
          user_id: user?.id,
          friend_id: friendUserId,
          status: 'accepted'
        });

      toast({
        title: "Friend added!",
        description: "You are now friends",
      });
      
      fetchFriends();
      fetchFriendRequests();
    }
  };

  const declineFriendRequest = async (requestId: string) => {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', requestId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to decline friend request",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Request declined",
        description: "Friend request has been declined",
      });
      fetchFriendRequests();
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-neon-green';
      case 'away': return 'bg-neon-orange';
      case 'busy': return 'bg-neon-pink';
      default: return 'bg-muted';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="text-center text-muted-foreground">Loading friends...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-neon-cyan" />
            Friend Requests
            <Badge className="ml-2 bg-destructive text-destructive-foreground">
              {friendRequests.length}
            </Badge>
          </h3>

          <div className="space-y-3">
            {friendRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-smooth">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={request.profiles.avatar_url} alt={request.profiles.display_name} />
                    <AvatarFallback>{request.profiles.display_name?.charAt(0) || request.profiles.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.profiles.display_name || request.profiles.username}</p>
                    <p className="text-sm text-muted-foreground">@{request.profiles.username}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="glow-primary"
                    onClick={() => acceptFriendRequest(request.id, request.user_id)}
                  >
                    Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => declineFriendRequest(request.id)}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Online Friends */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <div className="w-3 h-3 bg-neon-green rounded-full pulse-online mr-2"></div>
          Friends ({friends.length})
        </h3>

        {friends.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No friends yet</p>
            <p className="text-sm">Start by adding some friends to hang out!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-smooth group">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={friend.profiles.avatar_url} alt={friend.profiles.display_name} />
                      <AvatarFallback>{friend.profiles.display_name?.charAt(0) || friend.profiles.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getActivityColor(friend.profiles.status)} rounded-full border-2 border-background`}></div>
                  </div>
                  <div>
                    <p className="font-medium">{friend.profiles.display_name || friend.profiles.username}</p>
                    <p className="text-sm text-muted-foreground capitalize">{friend.profiles.status}</p>
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
        )}
      </div>
    </div>
  );
};

export default FriendsList;