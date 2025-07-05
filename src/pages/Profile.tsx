import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User, Edit, Save, X, Camera, Settings, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    display_name: '',
    username: '',
    bio: '',
    avatar_url: '',
    status: 'online'
  });
  const [originalProfile, setOriginalProfile] = useState(profile);
  const [stats, setStats] = useState({
    totalRooms: 0,
    friendsCount: 0,
    hoursListened: 0
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        const profileData = {
          display_name: data.display_name || '',
          username: data.username || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          status: data.status || 'online'
        };
        setProfile(profileData);
        setOriginalProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Get rooms created by user
      const { data: roomsData } = await supabase
        .from('rooms')
        .select('id')
        .eq('creator_id', user?.id);

      // Get friends count
      const { data: friendsData } = await supabase
        .from('friends')
        .select('id')
        .eq('user_id', user?.id)
        .eq('status', 'accepted');

      setStats({
        totalRooms: roomsData?.length || 0,
        friendsCount: friendsData?.length || 0,
        hoursListened: Math.floor(Math.random() * 100) // Placeholder
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setOriginalProfile(profile);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-cosmic">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-holographic mb-2">Your Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="text-2xl">
                      {profile.display_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button 
                      variant="neon" 
                      size="icon" 
                      className="absolute -bottom-2 -right-2 h-8 w-8"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary" className="bg-neon-green/20 text-neon-green">
                    {profile.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isEditing ? (
                  <>
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold text-holographic">
                        {profile.display_name || 'No display name set'}
                      </h2>
                      <p className="text-muted-foreground">@{profile.username || 'username'}</p>
                      <p className="text-sm">
                        {profile.bio || 'No bio added yet. Tell us about yourself!'}
                      </p>
                    </div>
                    <Separator />
                    <div className="flex justify-center">
                      <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="display_name">Display Name</Label>
                      <Input
                        id="display_name"
                        value={profile.display_name}
                        onChange={(e) => handleInputChange('display_name', e.target.value)}
                        placeholder="Your display name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        placeholder="Your username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats & Settings Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-cyan">{stats.totalRooms}</div>
                  <div className="text-sm text-muted-foreground">Rooms Created</div>
                </div>
                <Separator />
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-pink">{stats.friendsCount}</div>
                  <div className="text-sm text-muted-foreground">Friends</div>
                </div>
                <Separator />
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-green">{stats.hoursListened}h</div>
                  <div className="text-sm text-muted-foreground">Hours Listened</div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="text-sm">{user?.email}</p>
                </div>
                <Separator />
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Privacy Settings
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;